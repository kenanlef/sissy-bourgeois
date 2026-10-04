import {notFound} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {formatMoney} from "@/lib/money";
import {AddToCart} from "@/components/AddToCart";
export const dynamic = "force-dynamic";
export default async function ProductPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string}>}){
  const {slug}=await params; const q=await searchParams; const lang=q.lang||"en";
  const product=await prisma.product.findUnique({where:{slug}}); if(!product||!product.active)notFound();
  const name=lang==="fr"?product.nameFr||product.name:lang==="de"?product.nameDe||product.name:product.name;
  const description=lang==="fr"?product.descriptionFr||product.description:lang==="de"?product.descriptionDe||product.description:product.description;
  const gallery=[product.image,...(product.images||"").split("|").filter(Boolean)];
  const t=(en:string,fr:string,de:string)=>lang==="fr"?fr:lang==="de"?de:en;
  return <main className="product-page"><div className="product-gallery product-gallery-grid">{gallery.map((src,i)=><img className="product-main-img" key={src+i} src={src} alt={`${name} ${i+1}`}/>)}</div><div className="product-details"><div className="breadcrumb">{t("Home / Shop","Accueil / Boutique","Startseite / Shop")} / {product.category}</div><h1>{name}</h1><div className="detail-price">{formatMoney(product.price)}</div>{product.compareAt&&<div className="old-price">{formatMoney(product.compareAt)}</div>}<div className="detail-block"><strong>{t("Color","Couleur","Farbe")}</strong><p className="muted">{product.color}</p></div><div className="detail-block"><strong>{t("Size","Taille","Größe")}</strong><p className="muted">{t("Fits true to size","Taille normalement","Fällt normal aus")}</p><div className="size-grid">{["XXS","XS","S","M","L","XL"].map(size=><button className="size-btn" key={size}>{size}</button>)}</div></div><div className="detail-block"><p className="muted">{description}</p><AddToCart product={{id:product.id,name,price:product.price,image:product.image}}/></div></div></main>
}
