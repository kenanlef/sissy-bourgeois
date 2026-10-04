import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await request.json();
    const code = String(b.code).trim().toUpperCase();
    const value = Number(b.value);
    if (!code || !Number.isFinite(value) || value <= 0) throw new Error("Invalid discount.");
    const item = await prisma.discountCode.create({
      data: {
        code, value: Math.round(value * (b.type === "FIXED" ? 100 : 1)),
        type: b.type === "FIXED" ? "FIXED" : "PERCENT",
        active: b.active !== false,
        minSubtotal: Math.round(Number(b.minSubtotal || 0) * 100),
        usageLimit: b.usageLimit ? Number(b.usageLimit) : null,
        expiresAt: b.expiresAt ? new Date(b.expiresAt) : null
      }
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not create code." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await request.json();
    const item = await prisma.discountCode.update({
      where: { id: String(b.id) },
      data: {
        ...(b.code !== undefined ? { code: String(b.code).toUpperCase() } : {}),
        ...(b.value !== undefined ? { value: Math.round(Number(b.value) * (b.type === "FIXED" ? 100 : 1)) } : {}),
        ...(b.type !== undefined ? { type: b.type === "FIXED" ? "FIXED" : "PERCENT" } : {}),
        ...(b.active !== undefined ? { active: Boolean(b.active) } : {}),
        ...(b.expiresAt !== undefined ? { expiresAt: b.expiresAt ? new Date(b.expiresAt) : null } : {}),
        ...(b.usageLimit !== undefined ? { usageLimit: b.usageLimit ? Number(b.usageLimit) : null } : {}),
        ...(b.minSubtotal !== undefined ? { minSubtotal: Math.round(Number(b.minSubtotal) * 100) } : {})
      }
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not update code." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { await prisma.discountCode.delete({ where: { id: String((await request.json()).id) } }); return NextResponse.json({ok:true}); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Could not delete code." }, { status: 400 }); }
}
