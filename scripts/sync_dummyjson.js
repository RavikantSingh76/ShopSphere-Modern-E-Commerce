import fs from 'fs';

const API_BASE = 'http://localhost:8080/api';
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || process.env.DEMO_ADMIN_EMAIL || 'ravikantsinghravi366@gmail.com',
  password: process.env.ADMIN_PASSWORD || process.env.DEMO_ADMIN_PASSWORD || ''
};

// Map DummyJSON category strings to ShopSphere core categories
const CATEGORY_MAP = {
  // Electronics
  'smartphones': 'electronics',
  'laptops': 'electronics',
  'mobile-accessories': 'electronics',
  'tablets': 'electronics',

  // Fashion & Apparel
  'mens-shirts': 'fashion',
  'mens-shoes': 'fashion',
  'mens-watches': 'fashion',
  'womens-dresses': 'fashion',
  'womens-shoes': 'fashion',
  'womens-watches': 'fashion',
  'womens-bags': 'fashion',
  'womens-jewellery': 'fashion',
  'tops': 'fashion',
  'sunglasses': 'fashion',

  // Beauty & Personal Care
  'beauty': 'beauty-personal-care',
  'fragrances': 'beauty-personal-care',
  'skin-care': 'beauty-personal-care',

  // Home & Living
  'furniture': 'home-living',
  'home-decoration': 'home-living',
  'kitchen-accessories': 'home-living',
  'groceries': 'home-living',

  // Sports & Fitness
  'sports-accessories': 'sports-outdoors',
  'motorcycle': 'sports-outdoors',
  'vehicle': 'sports-outdoors'
};

async function syncDummyJson(limit = 100) {
  console.log(`\n🌐 Fetching ${limit} products from DummyJSON API...`);
  const djRes = await fetch(`https://dummyjson.com/products?limit=${limit}`);
  if (!djRes.ok) throw new Error('Failed to fetch from DummyJSON API');
  const djData = await djRes.json();
  const rawProducts = djData.products || [];
  console.log(`📦 Received ${rawProducts.length} products from DummyJSON`);

  // Admin login to ShopSphere
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN_CREDENTIALS)
  });
  if (!loginRes.ok) throw new Error('Admin login to ShopSphere failed');
  const token = (await loginRes.json()).data.token;
  console.log('✅ Admin login successful');

  // Convert to ShopSphere ProductRequest objects
  const payload = rawProducts.map((p) => {
    // Convert USD to INR (~₹85 conversion factor)
    const inrPrice = Math.round((p.price || 50) * 85);
    const categorySlug = CATEGORY_MAP[p.category] || 'electronics';
    const brandName = p.brand || (p.title.split(' ')[0]) || 'ShopSphere';

    const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.thumbnail];
    const primaryImageUrl = p.thumbnail || images[0];

    const specs = {
      Brand: brandName,
      Category: p.category,
      Rating: p.rating ? `${p.rating} / 5.0` : '4.5 / 5.0',
      Warranty: p.warrantyInformation || '1 Year Manufacturer Warranty',
      Shipping: p.shippingInformation || 'Free Express Delivery in 2-3 Days',
      ReturnPolicy: p.returnPolicy || '30-Day Return & Exchange Policy'
    };

    return {
      name: p.title,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + p.id,
      shortDescription: p.description?.slice(0, 150) || p.title,
      description: p.description || p.title,
      price: inrPrice,
      discountPercent: Math.round(p.discountPercentage || 10),
      stockQuantity: p.stock || 40,
      sku: p.sku || `DJ-${p.id}-${Math.floor(Math.random() * 1000)}`,
      categorySlug: categorySlug,
      brandName: brandName,
      primaryImageUrl: primaryImageUrl,
      imageUrls: images,
      featured: p.rating >= 4.5,
      isBestSeller: p.rating >= 4.7,
      isNewArrival: (p.id % 2 === 0),
      isTrending: p.rating >= 4.4,
      specifications: JSON.stringify(specs),
      active: true
    };
  });

  console.log(`\n🚀 Sending ${payload.length} products to ShopSphere Bulk Import API...`);
  const importRes = await fetch(`${API_BASE}/admin/products/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!importRes.ok) {
    const errText = await importRes.text();
    throw new Error(`Bulk import failed (${importRes.status}): ${errText}`);
  }

  const result = await importRes.json();
  console.log('🎉 Bulk Import Complete!');
  console.log(`  - Total Requested: ${result.data.totalRequested}`);
  console.log(`  - Successfully Imported: ${result.data.importedCount}`);
  console.log(`  - Skipped / Failed: ${result.data.skippedCount}`);
  if (result.data.errors?.length > 0) {
    console.log(`  - Errors encountered:`, result.data.errors.slice(0, 5));
  }
}

syncDummyJson().catch(console.error);
