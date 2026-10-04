import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return new NextResponse("Missing signature.", {status:400});
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return new NextResponse("Invalid signature.", {status:400}); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const address = session.shipping_details?.address;
      await prisma.order.update({
        where:{id:orderId},
        data:{
          email: session.customer_details?.email || undefined,
          customerName: session.customer_details?.name || undefined,
          phone: session.customer_details?.phone || undefined,
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          status:"PAID",
          shipping: session.total_details?.amount_shipping || 0,
          total: session.amount_total || undefined,
          shippingName: session.shipping_details?.name || null,
          shippingLine1: address?.line1 || null,
          shippingLine2: address?.line2 || null,
          shippingCity: address?.city || null,
          shippingPostalCode: address?.postal_code || null,
          shippingCountry: address?.country || null,
          billingLine1: session.customer_details?.address?.line1 || null,
          billingCity: session.customer_details?.address?.city || null,
          billingPostalCode: session.customer_details?.address?.postal_code || null,
          billingCountry: session.customer_details?.address?.country || null
        }
      });
      const order = await prisma.order.findUnique({where:{id:orderId}});
      if (order?.discountCode) {
        await prisma.discountCode.updateMany({where:{code:order.discountCode}, data:{usedCount:{increment:1}}});
      }
    }
  }
  return NextResponse.json({received:true});
}
