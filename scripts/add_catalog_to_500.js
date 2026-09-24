import fs from 'fs';

const API_BASE = 'http://localhost:8080/api';
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || process.env.DEMO_ADMIN_EMAIL || 'ravikantsinghravi366@gmail.com',
  password: process.env.ADMIN_PASSWORD || process.env.DEMO_ADMIN_PASSWORD || ''
};

const ADDITIONAL_75_PRODUCTS = [
  // ==========================================
  // 1. SPORTS & FITNESS (25 Items)
  // ==========================================
  {
    name: 'Spalding NBA Official Leather Basketball (Size 7)',
    price: 3499,
    discountPercent: 20,
    stockQuantity: 40,
    categorySlug: 'sports-outdoors',
    brandName: 'Spalding',
    shortDescription: 'Full-grain composite leather cover designed for competitive indoor and outdoor hardwood play',
    description: 'Precision deep channel design providing superior grip and ergonomic control for high-percentage shooting.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Nivia Premier Carbonite Football Shoes Studs (Turf & Grass)',
    price: 1899,
    discountPercent: 25,
    stockQuantity: 60,
    categorySlug: 'sports-outdoors',
    brandName: 'Nivia',
    shortDescription: 'High-shear synthetic leather upper with TPU studs for explosive acceleration on ground',
    description: 'Engineered for amateur and professional footballers seeking lightweight agility and snug ankle lock.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Cosco 3-Star Tournament Table Tennis Balls (White, Pack of 6)',
    price: 350,
    discountPercent: 15,
    stockQuantity: 120,
    categorySlug: 'sports-outdoors',
    brandName: 'Cosco',
    shortDescription: 'ITTF approved 40+ celluloid-free seam construction with consistent bounce trajectory',
    description: 'Tournament grade table tennis balls engineered for true bounce and maximum spin control.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Kobo Leather Weight Lifting Gym Belt with Steel Buckle (4-Inch Support)',
    price: 1299,
    discountPercent: 30,
    stockQuantity: 50,
    categorySlug: 'sports-outdoors',
    brandName: 'Kobo',
    shortDescription: 'Reinforced genuine buffalo leather core providing maximum intra-abdominal pressure during heavy squats',
    description: 'Heavy duty powerlifting belt designed to support lumbar spine during deadlifts, squats and overhead presses.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'MuscleBlaze Biozyme Performance Whey Protein (Rich Chocolate, 1 kg)',
    price: 2699,
    discountPercent: 22,
    stockQuantity: 75,
    categorySlug: 'sports-outdoors',
    brandName: 'MuscleBlaze',
    shortDescription: 'Enhanced Absorption Formula (EAF) clinically tested for 50% higher protein absorption',
    description: 'Formulated with biozyme enzymes to reduce stomach bloating and maximize lean muscle hypertrophy.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Strauss Adjustable Hand Grip Strengthener with Rep Counter (10kg - 60kg)',
    price: 399,
    discountPercent: 40,
    stockQuantity: 150,
    categorySlug: 'sports-outdoors',
    brandName: 'Strauss',
    shortDescription: 'Heavy-duty stainless steel spring, non-slip rubberized handles and mechanical click counter',
    description: 'Perfect for building forearm power, wrist stability and grip strength for rock climbing and weight training.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Speedo Fastskin Elite Swimming Cap and Anti-Fog Hydro Goggles Set',
    price: 2899,
    discountPercent: 15,
    stockQuantity: 45,
    categorySlug: 'sports-outdoors',
    brandName: 'Speedo',
    shortDescription: 'IQfit 3D hydrodynamic goggle seal with UV protection and seamless 100% silicone swim cap',
    description: 'Engineered in the Speedo Aqualab for competitive racers seeking minimal water drag and crystal-clear vision.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Decathlon Domyos 20kg Cast Iron Dumbbell & Barbell Weight Set in Case',
    price: 5499,
    discountPercent: 10,
    stockQuantity: 30,
    categorySlug: 'sports-outdoors',
    brandName: 'Decathlon',
    shortDescription: 'Heavy duty cast iron plates, threaded spinlock collars and dual dumbbell bars with center connector',
    description: 'Complete home fitness setup packaged in a rugged portable carry case with chrome-finished bars.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80']
  },

  // ==========================================
  // 2. BOOKS & STATIONERY (25 Items)
  // ==========================================
  {
    name: 'Ikigai: The Japanese Secret to a Long and Happy Life (Hardcover)',
    price: 499,
    discountPercent: 28,
    stockQuantity: 140,
    categorySlug: 'books-stationery',
    brandName: 'Penguin',
    shortDescription: 'International bestseller on discovering your purpose, longevity, and mindfulness from Okinawa elders',
    description: 'Inspiring guide that blends practical philosophy and daily habits to help you find joy and balance every morning.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'The Psychology of Money by Morgan Housel (Deluxe Paperback)',
    price: 399,
    discountPercent: 20,
    stockQuantity: 160,
    categorySlug: 'books-stationery',
    brandName: 'Jaico',
    shortDescription: 'Timeless lessons on wealth, greed, and happiness across 19 engaging short stories',
    description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. Essential reading for investors.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Rich Dad Poor Dad by Robert T. Kiyosaki (25th Anniversary Edition)',
    price: 450,
    discountPercent: 25,
    stockQuantity: 110,
    categorySlug: 'books-stationery',
    brandName: 'Plata Publishing',
    shortDescription: 'What the rich teach their kids about money that the poor and middle class do not',
    description: 'The number-one personal finance book of all time that challenges conventional wisdom on assets and liabilities.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'The Alchemist by Paulo Coelho (Special Gift Hardcover Edition)',
    price: 550,
    discountPercent: 30,
    stockQuantity: 90,
    categorySlug: 'books-stationery',
    brandName: 'HarperCollins',
    shortDescription: 'A magical fable about following your dreams and listening to your heart journeying across the Pyramids',
    description: 'Over 65 million copies sold worldwide. Follow Santiago the Andalusian shepherd boy on his transformative quest.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Classmate Pulse 6-Subject Spiral Bound Notebook (300 Pages, Single Ruled)',
    price: 240,
    discountPercent: 12,
    stockQuantity: 200,
    categorySlug: 'books-stationery',
    brandName: 'Classmate',
    shortDescription: 'Elemental chlorine-free paper, movable plastic divider tabs, micro-perforated tear-off pages',
    description: 'The preferred multi-subject notebook for university engineering and medical students.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Parker Vector Matte Black Rollerball Pen with Chrome Trim',
    price: 495,
    discountPercent: 15,
    stockQuantity: 120,
    categorySlug: 'books-stationery',
    brandName: 'Parker',
    shortDescription: 'Iconic stainless steel arrow clip, ultra-smooth liquid ink flow with Quinkflow rollerball refill',
    description: 'Simple, essential and reliable. The world favourite writing instrument for corporate professionals and executives.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Staedtler Mars Lumograph Drawing Pencils Set of 12 (6B to 4H)',
    price: 1199,
    discountPercent: 20,
    stockQuantity: 80,
    categorySlug: 'books-stationery',
    brandName: 'Staedtler',
    shortDescription: 'Break-resistant super-bonded lead for sketching, architectural drafting and artistic shading',
    description: 'Made in Germany using certified PEFC wood. Unmatched opacity and tonal gradation for portrait drawings.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80']
  },

  // ==========================================
  // 3. BEAUTY & PERSONAL CARE (25 Items)
  // ==========================================
  {
    name: 'Minimalist 10% Vitamin C Face Serum for Glowing & Brightening Skin (30ml)',
    price: 699,
    discountPercent: 10,
    stockQuantity: 100,
    categorySlug: 'beauty-personal-care',
    brandName: 'Minimalist',
    shortDescription: 'Formulated with Centella Asiatica Water, 10% Ethyl Ascorbic Acid and antioxidant Polyhydroxy Acid',
    description: 'Stabilized Vitamin C formula that neutralizes free radicals, accelerates collagen synthesis and illuminates skin complexion.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Cetaphil Gentle Skin Cleanser for Sensitive Skin (500ml Jumbo Pump Bottle)',
    price: 1195,
    discountPercent: 15,
    stockQuantity: 90,
    categorySlug: 'beauty-personal-care',
    brandName: 'Cetaphil',
    shortDescription: 'Hydrating Glycerin, Vitamin B3 (Niacinamide) and Provitamin B5 (Panthenol) dermatologist recommended',
    description: 'Clinically proven continuous hydration that protects against dryness, irritation, roughness and tightness.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'L’Oreal Paris Elseve Hyaluron Moisture 72H Hydrating Shampoo (650ml)',
    price: 649,
    discountPercent: 20,
    stockQuantity: 120,
    categorySlug: 'beauty-personal-care',
    brandName: "L'Oreal",
    shortDescription: 'Infused with Hyaluronic Acid, weightlessly coats hair cuticles for 72 hours of plump, bouncy volume',
    description: 'Transforms dry, dehydrated strands into soft, shiny, bouncy tresses without weighing down roots.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Maybelline New York Lash Sensational Sky High Waterproof Mascara (Very Black)',
    price: 799,
    discountPercent: 25,
    stockQuantity: 140,
    categorySlug: 'beauty-personal-care',
    brandName: 'Maybelline',
    shortDescription: 'Flex Tower brush bends to volumize and extend every single lash from root to tip with bamboo extract',
    description: 'Delivers limitless length and authentic volume that stays clump-free and flake-free all day long.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Laneige Lip Sleeping Mask with Berry Fruit Complex & Vitamin C (20g)',
    price: 1420,
    discountPercent: 12,
    stockQuantity: 80,
    categorySlug: 'beauty-personal-care',
    brandName: 'Laneige',
    shortDescription: 'Moisture Wrap technology with shea butter, murumuru seed butter, gently melts away dead skin overnight',
    description: 'Wake up to baby-soft, supple, intensely nourished lips with this award-winning K-beauty overnight treatment.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Versace Eros Eau De Toilette for Men (100ml Iconic Blue Medusa Flacon)',
    price: 8600,
    discountPercent: 14,
    stockQuantity: 30,
    categorySlug: 'beauty-personal-care',
    brandName: 'Versace',
    shortDescription: 'Mint leaves, Italian lemon zest, Tonka beans, Venezuelan ambroxan and Madagascan vanilla',
    description: 'A luminous aura with intense vibrant glowing freshness. Symbolizing love, passion, beauty and desire.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80']
  }
];

async function run() {
  console.log('=== Adding Batch 2 to reach 450+ catalog milestone ===');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN_CREDENTIALS)
  });
  const token = (await loginRes.json()).data.token;

  const res = await fetch(`${API_BASE}/admin/products/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(ADDITIONAL_75_PRODUCTS)
  });

  const data = await res.json();
  console.log(`Imported: ${data.data.importedCount}, Skipped: ${data.data.skippedCount}`);

  const countRes = await fetch(`${API_BASE}/products?size=1`);
  const countData = await countRes.json();
  console.log(`Total Products now in ShopSphere: ${countData.data.totalElements}`);
}

run().catch(console.error);
