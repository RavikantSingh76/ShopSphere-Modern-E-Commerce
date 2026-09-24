import fs from 'fs';

const API_BASE = 'http://localhost:8080/api';
const ADMIN_CREDENTIALS = {
  email: 'ravikantsinghravi366@gmail.com',
  password: 'Admin@123'
};

const BATCH_55 = [
  // 1. ELECTRONICS (15)
  {
    name: 'Apple iPad Mini (A15 Bionic, 8.3-inch Liquid Retina, 64GB Wi-Fi - Space Grey)',
    price: 49900,
    discountPercent: 8,
    stockQuantity: 30,
    categorySlug: 'electronics',
    brandName: 'Apple',
    shortDescription: 'All-screen design with 8.3-inch Liquid Retina display, Touch ID in top button and Apple Pencil 2 support',
    description: 'Mega power in mini size. iPad mini is meticulously designed to be the consummate notepad and portable workstation.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Sony PlayStation 5 Slim Console (1TB SSD Horizon Forbidden West Bundle)',
    price: 54990,
    discountPercent: 5,
    stockQuantity: 20,
    categorySlug: 'electronics',
    brandName: 'Sony',
    shortDescription: 'Slimmer design with 1TB SSD storage, Ultra-High Speed SSD, Tempest 3D AudioTech and DualSense Haptics',
    description: 'Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers and 3D Audio.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Logitech MX Master 3S Wireless Performance Mouse (8K DPI, Quiet Clicks)',
    price: 9495,
    discountPercent: 12,
    stockQuantity: 50,
    categorySlug: 'electronics',
    brandName: 'Logitech',
    shortDescription: 'Electromagnetic MagSpeed scrolling, 8000 DPI track-on-glass sensor and ergonomic thumb rest',
    description: 'An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Keychron K2 Wireless Mechanical Keyboard (Version 2, Gateron G Pro Brown Switches)',
    price: 8999,
    discountPercent: 15,
    stockQuantity: 40,
    categorySlug: 'electronics',
    brandName: 'Keychron',
    shortDescription: '75% compact 84-key layout, Mac and Windows compatibility, Bluetooth 5.1 with 4000mAh battery',
    description: 'The ultimate wireless mechanical keyboard that maintains all essential multimedia and function keys.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'GoPro HERO 12 Black Waterproof Action Camera (5.3K60 Video, HyperSmooth 6.0)',
    price: 37990,
    discountPercent: 10,
    stockQuantity: 25,
    categorySlug: 'electronics',
    brandName: 'GoPro',
    shortDescription: 'High Dynamic Range (HDR) video + photo, 2x longer runtime with Enduro battery, rugged & waterproof to 10m',
    description: 'Unbelievable image quality, even better HyperSmooth video stabilization and a huge boost in battery life.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'SanDisk Extreme 1TB Portable External SSD (Up to 1050MB/s Read Speed, USB-C)',
    price: 9499,
    discountPercent: 35,
    stockQuantity: 60,
    categorySlug: 'electronics',
    brandName: 'SanDisk',
    shortDescription: 'NVMe solid state performance with 2-meter drop protection and IP55 water and dust resistance',
    description: 'Get fast NVMe solid state performance featuring 1050MB/s read and 1000MB/s write speeds in a portable drive.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'DJI Mini 4 Pro Fly More Combo Drone with RC 2 Smart Controller',
    price: 119900,
    discountPercent: 5,
    stockQuantity: 12,
    categorySlug: 'electronics',
    brandName: 'DJI',
    shortDescription: 'Sub-249g ultra-lightweight, 4K/60fps HDR True Vertical Shooting, Omnidirectional Obstacle Sensing',
    description: 'Integrates powerful imaging capabilities, omnidirectional obstacle sensing, and flagship 20km FHD video transmission.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Kindle Paperwhite Signature Edition 32GB (6.8" Display, Wireless Charging, Auto-Adjusting Light)',
    price: 17999,
    discountPercent: 8,
    stockQuantity: 35,
    categorySlug: 'electronics',
    brandName: 'Amazon Kindle',
    shortDescription: 'Glare-free 300 ppi paper-like display, weeks of battery life, waterproof with warm adjustable light',
    description: 'Get everything in the standard Kindle Paperwhite, plus wireless charging, auto-adjusting front light, and 32 GB storage.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Nintendo Switch OLED Model with White Joy-Con Controllers',
    price: 31999,
    discountPercent: 10,
    stockQuantity: 28,
    categorySlug: 'electronics',
    brandName: 'Nintendo',
    shortDescription: '7-inch vibrant OLED screen, wide adjustable stand, wired LAN dock port and 64GB internal storage',
    description: 'Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen with the Nintendo Switch OLED model.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Anker 735 GaNPrime 65W 3-Port Fast Wall Charger (2x USB-C, 1x USB-A)',
    price: 4999,
    discountPercent: 20,
    stockQuantity: 70,
    categorySlug: 'electronics',
    brandName: 'Anker',
    shortDescription: 'PowerIQ 4.0 dynamic power distribution, GaN technology charges phone, tablet and laptop simultaneously',
    description: 'Equipped with Anker exclusive GaN technology for cooler, smaller, and 3x faster charging across Apple and Android gear.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Sennheiser HD 660S2 Audiophile Open-Back Stereo Headphones',
    price: 49990,
    discountPercent: 15,
    stockQuantity: 15,
    categorySlug: 'electronics',
    brandName: 'Sennheiser',
    shortDescription: '300-ohm impedance, enhanced sub-bass extension, aluminum voice coil engineered in Ireland',
    description: 'Enjoy music on a completely new level. An intimate, relaxed sound broadcast with precision timbre and spaciousness.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Elgato Stream Deck MK.2 with 15 Customizable Macro LCD Keys',
    price: 13999,
    discountPercent: 12,
    stockQuantity: 30,
    categorySlug: 'electronics',
    brandName: 'Elgato',
    shortDescription: 'Tactile control interface for livestreaming, podcasting, coding shortcuts and audio workstation editing',
    description: 'Trigger actions in apps, launch social posts, adjust audio, mute mic, turn on lights, and much more.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'BenQ PD2705U 27-inch 4K UHD Designer IPS Monitor (sRGB 99%, Type-C 65W PD)',
    price: 42990,
    discountPercent: 18,
    stockQuantity: 20,
    categorySlug: 'electronics',
    brandName: 'BenQ',
    shortDescription: 'Calman verified color accuracy, KVM switch, HDR10 and ergonomic height adjustable pivot stand',
    description: 'Engineered for video editors and digital graphic designers demanding true-to-life studio color grading.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Xbox Wireless Controller (Carbon Black, Textured Grip, Bluetooth)',
    price: 5390,
    discountPercent: 10,
    stockQuantity: 65,
    categorySlug: 'electronics',
    brandName: 'Microsoft Xbox',
    shortDescription: 'Hybrid D-pad, textured grip on triggers and bumpers, 3.5mm audio jack with seamless device switching',
    description: 'Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Sony Alpha 7 IV Full-Frame Mirrorless Camera (33MP Exmor R CMOS Sensor)',
    price: 214990,
    discountPercent: 8,
    stockQuantity: 10,
    categorySlug: 'electronics',
    brandName: 'Sony',
    shortDescription: 'BIONZ XR image processor, 4K 60p 10-bit 4:2:2 recording, Real-time Eye AF for Humans/Animals/Birds',
    description: 'The benchmark hybrid for still photography and cinematography with breathtaking clarity and low light dynamics.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80']
  },

  // 2. FASHION & APPAREL (15)
  {
    name: 'Ray-Ban Aviator Classic Polarized Sunglasses (Gold Frame / Green G-15 Lenses)',
    price: 9890,
    discountPercent: 10,
    stockQuantity: 40,
    categorySlug: 'fashion',
    brandName: 'Ray-Ban',
    shortDescription: 'Iconic teardrop metal frame, 100% UV400 polarized optical clarity with crystal clear contrast',
    description: 'Originally designed in 1937 for US aviators, the Ray-Ban Aviator Classic is timeless style meeting optimal eye protection.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Casio G-Shock Carbon Core Guard All-Black Watch (GA-2100-1A1DR CasiOak)',
    price: 8995,
    discountPercent: 15,
    stockQuantity: 50,
    categorySlug: 'fashion',
    brandName: 'Casio',
    shortDescription: 'Octagonal bezel with carbon fiber reinforced resin case, 200m water resistance and dual LED light',
    description: 'The ultra-popular CasiOak features the slimmest case among G-SHOCK combination models with unmatched shock resistance.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Crocs Classic Clog Unisex Comfort Sandals (Black)',
    price: 2995,
    discountPercent: 25,
    stockQuantity: 80,
    categorySlug: 'fashion',
    brandName: 'Crocs',
    shortDescription: 'Original Croslite foam cushioning, pivoting heel straps, ventilation ports that shed water and debris',
    description: 'Incredibly light and fun to wear. Water-friendly, buoyant and easy to clean with soap and water.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Birkenstock Arizona EVA Waterproof Double-Strap Slides (Anthracite)',
    price: 4490,
    discountPercent: 10,
    stockQuantity: 45,
    categorySlug: 'fashion',
    brandName: 'Birkenstock',
    shortDescription: 'Anatomically shaped Birkenstock footbed made from waterproof, washable, ultra-lightweight EVA',
    description: 'A genuine classic that has delighted both men and women for decades with iconic two-strap minimalist design.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Wildcraft 45L Rucksack Cargo Travel Backpack (Grey & Orange)',
    price: 3499,
    discountPercent: 30,
    stockQuantity: 55,
    categorySlug: 'fashion',
    brandName: 'Wildcraft',
    shortDescription: 'Ergonomic padded back system, heavy-duty abrasion-resistant fabric with rain cover compartment',
    description: 'Built for weekend trekking and backpacking with balanced weight transfer and quick-access top lid.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Woodland Men Genuine Camel Leather Rugged Casual Shoes (GC 1868115)',
    price: 4995,
    discountPercent: 20,
    stockQuantity: 60,
    categorySlug: 'fashion',
    brandName: 'Woodland',
    shortDescription: 'Thick nubuck oiled leather upper with grooved high-traction rubber outsole for all-terrain trekking',
    description: 'The quintessence of rugged adventure. Indestructible construction built to withstand heavy wilderness expeditions.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Tommy Hilfiger Men Reversible Genuine Leather Belt with Polished Metal Buckle',
    price: 2799,
    discountPercent: 25,
    stockQuantity: 70,
    categorySlug: 'fashion',
    brandName: 'Tommy Hilfiger',
    shortDescription: '100% Full grain reversible leather (Black on one side, Dark Brown on reverse) with twist buckle',
    description: 'Two versatile executive belts in one. Seamlessly twist the brushed gunmetal buckle to match your shoes.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'H&M Men Classic Denim Trucker Jacket (Washed Indigo Blue)',
    price: 3999,
    discountPercent: 20,
    stockQuantity: 40,
    categorySlug: 'fashion',
    brandName: 'H&M',
    shortDescription: 'Sturdy cotton denim with turn-down collar, buttoned flap chest pockets and adjustable waist tabs',
    description: 'A timeless layering piece designed with authentic vintage fading that improves with age and wear.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Timberland 6-Inch Premium Waterproof Nubuck Leather Boots (Wheat Yellow)',
    price: 16999,
    discountPercent: 12,
    stockQuantity: 25,
    categorySlug: 'fashion',
    brandName: 'Timberland',
    shortDescription: 'Direct-attach waterproof seam-sealed construction, PrimaLoft insulation and anti-fatigue footbed',
    description: 'The original yellow boot that helped start it all nearly forty years ago. Iconic heritage and rugged styling.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Calvin Klein Modern Cotton Stretch Trunks (Pack of 3 - Black/Grey/White)',
    price: 3299,
    discountPercent: 20,
    stockQuantity: 85,
    categorySlug: 'fashion',
    brandName: 'Calvin Klein',
    shortDescription: 'Breathable combed cotton elastane blend with signature repeated repeating logo flexible waistband',
    description: 'Ultimate daily comfort crafted from soft cotton stretch fabric designed for flexible unrestricted mobility.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Fossil Machine Smoke Stainless Steel Chronograph Watch (FS4931)',
    price: 13495,
    discountPercent: 30,
    stockQuantity: 35,
    categorySlug: 'fashion',
    brandName: 'Fossil',
    shortDescription: '45mm oversized case with knurled textured top ring, smoked IP coating and matching link bracelet',
    description: 'Masculine industrial aesthetics inspired by vintage aviation gauges and aeronautical engineering.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Allen Solly Men Flat-Front Cotton Chino Trousers (Khaki Beige)',
    price: 2199,
    discountPercent: 35,
    stockQuantity: 70,
    categorySlug: 'fashion',
    brandName: 'Allen Solly',
    shortDescription: '100% Premium twill cotton, custom slim fit, slanted side pockets and double welt back pockets',
    description: 'Friday dressing perfected. Transition seamlessly from corporate boardroom meetings to weekend social brunches.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'W for Woman Gold Foil Printed Straight Festive Kurta with Palazzos',
    price: 3599,
    discountPercent: 40,
    stockQuantity: 50,
    categorySlug: 'fashion',
    brandName: 'W for Woman',
    shortDescription: 'Rich jewel tone rayon blend with metallic gold foil floral motifs and flared palazzo pants',
    description: 'Contemporary Indian ethnic elegance that stands out during festive celebrations, parties and festivals.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Zara Water-Repellent Double-Breasted Trench Coat (Camel Tan)',
    price: 8990,
    discountPercent: 15,
    stockQuantity: 25,
    categorySlug: 'fashion',
    brandName: 'Zara',
    shortDescription: 'Lapel collar, shoulder epaulettes, long sleeves with cuff straps and matching tie belt with buckle',
    description: 'Sophisticated Parisian outerwear tailored with sharp structuring that elevates any formal or street outfit.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Peter England Elite Royal Navy Blue Two-Piece Formal Suit',
    price: 9999,
    discountPercent: 20,
    stockQuantity: 30,
    categorySlug: 'fashion',
    brandName: 'Peter England',
    shortDescription: 'Notch lapel jacket with double vent and flat-front trousers woven in wrinkle-resistant poly-viscose',
    description: 'Sharp, tailored silhouette engineered to deliver an impeccable executive profile for corporate summits and weddings.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80']
  },

  // 3. BEAUTY & PERSONAL CARE (10)
  {
    name: 'The Body Shop British Rose Shower Gel with Organic Aloe Vera (250ml)',
    price: 495,
    discountPercent: 10,
    stockQuantity: 90,
    categorySlug: 'beauty-personal-care',
    brandName: 'The Body Shop',
    shortDescription: 'Soap-free cleansing gel enriched with handpicked English rose extract that leaves skin petal-soft',
    description: 'Lather up with the sweet, romantic scent of fresh blooming roses. 100% vegan formula in recycled packaging.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Forest Essentials Soundarya Radiance Cream with 24K Gold & SPF 25 (50g)',
    price: 6800,
    discountPercent: 5,
    stockQuantity: 20,
    categorySlug: 'beauty-personal-care',
    brandName: 'Forest Essentials',
    shortDescription: 'Pure 24 Karat Gold Bhasma, saffron, cow ghee and cold-pressed oils prepared via ancient Vedic recipe',
    description: 'Luxury Ayurvedic day cream that penetrates deep skin layers to restore elasticity and natural youthful luminescence.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Plum Green Tea Pore Cleansing Face Wash with Glycolic Acid (120ml)',
    price: 345,
    discountPercent: 15,
    stockQuantity: 110,
    categorySlug: 'beauty-personal-care',
    brandName: 'Plum',
    shortDescription: 'Soap-free foaming cleanser with cellulose green tea beads that combats acne and unclogs pores',
    description: 'Gentle exfoliating face wash specially formulated for oily, combination and acne-prone Indian skin.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Kama Ayurveda Pure Rose Water Face Mist (200ml Steam Distilled)',
    price: 1595,
    discountPercent: 10,
    stockQuantity: 70,
    categorySlug: 'beauty-personal-care',
    brandName: 'Kama Ayurveda',
    shortDescription: '100% natural steam-distilled Kannauj roses, balances skin pH levels and tightens facial pores',
    description: 'Pure floral water that revives tired skin with intense hydration, calming redness and toning naturally.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Nykaa Matte to Last Liquid Lipstick (Chai Shade, 5ml Transfer-Proof)',
    price: 649,
    discountPercent: 20,
    stockQuantity: 120,
    categorySlug: 'beauty-personal-care',
    brandName: 'Nykaa',
    shortDescription: 'Infused with Vitamin E, 12-hour ultra-matte lightweight formula that does not feather or bleed',
    description: 'The iconic nude brown everyday shade curated specially to flatter every beautiful Indian skin tone.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Biotique Bio Kelp Protein Shampoo for Falling Hair Intensive Growth (650ml)',
    price: 490,
    discountPercent: 25,
    stockQuantity: 130,
    categorySlug: 'beauty-personal-care',
    brandName: 'Biotique',
    shortDescription: 'Blend of pure kelp, natural proteins, peppermint oil and mint leaf extract to invigorate hair roots',
    description: 'Therapeutic Ayurvedic formulation that gently cleanses hair and invigorates the scalp for healthier hair growth.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'L’Occitane 20% Shea Butter Hand Cream for Dry Hands (150ml Travel Size)',
    price: 2450,
    discountPercent: 5,
    stockQuantity: 40,
    categorySlug: 'beauty-personal-care',
    brandName: "L'Occitane",
    shortDescription: 'Enriched with 20% organic Shea Butter, honey, almond extracts and coconut oil for soft hands',
    description: 'Globally celebrated hand care balm that rapidly penetrates to nourish, protect and repair dry cracked skin.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Maybelline Fit Me Matte + Poreless Liquid Foundation with Clay & SPF 22 (Warm Nude 128)',
    price: 649,
    discountPercent: 25,
    stockQuantity: 150,
    categorySlug: 'beauty-personal-care',
    brandName: 'Maybelline',
    shortDescription: 'Micro-powders absorb shine while blurring visible pores for a natural seamless matte finish',
    description: 'Ideal for normal to oily skin. Dermatologist tested, allergy tested and non-comedogenic for everyday wear.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Neutrogena Ultra Sheer Dry-Touch Broad Spectrum Sunscreen SPF 50+ (88ml)',
    price: 675,
    discountPercent: 15,
    stockQuantity: 140,
    categorySlug: 'beauty-personal-care',
    brandName: 'Neutrogena',
    shortDescription: 'Helioplex technology provides superior broad-spectrum protection against skin-aging UVA and burning UVB',
    description: 'Feels clean and lightweight with Dry-Touch technology for a non-greasy, matte finish that absorbs instantly.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Tresemme Keratin Smooth Frizz Control Hair Conditioner with Argan Oil (340ml)',
    price: 360,
    discountPercent: 20,
    stockQuantity: 160,
    categorySlug: 'beauty-personal-care',
    brandName: 'Tresemme',
    shortDescription: 'Dual action formula infused with Keratin and Moroccan Argan Oil gives up to 72 hours of frizz control',
    description: 'Detangles unruly hair, tames flyaways and boosts mirror-like glossy shine for salon-like smoothness.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80']
  },

  // 4. SPORTS & FITNESS (10)
  {
    name: 'Yonex Mavis 350 Nylon Shuttlecocks (Yellow, Pack of 6 Tubes)',
    price: 1199,
    discountPercent: 15,
    stockQuantity: 120,
    categorySlug: 'sports-outdoors',
    brandName: 'Yonex',
    shortDescription: 'Precision engineered nylon skirt with natural Portuguese cork base, fast recovery and true flight',
    description: 'The gold standard training and club shuttlecock worldwide. Offers up to 5x more durability than feather shuttles.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Decathlon Quechua 2 Seconds Easy Pop-Up Camping Tent (2-Person Waterproof)',
    price: 5999,
    discountPercent: 10,
    stockQuantity: 25,
    categorySlug: 'sports-outdoors',
    brandName: 'Decathlon',
    shortDescription: 'Patented push-button instant assembly, Fresh & Black blackout fabric blocks 99% of daylight',
    description: 'Pitch and fold your campsite tent in seconds. Engineered to resist 50 km/h winds and tropical downpours.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Cosco High Speed Skipping Rope with 360-Degree Ball Bearings',
    price: 349,
    discountPercent: 30,
    stockQuantity: 150,
    categorySlug: 'sports-outdoors',
    brandName: 'Cosco',
    shortDescription: 'Kink-free steel wire coated in protective PVC with lightweight ergonomic anti-slip aluminum handles',
    description: 'Designed for rapid double-unders, cross-training cardio conditioning and boxing agility drills.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Boldfit Gym Shaker Bottle with Wire Whisk Blender Ball (700ml Leak-Proof)',
    price: 299,
    discountPercent: 40,
    stockQuantity: 180,
    categorySlug: 'sports-outdoors',
    brandName: 'Boldfit',
    shortDescription: '100% BPA-Free food grade material, flip cap with secure twist-lock and surgical stainless steel ball',
    description: 'Mixes the thickest protein powders and pre-workout drinks smoothly without lumps in seconds.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'SS Pro Wheelie Cricket Kit Bag with Heavy Duty Tractor Wheels',
    price: 4999,
    discountPercent: 20,
    stockQuantity: 30,
    categorySlug: 'sports-outdoors',
    brandName: 'SS Cricket',
    shortDescription: 'Heavy-duty 1680D nylon canvas with 3 external padded bat sleeves and ventilated shoe pocket',
    description: 'Spacious luggage capacity designed to carry 3 full-size bats, pads, gloves, helmet and spikes with ease.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Nivia Classic Heavy Red Tennis Cricket Balls (Pack of 6)',
    price: 480,
    discountPercent: 15,
    stockQuantity: 200,
    categorySlug: 'sports-outdoors',
    brandName: 'Nivia',
    shortDescription: 'Durable woven felt cover over pure rubber core designed for high-bounce gully cricket matches',
    description: 'The most popular tennis cricket ball in India, engineered for consistent swing, seam and long life.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Decathlon Domyos Ergonomic Push-Up Bars Grips (Pair)',
    price: 699,
    discountPercent: 20,
    stockQuantity: 85,
    categorySlug: 'sports-outdoors',
    brandName: 'Decathlon',
    shortDescription: 'Raised angled elevation relieves wrist strain while enabling deeper chest pectoral stretch',
    description: 'Reinforced steel base with non-slip rubber grip handles that grip firmly on wooden floors and tiles.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Nivia Pro Carbon Shin Guards with Ankle Socks Protection',
    price: 399,
    discountPercent: 25,
    stockQuantity: 110,
    categorySlug: 'sports-outdoors',
    brandName: 'Nivia',
    shortDescription: 'Anatomical polypropylene hard shield backed with shock-absorbing EVA foam and stirrup socks',
    description: 'Provides comprehensive protection against aggressive soccer tackles and high ball kicks.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Speedo Ergonomic Biofuse Ear Plugs for Swimming (Pair in Case)',
    price: 599,
    discountPercent: 10,
    stockQuantity: 130,
    categorySlug: 'sports-outdoors',
    brandName: 'Speedo',
    shortDescription: 'Biofuse technology delivers customized ear canal fit that prevents water entry without pressure',
    description: 'Easy insertion and removal with soft seals that keep your ears dry and infection-free during laps.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Kobo Elastic Cotton Boxing Hand Wraps with Thumb Loop (4 Meters Pair)',
    price: 349,
    discountPercent: 30,
    stockQuantity: 140,
    categorySlug: 'sports-outdoors',
    brandName: 'Kobo',
    shortDescription: 'Semi-elastic Mexican style stretch fabric supports metacarpal bones and wrists inside gloves',
    description: 'Essential gear for MMA, kickboxing and heavy bag training with secure Velcro hook-and-loop closure.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80']
  },

  // 5. BOOKS & STATIONERY (5)
  {
    name: 'Can\'t Hurt Me: Master Your Mind and Defy the Odds by David Goggins',
    price: 699,
    discountPercent: 20,
    stockQuantity: 95,
    categorySlug: 'books-stationery',
    brandName: 'Lioncrest',
    shortDescription: 'The inspirational autobiography of Navy SEAL David Goggins detailing the 40% rule and mental toughness',
    description: 'For David Goggins, childhood was a nightmare. Through self-discipline, mental toughness, and hard work, he transformed himself into an icon.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Thinking, Fast and Slow by Daniel Kahneman (Nobel Laureate in Economics)',
    price: 599,
    discountPercent: 25,
    stockQuantity: 80,
    categorySlug: 'books-stationery',
    brandName: 'Penguin',
    shortDescription: 'Engaging tour of the mind explaining the two systems that drive the way we think and make judgments',
    description: 'System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical. A tour-de-force of behavioral economics.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Deep Work: Rules for Focused Success in a Distracted World by Cal Newport',
    price: 499,
    discountPercent: 20,
    stockQuantity: 90,
    categorySlug: 'books-stationery',
    brandName: 'Grand Central Publishing',
    shortDescription: 'A guide to cultivating intense concentration to quickly master complicated information and produce better results',
    description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It is a super power in our increasingly competitive economy.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Faber-Castell Pitt Artist Pens Black Pigment Fineliner Set of 4 (XS, S, F, M)',
    price: 649,
    discountPercent: 15,
    stockQuantity: 70,
    categorySlug: 'books-stationery',
    brandName: 'Faber-Castell',
    shortDescription: 'India ink ink pens with acid-free archival quality, odorless, waterproof and permanent on paper',
    description: 'Ink drawings have an extremely long artistic tradition. Highly lightfast and smudge-proof for manga and technical drawing.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80']
  },
  {
    name: 'Kokuyo Campus Twin Ring Ruled Notebooks A5 Pack of 5 Pastel Colors',
    price: 899,
    discountPercent: 18,
    stockQuantity: 85,
    categorySlug: 'books-stationery',
    brandName: 'Kokuyo',
    shortDescription: 'Japanese silky smooth fountain-pen friendly paper, bleed-resistant with flat 360-degree fold rings',
    description: 'The #1 bestselling student notebook in Japan. Dotted lines allow precision diagramming and legible handwriting.',
    primaryImageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80']
  }
];

async function main() {
  console.log('=== Adding Batch to cross 500 products ===');
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
    body: JSON.stringify(BATCH_55)
  });

  const data = await res.json();
  console.log('Bulk Import Response:', data.data);

  const countRes = await fetch(`${API_BASE}/products?size=1`);
  const countData = await countRes.json();
  console.log(`\n🏆 Grand Total Products now in ShopSphere: ${countData.data.totalElements}`);
}

main().catch(console.error);
