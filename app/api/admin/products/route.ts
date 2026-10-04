import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: String(body.name),
        nameFr: body.nameFr ? String(body.nameFr) : null,
        nameDe: body.nameDe ? String(body.nameDe) : null,
        slug: String(body.slug),
        description: String(body.description || ""),
        descriptionFr: body.descriptionFr ? String(body.descriptionFr) : null,
        descriptionDe: body.descriptionDe ? String(body.descriptionDe) : null,
        price: Math.round(Number(body.price)),
        compareAt: body.compareAt ? Math.round(Number(body.compareAt)) : null,
        category: String(body.category || "Bras"),
        color: String(body.color || ""),
        image: String(body.image || ""),
        images: String(body.images || ""),
        featured: Boolean(body.featured),
        active: body.active !== false
      }
    });
    revalidatePath("/"); revalidatePath("/shop"); revalidatePath("/admin/products"); revalidatePath(`/product/${product.slug}`);
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not create product." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const id = String(body.id);
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: String(body.name) } : {}),
        ...(body.nameFr !== undefined ? { nameFr: body.nameFr ? String(body.nameFr) : null } : {}),
        ...(body.nameDe !== undefined ? { nameDe: body.nameDe ? String(body.nameDe) : null } : {}),
        ...(body.slug !== undefined ? { slug: String(body.slug) } : {}),
        ...(body.description !== undefined ? { description: String(body.description) } : {}),
        ...(body.descriptionFr !== undefined ? { descriptionFr: body.descriptionFr ? String(body.descriptionFr) : null } : {}),
        ...(body.descriptionDe !== undefined ? { descriptionDe: body.descriptionDe ? String(body.descriptionDe) : null } : {}),
        ...(body.price !== undefined ? { price: Math.round(Number(body.price)) } : {}),
        ...(body.compareAt !== undefined ? { compareAt: body.compareAt ? Math.round(Number(body.compareAt)) : null } : {}),
        ...(body.category !== undefined ? { category: String(body.category) } : {}),
        ...(body.color !== undefined ? { color: String(body.color) } : {}),
        ...(body.image !== undefined ? { image: String(body.image) } : {}),
        ...(body.images !== undefined ? { images: String(body.images) } : {}),
        ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
        ...(body.active !== undefined ? { active: Boolean(body.active) } : {})
      }
    });
    revalidatePath("/"); revalidatePath("/shop"); revalidatePath("/admin/products"); revalidatePath(`/product/${product.slug}`);
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not update product." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    const deleted = await prisma.product.delete({ where: { id: String(id) } });
    revalidatePath("/"); revalidatePath("/shop"); revalidatePath("/admin/products"); revalidatePath(`/product/${deleted.slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not delete product." }, { status: 400 });
  }
}
