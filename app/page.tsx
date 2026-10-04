import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage({searchParams}:{searchParams:Promise<{lang?:string}>}){
  const p=await searchParams;
  const lang=p.lang||"en";
  const [products,hero]=await Promise.all([
    prisma.product.findMany({where:{active:true,featured:true},orderBy:{createdAt:"desc"},take:4}),
    prisma.siteAsset.findUnique({where:{key:"hero"}})
  ]);
  const t=(en:string,fr:string,de:string)=>lang==="fr"?fr:lang==="de"?de:en;
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="kicker">Sissy Bourgeois · {t("The studio edit","L’édition studio","Die Studio-Auswahl")}</span>
        <h1>{t("Elegance in every detail","L’élégance dans chaque détail","Eleganz in jedem Detail")}</h1>
        <p>{t("Discover our soft, feminine essentials, designed to move with you and make every day feel special.","Découvrez notre collection douce et féminine, pensée pour vous accompagner avec élégance.","Entdecke unsere weiche, feminine Kollektion – für elegante Momente im Alltag.")}</p>
        <div style={{display:"flex",gap:10,marginTop:20}}><Link className="button" href={`/shop?lang=${lang}`}>{t("DISCOVER THE COLLECTION","DÉCOUVRIR LA COLLECTION","KOLLEKTION ENTDECKEN")}</Link></div>
      </div>
      <div className="hero-art" style={hero?{backgroundImage:`url(${hero.image})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}>{!hero&&<div className="hero-card"/>}<div className="hero-glow"/></div>
    </section>
    <section className="service-strip"><div>♧ <b>{t("Fast delivery","Livraison rapide","Schneller Versand")}</b><span>{t("2–5 working days","2 à 5 jours ouvrés","2–5 Werktage")}</span></div><div>♡ <b>{t("Secure payment","Paiement sécurisé","Sichere Zahlung")}</b><span>Stripe</span></div><div>♡ <b>{t("Customer care","Service client","Kundenservice")}</b><span>{t("We are here to help","À votre écoute","Wir helfen gerne")}</span></div><div>♧ <b>{t("Discreet packaging","Emballage discret","Diskrete Verpackung")}</b><span>{t("For your privacy","Pour votre confidentialité","Für deine Privatsphäre")}</span></div></section>
    <section className="section" id="new"><div className="section-head"><div><span className="kicker">{t("Just landed","Nouveautés","Neu eingetroffen")}</span><h2>{t("Our favorites","Nos coups de cœur","Unsere Favoriten")}</h2></div><Link className="muted" href={`/shop?lang=${lang}`}>{t("View all →","Tout voir →","Alle ansehen →")}</Link></div><div className="grid">{products.map(product=><ProductCard key={product.id} product={product} lang={lang}/>)}</div></section>
    <section className="pastel-banner" id="collection"><div><span className="kicker">Lilac / Blue / Sun · Sissy Bourgeois</span><h2>{t("Soft color, beautiful mood.","Des couleurs douces, une belle humeur.","Sanfte Farben, schöne Stimmung.")}</h2><p className="muted">{t("Three pastel shades. One easy wardrobe.","Trois tons pastel. Une garde-robe facile.","Drei Pastelltöne. Eine unkomplizierte Garderobe.")}</p><Link className="button" href={`/shop?lang=${lang}`}>{t("SHOP THE PALETTE","VOIR LA PALETTE","PALETTE ENTDECKEN")}</Link></div></section>
    <section className="section" id="bestsellers"><div className="section-head"><div><span className="kicker">{t("Made to repeat","À porter encore et encore","Zum Immer-wieder-Tragen")}</span><h2>{t("Bestsellers","Best-sellers","Bestseller")}</h2></div></div><div className="grid">{products.slice().reverse().map(product=><ProductCard key={product.id} product={product} lang={lang}/>)}</div></section>
  </main>
}
