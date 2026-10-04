"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "./CartProvider";

function HeaderContent(){
  const {count}=useCart();
  const params=useSearchParams();
  const lang=params.get("lang")||"en";
  const t=({en,fr,de}:{en:string;fr:string;de:string})=>lang==="fr"?fr:lang==="de"?de:en;
  const [search,setSearch]=useState(false);
  const qs=`?lang=${lang}`;
  return <>
    <div className="topbar">{t({en:"Free delivery on orders over €100",fr:"Livraison offerte dès 100 €",de:"Kostenloser Versand ab 100 €"})}</div>
    <header className="header">
      <div className="mobile-menu">☰</div>
      <nav className="nav">
        <Link href={`/#new${qs}`}>{t({en:"NEW IN",fr:"NOUVEAUTÉS",de:"NEUHEITEN"})}</Link>
        <Link href={`/#bestsellers${qs}`}>{t({en:"BESTSELLERS",fr:"BEST-SELLERS",de:"BESTSELLER"})}</Link>
        <Link href={`/shop${qs}`}>{t({en:"SHOP",fr:"BOUTIQUE",de:"SHOP"})}</Link>
        <Link href={`/shop?category=Bras&lang=${lang}`}>{t({en:"BY ACTIVITY",fr:"PAR ACTIVITÉ",de:"NACH AKTIVITÄT"})}</Link>
        <Link href={`/#collection${qs}`}>{t({en:"COLLECTIONS",fr:"COLLECTIONS",de:"KOLLEKTIONEN"})}</Link>
      </nav>
      <Link className="logo" href={`/?lang=${lang}`} aria-label="Sissy Bourgeois">
        <Image src="/brand/sissy-bourgeois-logo-transparent.png" alt="Sissy Bourgeois" width={250} height={150} priority />
      </Link>
      <div className="header-actions">
        {search ? <form className="search-form" action="/shop"><input name="search" autoFocus placeholder={t({en:"Search products...",fr:"Rechercher...",de:"Produkte suchen..."})}/><input type="hidden" name="lang" value={lang}/></form> : <button className="icon-btn search-button" onClick={()=>setSearch(true)} aria-label={t({en:"Search",fr:"Rechercher",de:"Suchen"})}><span className="search-icon"/></button>}
        <div className="lang"><Link href="/?lang=en">EN</Link><Link href="/?lang=fr">FR</Link><Link href="/?lang=de">DE</Link></div>
        <Link className="cart-link" href={`/cart?lang=${lang}`} aria-label={`${t({en:"Cart",fr:"Panier",de:"Warenkorb"})}, ${count}`}>
          <span className="cart-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M5 8h3l2.2 13.2a2 2 0 0 0 2 1.7h10.7a2 2 0 0 0 1.9-1.4L27 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="27" r="1.8" fill="currentColor"/><circle cx="24" cy="27" r="1.8" fill="currentColor"/><path d="M13 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
          {count>0&&<span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </header>
  </>
}

export function Header(){
  return <Suspense fallback={null}><HeaderContent /></Suspense>
}

