import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, {status:401});
  try {
    const b = await request.json();
    const order = await prisma.order.update({
      where: { id: String(b.id) },
      data: {
        ...(b.status ? { status: b.status } : {}),
        ...(b.trackingNumber !== undefined ? { trackingNumber: String(b.trackingNumber || "") } : {}),
        ...(b.trackingUrl !== undefined ? { trackingUrl: String(b.trackingUrl || "") } : {})
      }
    });
    return NextResponse.json(order);
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:"Could not update order."},{status:400}); }
}
