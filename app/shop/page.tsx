import {prisma} from "@/lib/prisma";
import {ProductCard} from "@/components/ProductCard";
export const dynamic = "force-dynamic";
export default async function ShopPage({searchParams}:{searchParams:Promise<{category?:string;search?:string;lang?:string}>}){
  const p=await searchParams; const category=p.category; const search=p.search?.trim(); const lang=p.lang||"en";
  const products=await prisma.product.findMany({where:{active:true,...(category?{category}:{}),...(search?{OR:[{name:{contains:search}},{nameFr:{contains:search}},{nameDe:{contains:search}},{description:{contains:search}},{descriptionFr:{contains:search}},{descriptionDe:{contains:search}},{category:{contains:search}}]}:{})},orderBy:{createdAt:"desc"}});
  const title=search?`Search: ${search}`:category||({en:"Shop all",fr:"Toute la collection",de:"Alle Produkte"}[lang]||"Shop all");
  return <main className="section"><div className="section-head"><div><span className="kicker">The collection</span><h2>{title}</h2></div><span className="muted">{products.length} pieces</span></div>{!products.length?<div className="empty"><h3>No products found.</h3></div>:<div className="grid">{products.map(product=><ProductCard key={product.id} product={product} lang={lang}/>)}</div>}</main>
}
