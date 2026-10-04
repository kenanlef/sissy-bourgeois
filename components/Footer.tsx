import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Image className="footer-logo" src="/brand/sissy-bourgeois-logo-header.png" alt="Sissy Bourgeois" width={210} height={115} />
        <p className="muted">Soft movement. Quiet confidence. A pastel wardrobe with a little bourgeois attitude.</p>
      </div>
      <div>
        <strong>Shop</strong>
        <Link href="/shop">All products</Link>
        <Link href="/shop?category=Bras">Bras</Link>
        <Link href="/shop?category=Tops">Tops</Link>
        <Link href="/shop?category=Bottoms">Bottoms</Link>
      </div>
      <div>
        <strong>Help</strong>
        <Link href="/cart">Cart</Link>
        <Link href="/admin/login">Admin</Link>
      </div>
    </footer>
  );
}
