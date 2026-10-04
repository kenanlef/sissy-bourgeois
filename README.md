# Sissy Bourgeois Store

Next.js + Prisma + SQLite + Stripe starter for Sissy Bourgeois.

## Local setup

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000.

Admin: http://localhost:3000/admin

Default local admin credentials are in `.env.example`; change them before production.

## Included

- Sissy Bourgeois logo and pastel lilac / soft yellow / baby blue interface
- Product CRUD from admin
- Product image uploads and gallery URLs
- Site image management
- Search
- Cart with visible black bag icon
- Discount codes
- 10% welcome popup with WELCOME10
- Stripe Checkout with card/billing/shipping collection
- Standard and express shipping
- Orders with customer and delivery address
- Tracking number / tracking URL and order status in admin
- English / French / German language selectors (UI foundation; product/customer content can be translated as needed)
- SQLite database

## Stripe

Set these in `.env`:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

For production, configure a Stripe webhook for `/api/stripe/webhook`.
