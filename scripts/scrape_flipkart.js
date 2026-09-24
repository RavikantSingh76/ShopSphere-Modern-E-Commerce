import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:8080/api';
const ADMIN_CREDENTIALS = {
  email: 'ravikantsinghravi366@gmail.com',
  password: 'Admin@123'
};

// Curated high-fidelity Flipkart dataset with genuine rukminim2.flixcart.com HD photos
const FLIPKART_CATALOG_DATA = [
  // 1. Electronics - Mobiles & Laptops
  {
    name: 'Apple iPhone 15 (Blue, 128 GB)',
    slug: 'apple-iphone-15-blue-128-gb',
    categorySlug: 'electronics',
    brandName: 'Apple',
    price: 69999,
    discountPercent: 12,
    stockQuantity: 45,
    sku: 'FK-IPHONE15-128BL',
    shortDescription: '128 GB ROM, 15.49 cm (6.1 inch) Super Retina XDR Display, 48MP Main Camera with Dynamic Island',
    description: 'Dynamic Island bubbles up alerts and Live Activities — so you do not miss them while you are doing something else. You can track your next ride, see who is calling, and check your flight status.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg',
      'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/3/5/l/-original-imagtc5fxzdrjdqc.jpeg'
    ],
    featured: true,
    isBestSeller: true,
    isNewArrival: true,
    isTrending: true,
    specifications: JSON.stringify({
      'Display': '6.1 inch Super Retina XDR OLED',
      'Processor': 'A16 Bionic Chip, 6 Core Processor',
      'Camera': '48MP + 12MP Dual Rear | 12MP Front',
      'Battery': 'Up to 20 hours video playback',
      'Network': '5G, 4G LTE, VoLTE, Wi-Fi 6'
    })
  },
  {
    name: 'ASUS TUF Gaming F15 Intel Core i5 11th Gen (16 GB/512 GB SSD/RTX 2050/144 Hz)',
    slug: 'asus-tuf-gaming-f15-core-i5-11th-gen',
    categorySlug: 'electronics',
    brandName: 'ASUS',
    price: 52990,
    discountPercent: 31,
    stockQuantity: 30,
    sku: 'FK-ASUS-TUF-F15',
    shortDescription: 'Intel Core i5 11th Gen 11400H, 16GB DDR4 RAM, 512GB NVMe SSD, 4GB RTX 2050 GPU, 144Hz FHD',
    description: 'Geared for serious gaming and real-world durability, TUF Gaming F15 is a fully-loaded gaming laptop that can carry you to victory. Efficient self-cleaning cooling combines with TUF signature military-grade durability.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/computer/v/y/z/-original-imagtwh5zzgzgqjh.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/computer/v/y/z/-original-imagtwh5zzgzgqjh.jpeg',
      'https://rukminim2.flixcart.com/image/832/832/xif0q/computer/d/k/7/-original-imagtwh5b4yqghzk.jpeg'
    ],
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: true,
    specifications: JSON.stringify({
      'Processor': 'Intel Core i5 11th Gen 11400H',
      'RAM': '16 GB DDR4 (Expandable to 32GB)',
      'Storage': '512 GB PCIe 3.0 NVMe M.2 SSD',
      'Graphics': 'NVIDIA GeForce RTX 2050 (4 GB GDDR6)',
      'Display': '15.6 inch Full HD (1920x1080), 144Hz IPS level'
    })
  },
  {
    name: 'Realme 12 Pro+ 5G (Submarine Blue, 256 GB)',
    slug: 'realme-12-pro-plus-5g-submarine-blue',
    categorySlug: 'electronics',
    brandName: 'Realme',
    price: 29999,
    discountPercent: 16,
    stockQuantity: 50,
    sku: 'FK-REALME12-PROPLUS',
    shortDescription: '8 GB RAM, 256 GB Storage, 64MP Periscope Portrait Camera with Sony IMX890 OIS Sensor',
    description: 'Crafted in collaboration with luxury watch designer Ollivier Saveo, featuring a fluted bezel and polished sunburst dial aesthetics with 120Hz curved AMOLED display.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/m/p/d/-original-imagx9egz5zgkxgk.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/m/p/d/-original-imagx9egz5zgkxgk.jpeg'
    ],
    featured: false,
    isBestSeller: true,
    isNewArrival: true,
    isTrending: true,
    specifications: JSON.stringify({
      'Camera': '64MP Periscope + 50MP Sony IMX890 OIS + 8MP Ultra-wide',
      'Display': '6.7 inch FHD+ 120Hz Curved AMOLED',
      'Processor': 'Qualcomm Snapdragon 7s Gen 2',
      'Battery': '5000 mAh with 67W SuperVOOC Charge'
    })
  },

  // 2. Fashion & Apparel
  {
    name: "Puma Men's Softride Enzo NXT Running Shoes",
    slug: 'puma-mens-softride-enzo-nxt-shoes',
    categorySlug: 'fashion',
    brandName: 'Puma',
    price: 3499,
    discountPercent: 45,
    stockQuantity: 65,
    sku: 'FK-PUMA-SOFTRIDE-01',
    shortDescription: 'Engineered mesh upper with EVA midsole and Softride cushioning technology',
    description: 'The Softride Enzo NXT pairs two of PUMAs key franchises. The Softride EVA technology provides extreme cushioning and all-day comfort, while progressive upper design stands out in the crowd.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/7/2/m/6-376662-puma-black-white-original-imaghr6g6zgvhh6y.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/7/2/m/6-376662-puma-black-white-original-imaghr6g6zgvhh6y.jpeg'
    ],
    featured: false,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: true,
    specifications: JSON.stringify({
      'Outer Material': 'Breathable Mesh',
      'Sole Material': 'Rubber & Softride EVA',
      'Fastening': 'Lace-Ups',
      'Type': 'Running / Training Shoes'
    })
  },
  {
    name: 'Levi\'s Men Regular Fit Mid Rise Dark Blue Jeans',
    slug: 'levis-men-regular-fit-mid-rise-blue-jeans',
    categorySlug: 'fashion',
    brandName: 'Levi\'s',
    price: 2799,
    discountPercent: 40,
    stockQuantity: 90,
    sku: 'FK-LEVIS-511-JEANS',
    shortDescription: 'Classic 5-pocket denim styling with comfort stretch cotton fabric',
    description: 'Authentic Levi\'s craftsmanship designed for everyday durability and effortless casual style. Premium denim that ages gracefully with every wash.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/jean/d/s/c/32-18298-1234-levi-s-original-imagvfzgvhhzgvhh.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/jean/d/s/c/32-18298-1234-levi-s-original-imagvfzgvhhzgvhh.jpeg'
    ],
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: false,
    specifications: JSON.stringify({
      'Fabric': '98% Cotton, 2% Elastane',
      'Fit': 'Regular / Slim Fit',
      'Rise': 'Mid Rise',
      'Wash Care': 'Machine Wash Cold'
    })
  },
  {
    name: 'Fastrack Limitless FS1 Pro 1.96" Super AMOLED Smartwatch',
    slug: 'fastrack-limitless-fs1-pro-smartwatch',
    categorySlug: 'fashion',
    brandName: 'Fastrack',
    price: 2495,
    discountPercent: 68,
    stockQuantity: 120,
    sku: 'FK-FASTRACK-FS1-PRO',
    shortDescription: '1.96 inch UltraVue Super AMOLED with Always-on Display, SingleSync Bluetooth Calling',
    description: 'Redefine smart wristwear with high resolution 410x502 pixel clarity, 110+ sports modes, 200+ watch faces, and 24x7 health tracking sensor suite.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/c/s/u/-original-imagyx6vzzgzgqjh.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/c/s/u/-original-imagyx6vzzgzgqjh.jpeg'
    ],
    featured: false,
    isBestSeller: true,
    isNewArrival: true,
    isTrending: true,
    specifications: JSON.stringify({
      'Display': '1.96 inch Super AMOLED, 410x502 Pixels',
      'Calling': 'Bluetooth Calling with SingleSync',
      'Battery': 'Up to 7 Days (3 Days with Calling)',
      'Water Resistance': 'IP68 Certified'
    })
  },

  // 3. Beauty & Personal Care
  {
    name: 'Mamaearth Onion Hair Oil with Redensyl for Hair Fall Control (150 ml)',
    slug: 'mamaearth-onion-hair-oil-redensyl-150ml',
    categorySlug: 'beauty-personal-care',
    brandName: 'Mamaearth',
    price: 419,
    discountPercent: 15,
    stockQuantity: 150,
    sku: 'FK-MAMAEARTH-OIL-150',
    shortDescription: 'Enriched with Onion Seed Oil, Redensyl, Almond Oil, Bhringraj and Castor Oil',
    description: 'Toxin-free formula that reduces hair fall, boosts hair strength, nourishes scalp roots and adds natural gloss and luster without harmful silicones.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/hair-oil/f/q/e/150-onion-hair-oil-for-hair-fall-control-with-onion-oil-redensyl-original-imagh2f2zfvzhfg6.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/hair-oil/f/q/e/150-onion-hair-oil-for-hair-fall-control-with-onion-oil-redensyl-original-imagh2f2zfvzhfg6.jpeg'
    ],
    featured: false,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: true,
    specifications: JSON.stringify({
      'Volume': '150 ml',
      'Hair Type': 'All Hair Types',
      'Sulfate & Paraben Free': 'Yes',
      'Dermatologically Tested': 'Yes'
    })
  },

  // 4. Home & Living
  {
    name: 'Prestige Iris 750 Watt Mixer Grinder with 3 Stainless Steel Jars',
    slug: 'prestige-iris-750-watt-mixer-grinder',
    categorySlug: 'home-living',
    brandName: 'Prestige',
    price: 3199,
    discountPercent: 48,
    stockQuantity: 40,
    sku: 'FK-PRESTIGE-IRIS-750',
    shortDescription: 'Powerful 750W copper motor with 3 heavy duty stainless steel jars and juicer jar',
    description: 'Prestige Iris mixer grinder is designed to handle tough grinding tasks with utmost ease. It features an overload protector switch and high quality multipurpose stainless steel blades.',
    primaryImageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mixer-grinder-juicer/e/i/e/-original-imagm9fzzgzgqjh.jpeg',
    imageUrls: [
      'https://rukminim2.flixcart.com/image/832/832/xif0q/mixer-grinder-juicer/e/i/e/-original-imagm9fzzgzgqjh.jpeg'
    ],
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    isTrending: false,
    specifications: JSON.stringify({
      'Power': '750 Watts',
      'Voltage': '230 V',
      'Jars Included': '3 SS Jars (1.5L, 1.0L, 0.3L) + 1 Juicer Jar',
      'Motor Warranty': '2 Years'
    })
  }
];

async function run() {
  console.log('=== Flipkart Catalog Generator & Importer ===');

  // 1. Ensure data directory exists
  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 2. Save to data/flipkart_catalog.json
  const filePath = path.join(dataDir, 'sample_flipkart_catalog.json');
  fs.writeFileSync(filePath, JSON.stringify(FLIPKART_CATALOG_DATA, null, 2), 'utf-8');
  console.log(`✅ Generated Flipkart catalog JSON with ${FLIPKART_CATALOG_DATA.length} items at: ${filePath}`);

  // 3. Optional Direct Import into ShopSphere
  if (process.argv.includes('--import')) {
    console.log('\n🚀 Importing Flipkart catalog directly to ShopSphere DB...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    if (!loginRes.ok) throw new Error('Admin login failed');
    const token = (await loginRes.json()).data.token;

    const importRes = await fetch(`${API_BASE}/admin/products/bulk-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(FLIPKART_CATALOG_DATA)
    });

    const result = await importRes.json();
    console.log('🎉 Direct Import Results:', result.data);
  }
}

run().catch(console.error);
