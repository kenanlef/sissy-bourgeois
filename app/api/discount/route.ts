import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { code, subtotal } = await request.json();
  const item = await prisma.discountCode.findUnique({ where: { code: String(code || "").trim().toUpperCase() } });
  const now = new Date();
  if (!item || !item.active || (item.expiresAt && item.expiresAt < now) || (item.usageLimit && item.usedCount >= item.usageLimit)) {
    return NextResponse.json({ error: "This discount code is not valid." }, { status: 400 });
  }
  const cents = Math.max(0, Math.round(Number(subtotal) || 0));
  if (cents < item.minSubtotal) return NextResponse.json({ error: "Minimum order value not reached." }, { status: 400 });
  const discount = item.type === "PERCENT" ? Math.min(cents, Math.round(cents * item.value / 100)) : Math.min(cents, item.value);
  return NextResponse.json({ code: item.code, discount, type: item.type, value: item.value });
}
