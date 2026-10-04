import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Lila Studio Bra",
    nameFr: "Brassière Studio Lilas",
    nameDe: "Lila Studio-BH",
    slug: "lila-studio-bra",
    description: "Soft-support everyday bra with a clean scoop neckline.",
    descriptionFr: "Brassière douce et confortable avec une encolure épurée.",
    descriptionDe: "Weicher Alltags-BH mit klarer, runder Ausschnittlinie.",
    price: 5800,
    compareAt: 6800,
    category: "Bras",
    color: "Lilac",
    image: "/products/lilac-bra.svg",
    featured: true
  },
  {
    name: "Baby Blue Move Top",
    nameFr: "Top Move Bleu Ciel",
    nameDe: "Babyblaues Move-Top",
    slug: "baby-blue-move-top",
    description: "Lightweight training top made for low-impact movement.",
    descriptionFr: "Top léger conçu pour les mouvements doux et le studio.",
    descriptionDe: "Leichtes Trainingstop für sanfte Bewegungen und Studio-Tage.",
    price: 6200,
    compareAt: null,
    category: "Tops",
    color: "Baby Blue",
    image: "/products/blue-top.svg",
    featured: true
  },
  {
    name: "Soft Sun Legging",
    nameFr: "Legging Soft Sun",
    nameDe: "Soft Sun Leggings",
    slug: "soft-sun-legging",
    description: "High-rise studio legging with a buttery soft hand feel.",
    descriptionFr: "Legging taille haute au toucher ultra-doux, pensé pour le studio.",
    descriptionDe: "High-Waist-Studio-Leggings mit besonders weichem Griff.",
    price: 8900,
    compareAt: 9900,
    category: "Leggings",
    color: "Soft Yellow",
    image: "/products/yellow-legging.svg",
    featured: true
  },
  {
    name: "Lilac Cloud Short",
    nameFr: "Short Cloud Lilas",
    nameDe: "Lilac Cloud Shorts",
    slug: "lilac-cloud-short",
    description: "Relaxed high-waist short for warm-up and rest days.",
    descriptionFr: "Short taille haute et décontracté pour l’échauffement et les jours doux.",
    descriptionDe: "Bequeme High-Waist-Shorts für Warm-up und Ruhetage.",
    price: 5400,
    compareAt: null,
    category: "Bottoms",
    color: "Lilac",
    image: "/products/lilac-short.svg",
    featured: false
  },
  {
    name: "Blue Line Bra",
    nameFr: "Brassière Blue Line",
    nameDe: "Blue Line BH",
    slug: "blue-line-bra",
    description: "Minimal cross-back bra with contrast piping.",
    descriptionFr: "Brassière minimaliste dos croisé avec liseré contrasté.",
    descriptionDe: "Minimalistischer BH mit gekreuztem Rücken und Kontrastpaspel.",
    price: 5900,
    compareAt: null,
    category: "Bras",
    color: "Baby Blue",
    image: "/products/blue-bra.svg",
    featured: true
  },
  {
    name: "Sunlight Track Pant",
    nameFr: "Pantalon Sunlight",
    nameDe: "Sunlight Trackpants",
    slug: "sunlight-track-pant",
    description: "Easy wide-leg pant for travel, studio and coffee runs.",
    descriptionFr: "Pantalon large et facile à porter, du studio aux escapades en ville.",
    descriptionDe: "Lässige Wide-Leg-Hose für Reisen, Studio und Café-Tage.",
    price: 9800,
    compareAt: 11200,
    category: "Bottoms",
    color: "Soft Yellow",
    image: "/products/yellow-pant.svg",
    featured: false
  }
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
  await prisma.discountCode.upsert({
    where: { code: "WELCOME10" },
    update: { type: "PERCENT", value: 10, active: true },
    create: { code: "WELCOME10", type: "PERCENT", value: 10, active: true }
  });
  console.log(`Seeded ${products.length} products and WELCOME10.`);

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
