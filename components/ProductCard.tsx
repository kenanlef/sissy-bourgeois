import Link from "next/link";
import { formatMoney } from "@/lib/money";

type Props = {
  product: {
    id: string;
    name: string;
    nameFr?: string | null;
    nameDe?: string | null;
    slug: string;
    price: number;
    compareAt: number | null;
    color: string;
    image: string;
  };
  lang?: string;
};

export function ProductCard({ product, lang = "en" }: Props) {
  const name = lang === "fr" ? product.nameFr || product.name : lang === "de" ? product.nameDe || product.name : product.name;
  return (
    <Link href={`/product/${product.slug}?lang=${lang}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={name} />
      </div>
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-meta">Sissy Bourgeois</div>
        <div className="price-row">
          <span>{formatMoney(product.price)}</span>
          {product.compareAt ? <span className="old-price">{formatMoney(product.compareAt)}</span> : null}
        </div>
      </div>
    </Link>
  );
}
