import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const SHIPPING = { standard: 0, express: 1200 };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requested = Array.isArray(body.items) ? body.items : [];
    if (!requested.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

    const ids = requested.map((item: { id: string }) => item.id);
    const products = await prisma.product.findMany({ where: { id: { in: ids }, active: true } });
    const productMap = new Map(products.map(product => [product.id, product]));
    const items = requested.map((item: { id: string; quantity: number }) => {
      const product = productMap.get(item.id);
      const quantity = Math.min(10, Math.max(1, Number(item.quantity) || 1));
      if (!product) throw new Error("A product in your cart is no longer available.");
      return { product, quantity };
    });

    const subtotal = items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => sum + item.product.price * item.quantity, 0);
    let discount = 0;
    let discountCode: string | null = null;
    if (body.discountCode) {
      const d = await prisma.discountCode.findUnique({ where: { code: String(body.discountCode).trim().toUpperCase() } });
      if (d && d.active && (!d.expiresAt || d.expiresAt > new Date()) && (!d.usageLimit || d.usedCount < d.usageLimit) && subtotal >= d.minSubtotal) {
        discount = d.type === "PERCENT" ? Math.min(subtotal, Math.round(subtotal * d.value / 100)) : Math.min(subtotal, d.value);
        discountCode = d.code;
      }
    }

    const shippingMethod = body.shippingMethod === "express" ? "express" : "standard";
    const shipping = shippingMethod === "standard" && subtotal - discount >= 10000 ? 0 : SHIPPING[shippingMethod];
    const total = Math.max(0, subtotal - discount + shipping);

    const order = await prisma.order.create({
      data: {
        email: String(body.email || "pending@checkout.local"),
        customerName: body.customerName ? String(body.customerName) : null,
        phone: body.phone ? String(body.phone) : null,
        subtotal, discount, shipping, total, discountCode,
        items: { create: items.map((item: { product: { id: string; name: string; price: number; image: string | null }; quantity: number }) => ({ productId:item.product.id, name:item.product.name, price:item.product.price, quantity:item.quantity, image:item.product.image })) }
      }
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const stripe = getStripe();
    const discounts = discount > 0 ? [{ coupon: (await stripe.coupons.create({ amount_off: discount, currency: "eur", duration: "once", name: discountCode || "Discount" })).id }] : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item: { product: { id: string; name: string; price: number; image: string | null }; quantity: number }) => ({
        price_data: { currency: "eur", product_data: { name: item.product.name }, unit_amount: item.product.price },
        quantity: item.quantity
      })),
      discounts,
      customer_email: body.email ? String(body.email) : undefined,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["FR","DE","ES","IT","BE","NL","LU","AT","PT","GB","CH"] },
      shipping_options: [
        { shipping_rate_data: { type:"fixed_amount", fixed_amount:{amount: shippingMethod==="standard" ? shipping : 500, currency:"eur"}, display_name: shippingMethod==="standard" ? (shipping===0 ? "Standard delivery — FREE" : "Standard delivery") : "Standard delivery" } },
        { shipping_rate_data: { type:"fixed_amount", fixed_amount:{amount:1200, currency:"eur"}, display_name:"Express delivery" } }
      ],
      customer_creation: "always",
      metadata: { orderId: order.id },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`
    });

    await prisma.order.update({ where:{id:order.id}, data:{stripeSessionId:session.id} });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout failed." }, { status: 500 });
  }
}
