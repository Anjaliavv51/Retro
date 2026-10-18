const fs = require('fs');
const path = require('path');

// Locate vintage_products.json
let defaultProducts = [];
try {
  const jsonPath = path.join(__dirname, '..', '..', 'python', 'vintage_products.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    defaultProducts = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[SeedData] Could not load vintage_products.json, using fallback array:', e.message);
}

if (!defaultProducts || defaultProducts.length === 0) {
  defaultProducts = [
    {
      id: "prod-1",
      title: "Vintage Gramophone",
      category: "Audio & Music",
      era: "1920s",
      price: "$299.99",
      price_num: 299.99,
      rating: 4.9,
      image: "image/gramophone.png",
      tag: "Best Seller",
      description: "Handcrafted vintage gramophone with an authentic embossed brass horn and solid dark mahogany wooden base.",
      aesthetic: "1920s Roaring Twenties Victorian Opulence",
      stock: 5
    },
    {
      id: "prod-2",
      title: "Classic Rotary Phone",
      category: "Telephony",
      era: "1950s",
      price: "$149.50",
      price_num: 149.50,
      rating: 4.8,
      image: "image/telephone.png",
      tag: "Popular",
      description: "Authentic heavy-duty bell-ringer rotary desk phone in polished Bakelite black finish.",
      aesthetic: "1950s Mid-Century Office",
      stock: 12
    },
    {
      id: "prod-3",
      title: "Retro Mechanical Typewriter",
      category: "Writing & Office",
      era: "1940s",
      price: "$220.00",
      price_num: 220.00,
      rating: 5.0,
      image: "image/typewriter.png",
      tag: "Featured",
      description: "Cast-iron desktop mechanical typewriter with glass keycaps and crisp mechanical bell action.",
      aesthetic: "1940s Classic Journalist",
      stock: 8
    },
    {
      id: "prod-4",
      title: "Antique Leather Camera",
      category: "Photography",
      era: "1950s",
      price: "$380.00",
      price_num: 380.00,
      rating: 4.9,
      image: "image/camera.png",
      tag: "Limited Edition",
      description: "Collector-grade 35mm rangefinder camera wrapped in genuine aged saddle leather.",
      aesthetic: "1950s Classic Street Photographer",
      stock: 4
    }
  ];
}

const defaultReviews = [
  {
    id: "rev-1",
    name: "Sophia Turner",
    rating: 5,
    comment: "The vintage camera collection is absolutely stunning. Received mine in pristine condition!",
    date: "2024-03-15"
  },
  {
    id: "rev-2",
    name: "Liam Henderson",
    rating: 5,
    comment: "Nostalgic vibes, excellent customer support, and fast delivery. Retro is truly unmatched.",
    date: "2024-03-20"
  },
  {
    id: "rev-3",
    name: "Emma Watson",
    rating: 4,
    comment: "Loved the vinyl record player. High quality craftsmanship and timeless design.",
    date: "2024-03-28"
  },
  {
    id: "rev-4",
    name: "Arthur Pendelton",
    rating: 5,
    comment: "The 1940s typewriter is a tactile masterpiece. Perfect mechanical action.",
    date: "2024-04-02"
  }
];

const defaultUsers = [
  {
    id: "usr-1",
    name: "Vintage Collector",
    email: "collector@retro-vintage.com",
    role: "curator",
    createdAt: new Date("2024-01-10T10:00:00Z")
  },
  {
    id: "usr-2",
    name: "Audiophile Alice",
    email: "alice@analogvinyl.org",
    role: "customer",
    createdAt: new Date("2024-02-15T14:30:00Z")
  },
  {
    id: "usr-3",
    name: "Marcus Aurelius",
    email: "marcus@antiques.net",
    role: "customer",
    createdAt: new Date("2024-03-01T08:15:00Z")
  }
];

/**
 * Seeds MongoDB collections if empty
 */
async function autoSeedDatabase(models) {
  try {
    const { Product, Review, User } = models;
    if (Product) {
      const pCount = await Product.countDocuments();
      if (pCount === 0) {
        console.log('[SeedData] Seeding Products collection into MongoDB...');
        await Product.insertMany(defaultProducts);
        console.log(`[SeedData] Seeded ${defaultProducts.length} vintage products.`);
      }
    }

    if (Review) {
      const rCount = await Review.countDocuments();
      if (rCount === 0) {
        console.log('[SeedData] Seeding Reviews collection into MongoDB...');
        await Review.insertMany(defaultReviews);
        console.log(`[SeedData] Seeded ${defaultReviews.length} reviews.`);
      }
    }
  } catch (err) {
    console.warn('[SeedData] Auto-seeding notice:', err.message);
  }
}

module.exports = {
  defaultProducts,
  defaultReviews,
  defaultUsers,
  autoSeedDatabase
};
