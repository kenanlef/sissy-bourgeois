import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="success">
      <span className="kicker">Order received</span>
      <h1>Thank you for your order.</h1>
      <p className="muted">Your payment was sent to Stripe. We&apos;ll update your order as soon as the payment webhook confirms it.</p>
      <Link className="button" href="/shop">CONTINUE SHOPPING</Link>
    </main>
  );
}
