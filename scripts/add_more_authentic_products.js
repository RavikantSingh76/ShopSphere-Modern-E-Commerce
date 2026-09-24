import fs from 'fs';

const API_BASE = 'http://localhost:8080/api';
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || process.env.DEMO_ADMIN_EMAIL || 'ravikantsinghravi366@gmail.com',
  password: process.env.ADMIN_PASSWORD || process.env.DEMO_ADMIN_PASSWORD || ''
};

const NEW_PRODUCTS = [
  // ==========================================
  // 1. ELECTRONICS (SMARTPHONES, LAPTOPS, AUDIO, TVs)
  // ==========================================
  {
    name: 'Google Pixel 8 Pro 5G (Bay Blue, 128 GB)',
    price: 99999,
    discountPercent: 10,
    stockQuantity: 40,
    categorySlug: 'electronics',
    brandName: 'Google',
    sku: 'EL-PIXEL8P-128-BAY',
    shortDescription: 'Google Tensor G3, 50MP Main with 5x Telephoto & 48MP Ultrawide, Super Actua 120Hz LTPO OLED',
    description: 'Pixel 8 Pro is engineered by Google for pro-level photography and next-gen generative AI features. Built with polished aluminum frame and matte back glass.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Processor: 'Google Tensor G3 + Titan M2', RAM: '12 GB LPDDR5X', Display: '6.7 inch Super Actua OLED (1-120Hz)', Battery: '5050 mAh with 30W Fast Charging' })
  },
  {
    name: 'Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD - Midnight)',
    price: 154900,
    discountPercent: 5,
    stockQuantity: 25,
    categorySlug: 'electronics',
    brandName: 'Apple',
    sku: 'EL-MBA15-M3-MIDNIGHT',
    shortDescription: 'Liquid Retina display, M3 8-core CPU & 10-core GPU, up to 18 hours battery life, 1080p FaceTime HD',
    description: 'Impossibly thin and wicked fast, the 15-inch MacBook Air with M3 lets you blaze through work and play with breakthrough energy efficiency.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Chip: 'Apple M3 with 16-core Neural Engine', RAM: '16GB Unified Memory', Storage: '512GB SSD', Display: '15.3 inch Liquid Retina with True Tone', Weight: '1.51 kg' })
  },
  {
    name: 'Dell XPS 13 Plus 9320 Core i7 13th Gen (32GB / 1TB SSD / 3.5K OLED Touch)',
    price: 189990,
    discountPercent: 12,
    stockQuantity: 15,
    categorySlug: 'electronics',
    brandName: 'Dell',
    sku: 'EL-DELL-XPS13P-32G',
    shortDescription: 'Intel Core i7-1360P, 32GB LPDDR5, 1TB NVMe, Capacitive Touch Function Row and Zero-Lattice Keyboard',
    description: 'Twice as powerful as before in the same 13-inch size. Features seamless glass touchpad with haptic feedback and borderless 3.5K OLED touch display.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Processor: 'Intel Core i7-1360P (12 Cores)', RAM: '32GB LPDDR5 6000MHz', Storage: '1TB M.2 PCIe Gen 4 NVMe', Display: '13.4 inch 3.5K (3456x2160) OLED Touch' })
  },
  {
    name: 'Lenovo Legion 5 Pro Gaming Laptop (AMD Ryzen 7 7745HX / 16GB / 1TB SSD / RTX 4070 8GB)',
    price: 149990,
    discountPercent: 18,
    stockQuantity: 20,
    categorySlug: 'electronics',
    brandName: 'Lenovo',
    sku: 'EL-LEGION5PRO-4070',
    shortDescription: '16 inch WQXGA 240Hz 500nits IPS Display, Legion ColdFront 5.0 Cooling, 4-Zone RGB TrueStrike Keyboard',
    description: 'Dominate esports tournaments with AI-tuned performance powered by the Lenovo LA AI chip and NVIDIA DLSS 3 frame generation.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Processor: 'AMD Ryzen 7 7745HX', Graphics: 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W TGP)', Display: '16 inch WQXGA (2560x1600) 240Hz', OS: 'Windows 11 Home' })
  },
  {
    name: 'Bose QuietComfort Ultra Wireless Noise Cancelling Over-Ear Headphones (Black)',
    price: 35900,
    discountPercent: 8,
    stockQuantity: 30,
    categorySlug: 'electronics',
    brandName: 'Bose',
    sku: 'EL-BOSE-QCULTRA-BLK',
    shortDescription: 'CustomTune personalized sound, World-class active noise cancellation and Revolutionary Spatial Audio',
    description: 'Listen longer with up to 24 hours of play time per charge and unmatched comfortable ear cushions tailored for executive frequent flyers.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ BatteryLife: 'Up to 24 hours', Bluetooth: '5.3 Multi-point', Microphones: 'Built-in microphone array for crystal clear voice' })
  },
  {
    name: 'Sony Bravia 55-inch 4K Ultra HD Smart Google LED TV (KD-55X74L)',
    price: 54990,
    discountPercent: 28,
    stockQuantity: 18,
    categorySlug: 'electronics',
    brandName: 'Sony',
    sku: 'EL-SONY-BRAVIA55-X74L',
    shortDescription: 'X1 4K Processor, Live Colour, 20W Dolby Audio, Motionflow XR 100, Google TV with Voice Assistant',
    description: 'Experience thrilling movies and games in rich, vibrant 4K HDR detail with Sony X-Reality PRO image processing engine.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Resolution: '4K Ultra HD (3840 x 2160)', Sound: '20W Open Baffle Speaker with Dolby Audio', SmartFeatures: 'Google TV, Apple AirPlay 2, Chromecast' })
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm (Midnight Aluminum Case with Sport Band)',
    price: 44900,
    discountPercent: 6,
    stockQuantity: 35,
    categorySlug: 'electronics',
    brandName: 'Apple',
    sku: 'EL-AW9-45MM-MID',
    shortDescription: 'S9 SiP chip, Double Tap gesture control, brighter 2000-nit Always-On Retina display, ECG & Blood Oxygen',
    description: 'Smarter, brighter, and mightier. Control your watch without touching the screen using magic double-tap pinch gesture.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ CaseSize: '45mm', Display: 'Always-On Retina up to 2000 nits', Sensors: 'ECG, Blood Oxygen, Heart Rate, Temperature Sensing' })
  },
  {
    name: 'JBL Flip 6 Portable Waterproof Bluetooth Speaker (Squad Camo Edition)',
    price: 9999,
    discountPercent: 30,
    stockQuantity: 60,
    categorySlug: 'electronics',
    brandName: 'JBL',
    sku: 'EL-JBL-FLIP6-CAMO',
    shortDescription: '2-way speaker system, 12 hours playtime, IP67 waterproof and dustproof, PartyBoost pairing',
    description: 'The bold JBL Flip 6 delivers powerful JBL Original Pro Sound with exceptional clarity thanks to its 2-way speaker system with separate tweeter and dual pumping passive radiators.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ OutputPower: '30W RMS (20W Woofer + 10W Tweeter)', BatteryLife: 'Up to 12 Hours', WaterResistance: 'IP67 Waterproof & Dustproof' })
  },

  // ==========================================
  // 2. FASHION & APPAREL (SNEAKERS, ETHNIC, DENIM, WATCHES)
  // ==========================================
  {
    name: 'Nike Dunk Low Retro White Black (Panda Sneakers)',
    price: 8295,
    discountPercent: 10,
    stockQuantity: 45,
    categorySlug: 'fashion',
    brandName: 'Nike',
    sku: 'FA-NIKE-DUNK-PANDA',
    shortDescription: 'Iconic monochromatic colorblocking, crisp leather upper and durable heritage rubber cupsole',
    description: 'Created for the hardwood but taken to the streets, the 80s b-ball icon returns with classic details and throwback hoops flair.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ UpperMaterial: '100% Genuine Leather', Sole: 'Non-marking Rubber Cupsole', Style: 'Lifestyle / Casual Retro Sneaker' })
  },
  {
    name: 'Air Jordan 1 Mid Basketball Sneakers (Bred Toe Edition)',
    price: 11495,
    discountPercent: 5,
    stockQuantity: 30,
    categorySlug: 'fashion',
    brandName: 'Nike',
    sku: 'FA-JORDAN1-BREDTOE',
    shortDescription: 'Encapsulated Air-Sole cushioning unit, premium leather overlays and signature Wings ankle logo',
    description: 'Inspired by the original AJ1, this mid-top sneaker retains the legendary look while prioritizing modern lightweight step cushioning.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Material: 'Full-grain Leather & Nubuck', Sole: 'Solid Rubber with Pivot Circle Tread', Fastening: 'Lace-Up' })
  },
  {
    name: "New Balance 574 Core Classic Men's Sneakers (Grey / White)",
    price: 8999,
    discountPercent: 20,
    stockQuantity: 50,
    categorySlug: 'fashion',
    brandName: 'New Balance',
    sku: 'FA-NB-574-GREY',
    shortDescription: 'ENCAP midsole cushioning combines lightweight foam with durable polyurethane rim for all-day support',
    description: 'The most New Balance shoe ever: unpretentious, versatile, and enduringly comfortable suede mesh construction.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Upper: 'Suede and Breathable Mesh', Midsole: 'ENCAP Technology', Outsole: 'Carbon Rubber Traction' })
  },
  {
    name: "Zara Men's Relaxed Oversized Poplin Oxford Shirt (Sage Green)",
    price: 2990,
    discountPercent: 15,
    stockQuantity: 65,
    categorySlug: 'fashion',
    brandName: 'Zara',
    sku: 'FA-ZARA-OXFORD-SAGE',
    shortDescription: '100% Organic breathable cotton poplin, camp collar and button-up front with dropped shoulders',
    description: 'Elevate your smart-casual look with this relaxed silhouette tailored from high thread-count lightweight poplin fabric.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Fabric: '100% Organic Cotton', Fit: 'Relaxed Oversized', Care: 'Machine Wash 30°C' })
  },
  {
    name: 'Titan Octane Analog Silver Dial Stainless Steel Watch (90086KM02)',
    price: 7995,
    discountPercent: 25,
    stockQuantity: 40,
    categorySlug: 'fashion',
    brandName: 'Titan',
    sku: 'FA-TITAN-OCTANE-SS',
    shortDescription: 'Precision quartz movement, chronograph subdials, mineral glass crystal with 100m water resistance',
    description: 'Engineered for the man of action. The Octane series brings masculine motorsport styling with brushed stainless steel link bracelet.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ CaseDiameter: '44 mm', CaseMaterial: 'Stainless Steel', WaterResistance: '10 ATM (100 Meters)', Warranty: '2 Years Manufacturer' })
  },
  {
    name: 'Manyavar Royal Embroidered Silk Blend Sherwani Kurta Set (Ivory & Gold)',
    price: 14999,
    discountPercent: 15,
    stockQuantity: 20,
    categorySlug: 'fashion',
    brandName: 'Manyavar',
    sku: 'FA-MANYAVAR-SHERWANI',
    shortDescription: 'Intricate zardozi embroidery, Mandarin collar, self-textured Jacquard silk blend fabric with churidar',
    description: 'Impeccable ethnic grandeur for weddings and celebratory festivities. Crafted to ensure absolute royal comfort and timeless presence.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Fabric: 'Art Silk Jacquard', Includes: '1 Sherwani Kurta + 1 Churidar', Occasion: 'Wedding / Festive Gala' })
  },
  {
    name: 'Fabindia Handcrafted Pure Chanderi Silk Saree with Zari Border',
    price: 8990,
    discountPercent: 10,
    stockQuantity: 30,
    categorySlug: 'fashion',
    brandName: 'Fabindia',
    sku: 'FA-FABINDIA-CHANDERI',
    shortDescription: 'Traditional Chanderi handloom weave, luminous sheer texture and opulent metallic gold zari palla',
    description: 'Celebrate Indian heritage craftsmanship with this featherweight pure Chanderi silk saree designed by master artisan weavers.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Fabric: 'Chanderi Silk Cotton Blend', Length: '6.3 Meters with Blouse Piece', Care: 'Dry Clean Only' })
  },

  // ==========================================
  // 3. BEAUTY & PERSONAL CARE (SKINCARE, HAIRCARE, PERFUMES)
  // ==========================================
  {
    name: 'COSRX Advanced Snail 96 Mucin Power Essence (100ml)',
    price: 1450,
    discountPercent: 18,
    stockQuantity: 80,
    categorySlug: 'beauty-personal-care',
    brandName: 'COSRX',
    sku: 'BP-COSRX-SNAIL96',
    shortDescription: '96.3% Snail Secretion Filtrate, Hyaluronic Acid, intense lightweight hydration for radiant glass skin',
    description: 'Formulated with snail secretion filtrate to deeply replenish, soothe damaged skin barriers, and fade dark spots without any heavy greasy residue.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ SkinType: 'All Skin Types including Sensitive & Acne Prone', Volume: '100 ml', CrueltyFree: '100% Ethical & Cruelty-Free' })
  },
  {
    name: 'The Ordinary Niacinamide 10% + Zinc 1% High-Strength Blemish Formula (30ml)',
    price: 600,
    discountPercent: 5,
    stockQuantity: 120,
    categorySlug: 'beauty-personal-care',
    brandName: 'The Ordinary',
    sku: 'BP-ORDINARY-NIACIN',
    shortDescription: 'Reduces appearance of skin blemishes, visibly minimizes enlarged pores and regulates excess sebum',
    description: 'A cult-classic clarifying serum that targets breakouts and uneven texture, reinforcing barrier lipids for clear, smooth skin.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1608248597359-2b04751433f4?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1608248597359-2b04751433f4?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Formulation: 'Water-based Serum', KeyActives: '10% Niacinamide + 1% Zinc PCA', Volume: '30 ml' })
  },
  {
    name: 'CeraVe Hydrating Facial Cleanser for Normal to Dry Skin with Ceramides (236ml)',
    price: 999,
    discountPercent: 12,
    stockQuantity: 90,
    categorySlug: 'beauty-personal-care',
    brandName: 'CeraVe',
    sku: 'BP-CERAVE-HYDRACLEAN',
    shortDescription: 'Formulated with 3 Essential Ceramides and Hyaluronic Acid using MVE Delivery Technology',
    description: 'Cleanses and refreshes without over-stripping skin moisture or leaving tight feelings. Non-comedogenic and accepted by the National Eczema Association.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Volume: '236 ml (8 oz)', SkinType: 'Normal to Dry', FragranceFree: 'Yes, Non-Irritating' })
  },
  {
    name: 'Dior Sauvage Eau De Parfum for Men (100ml Luxury Vaporisateur Spray)',
    price: 13500,
    discountPercent: 10,
    stockQuantity: 25,
    categorySlug: 'beauty-personal-care',
    brandName: 'Dior',
    sku: 'BP-DIOR-SAUVAGE-EDP',
    shortDescription: 'Sensual Calabrian Bergamot, Sichuan Pepper, Ambroxan and Papua New Guinean Vanilla Absolute',
    description: 'An intensely fresh composition, dictated by a name that has the ring of a manifesto. Untamed wilderness meets noble French luxury perfumery.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Concentration: 'Eau De Parfum (EDP)', FragranceFamily: 'Woody Fresh Citrus', Volume: '100 ml', Longevity: '8-12 Hours+' })
  },
  {
    name: 'Philips Series 7000 14-in-1 All-in-One Multi-Grooming Trimmer Kit (MG7715/65)',
    price: 4295,
    discountPercent: 32,
    stockQuantity: 70,
    categorySlug: 'beauty-personal-care',
    brandName: 'Philips',
    sku: 'BP-PHILIPS-MG7715',
    shortDescription: 'DualCut self-sharpening blades, 120 min lithium-ion battery, fully showerproof with 14 attachments',
    description: 'Style your head, face and body hair with absolute surgical precision using stainless steel self-sharpening dual blades that stay as sharp as day one.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ RunTime: '120 Minutes on 1hr Charge', Blades: 'DualCut Stainless Steel', WaterResistance: '100% Showerproof' })
  },

  // ==========================================
  // 4. SPORTS & FITNESS (WORKOUT GEAR, CRICKET, RACKETS, NUTRITION)
  // ==========================================
  {
    name: 'Bowflex SelectTech 552 Adjustable Dumbbells Pair (2kg to 24kg per dumbbell)',
    price: 26999,
    discountPercent: 22,
    stockQuantity: 15,
    categorySlug: 'sports-outdoors',
    brandName: 'Bowflex',
    sku: 'SP-BOWFLEX-552-PAIR',
    shortDescription: 'Rapid selector dial system replaces 15 sets of weights in one compact space-saving footprint',
    description: 'With just the turn of a dial, change your resistance from 2 kg all the way up to 24 kg. Durable molding around metal plates creates smooth lift-offs and quiet workouts.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ WeightRange: '2.5 to 24 kg (5 to 52.5 lbs)', Settings: '15 Weight Increments', Footprint: 'Space-Saving Storage Trays Included' })
  },
  {
    name: 'Optimum Nutrition (ON) Gold Standard 100% Whey Protein Isolate Powder (Double Rich Chocolate, 2 kg / 4.4 lb)',
    price: 7299,
    discountPercent: 18,
    stockQuantity: 65,
    categorySlug: 'sports-outdoors',
    brandName: 'Optimum Nutrition',
    sku: 'SP-ON-GOLDWHEY-2KG',
    shortDescription: '24g Protein per serving with Whey Protein Isolates as primary ingredient, 5.5g BCAAs and 4g Glutamine',
    description: 'World #1 Selling Whey Protein Powder. Informed Choice certified, banned-substance tested, dissolves effortlessly in cold milk or water with zero clumping.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ ProteinPerScoop: '24 Grams', Servings: '67 Servings', Flavor: 'Double Rich Chocolate', Vegetarian: '100% Vegetarian' })
  },
  {
    name: 'SS Ton Retro Classic Power Plus English Willow Cricket Bat (Short Handle, 1180g)',
    price: 18499,
    discountPercent: 20,
    stockQuantity: 20,
    categorySlug: 'sports-outdoors',
    brandName: 'SS Cricket',
    sku: 'SP-SSTON-ENGLISHWILLOW',
    shortDescription: 'Grade 1 Handcrafted English Willow, massive 40mm thick contoured edges and huge sweet spot profile',
    description: 'Used by leading international test and ODI batsmen. Superb balance and featherlight pickup engineered for explosive boundary hitting.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ WillowGrade: 'Selected Grade 1 English Willow', Weight: '1160 - 1200 grams', Handle: '9 Piece Sarawak Cane Handle' })
  },
  {
    name: 'Boldfit Extra Thick 10mm High-Density Anti-Skid Yoga & Workout Mat with Carrying Strap',
    price: 1499,
    discountPercent: 45,
    stockQuantity: 100,
    categorySlug: 'sports-outdoors',
    brandName: 'Boldfit',
    sku: 'SP-BOLDFIT-YOGAMAT-10MM',
    shortDescription: 'Eco-friendly NBR foam, moisture-resistant ribbed surface, joint cushioning for pilates and home gym',
    description: 'Protects your spine, hips, knees and elbows on hard floors while gripping firmly on tiles and wood surfaces.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Thickness: '10 mm High Density', Dimensions: '183 cm x 61 cm (6ft x 2ft)', Material: 'Non-Toxic Eco NBR Foam' })
  },
  {
    name: 'Yonex Nanoray Light 18i Graphite Badminton Racket (77g 5U, 30 lbs Tension)',
    price: 2490,
    discountPercent: 35,
    stockQuantity: 80,
    categorySlug: 'sports-outdoors',
    brandName: 'Yonex',
    sku: 'SP-YONEX-NANO18I',
    shortDescription: 'Isometric head shape, High Modulus Full Graphite shaft, ultra-lightweight lightning fast swing speeds',
    description: 'Designed for players looking for high-speed counter-attacks with unmatched frame aerodynamics and repulsive power.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Weight: '5U (77 grams)', MaxTension: '30 lbs', Material: 'High Modulus Graphite + Nanomesh Carbon' })
  },

  // ==========================================
  // 5. BOOKS & STATIONERY (BESTSELLERS, WRITING, ART)
  // ==========================================
  {
    name: 'Atomic Habits by James Clear (Hardcover Collector Edition)',
    price: 899,
    discountPercent: 25,
    stockQuantity: 150,
    categorySlug: 'books-stationery',
    brandName: 'Penguin',
    sku: 'BK-ATOMIC-HABITS-HC',
    shortDescription: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones over 15 million copies sold globally',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day with the compound effect of microscopic behavioral adjustments.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Author: 'James Clear', Publisher: 'Penguin Random House', Format: 'Deluxe Hardcover', Pages: '320 Pages', Language: 'English' })
  },
  {
    name: 'Sapiens: A Brief History of Humankind by Yuval Noah Harari',
    price: 599,
    discountPercent: 30,
    stockQuantity: 130,
    categorySlug: 'books-stationery',
    brandName: 'HarperCollins',
    sku: 'BK-SAPIENS-HARARI',
    shortDescription: 'Groundbreaking narrative exploring biology, anthropology, and how our species conquered planet earth',
    description: 'From examining cognitive revolution to scientific explosion, Sapiens will challenge everything you thought you knew about human history.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Author: 'Yuval Noah Harari', Publisher: 'HarperCollins', Pages: '512 Pages', Language: 'English' })
  },
  {
    name: 'Parker Sonnet Stainless Steel Gold Trim Fountain Pen (Medium 18K Gold Plated Nib)',
    price: 7500,
    discountPercent: 15,
    stockQuantity: 30,
    categorySlug: 'books-stationery',
    brandName: 'Parker',
    sku: 'BK-PARKER-SONNET-GT',
    shortDescription: 'Hand-assembled in France, timeless brushed steel finish with 23K gold plated trims and arrow clip',
    description: 'A classic expression of refined style, Sonnet is Parker symbol of elegance with consistent twin-channel ink feed and collector system.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ NibType: 'Medium 18K Gold Finish', InkSystem: 'Cartridge / Piston Converter Included', Packaging: 'Luxury Parker Gift Box' })
  },
  {
    name: 'Moleskine Classic Hardcover Ruled Notebook (Large 5 x 8.25 inches, Sapphire Blue)',
    price: 2195,
    discountPercent: 10,
    stockQuantity: 75,
    categorySlug: 'books-stationery',
    brandName: 'Moleskine',
    sku: 'BK-MOLESKINE-RULED-BLU',
    shortDescription: 'Acid-free 70 g/m² ivory paper, bookmark ribbon, elastic band closure and expandable inner pocket',
    description: 'The legendary notebook used by thinkers, artists and writers for over two centuries. Bound in water-resistant oilcloth cardboard covers.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ Pages: '240 Lined Pages', Dimensions: '13 x 21 cm', PaperWeight: '70 gsm Acid-Free' })
  },
  {
    name: 'Faber-Castell Polychromos Artists Colored Pencils Tin of 36 Assorted Colors',
    price: 6499,
    discountPercent: 18,
    stockQuantity: 40,
    categorySlug: 'books-stationery',
    brandName: 'Faber-Castell',
    sku: 'BK-FABER-POLYCHROMOS36',
    shortDescription: 'Thick 3.8mm oil-based lead, high break resistance with SV bonding and unsurpassed lightfastness',
    description: 'Valued internationally by professionals and semi-professionals for their unmatched blendability and smudge-proof waterproof permanence.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80'],
    specifications: JSON.stringify({ LeadDiameter: '3.8 mm Oil Pastel Core', ColorsCount: '36 Rich Pigments', Case: 'Embossed Metal Storage Tin' })
  }
];

async function main() {
  console.log('=== Adding New Authentic Premium Products to ShopSphere ===');
  console.log(`Total new products prepared: ${NEW_PRODUCTS.length}`);

  // 1. Admin login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN_CREDENTIALS)
  });
  if (!loginRes.ok) throw new Error('Admin login failed');
  const token = (await loginRes.json()).data.token;
  console.log('✅ Admin login successful');

  // 2. Call bulk-import API
  const res = await fetch(`${API_BASE}/admin/products/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(NEW_PRODUCTS)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bulk import failed: ${err}`);
  }

  const result = await res.json();
  console.log('\n🎉 Bulk Ingestion Result:');
  console.log(`  - Total Requested: ${result.data.totalRequested}`);
  console.log(`  - Successfully Imported: ${result.data.importedCount}`);
  console.log(`  - Skipped / Failed: ${result.data.skippedCount}`);

  // 3. Check new grand total in database
  const countRes = await fetch(`${API_BASE}/products?size=1`);
  const countData = await countRes.json();
  console.log(`\n🏆 Grand Total Products now in ShopSphere: ${countData.data.totalElements}`);
}

main().catch(console.error);
