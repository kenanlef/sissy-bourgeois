import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { NewProductForm } from "@/components/NewProductForm";
import { AdminProductEditor } from "@/components/AdminProductEditor";

export const dynamic = "force-dynamic";
export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const products = await prisma.product.findMany({ orderBy:{createdAt:"desc"} });
  return <main className="admin-shell"><div className="admin-nav"><strong>SISSY BOURGEOIS · PRODUCTS</strong><div><Link href="/admin">Dashboard</Link> · <Link href="/admin/orders">Orders</Link> · <Link href="/admin/discounts">Discounts</Link> · <Link href="/admin/assets">Site photos</Link></div></div>
    <div className="admin-content"><h1>Products</h1><NewProductForm/><div className="admin-list"><h2>Manage products</h2>{products.map(p=><AdminProductEditor key={p.id} product={p}/>)}</div></div>
  </main>;
}
