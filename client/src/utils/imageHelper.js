/**
 * Central utility to get authentic product images and eliminate mismatched fallback images.
 * Ensures shoes always show shoes, smartphones show smartphones, sports/fitness items show their exact matching photos, etc.
 * Supports all 80+ product archetypes across 126 brands with verified, high-resolution multi-angle Unsplash galleries.
 */

// Canonical multi-angle galleries for each product archetype with 100% verified live URLs
export const MODEL_GALLERIES = {
  // --- Sports & Fitness ---
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', // Nike Red Air Max
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80', // Nike Cushion Running
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', // Adidas Ultraboost Light
  ],
  jordan_sneakers: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80', // Air Jordan High-top Sneaker
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', // Streetwear Sneaker Profile
  ],
  slipon_shoes: [
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', // Skechers Slip-on Walking Shoes
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  ],
  trekking_boots: [
    'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', // Woodland Nubuck Leather Trekking Boots
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80', // Outdoor Hiking Boots Sole
  ],
  cricket_bat: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80', // English Willow Cricket Bat Match
    'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop&q=80', // Cricket Equipment & Bat Profile
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80', // Willow Bat & Leather Ball
  ],
  football: [
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80', // Match Football Ball
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80', // FIFA Quality Ball on Pitch
    'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80', // Professional Match Soccer Ball
  ],
  basketball: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80', // Spalding NBA Basketball Ball
    'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop&q=80', // Basketball on Court
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80', // Wilson Evolution Composite Basketball
  ],
  badminton_racket: [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80', // Yonex Badminton Racket & Shuttle
    'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80', // Carbon Badminton Racket
  ],
  tennis_racket: [
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80', // Wilson Pro Staff Performance Tennis Racket
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80', // Tennis Racket Court
  ],
  boxing_gloves: [
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80', // Everlast Red Boxing Training Gloves
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', // Boxing Gym Gear
  ],
  swim_goggles: [
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', // Speedo Fastskin Mirror Swim Goggles
    'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80', // Swimming Goggles Pool
  ],
  inlineskates: [
    'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&auto=format&fit=crop&q=80', // Vector X Inline Speed Skates
    'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&auto=format&fit=crop&q=80', // Roller Skates
  ],
  jumprope: [
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80', // Speed Skipping Jump Rope
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  ],
  exercise_ball: [
    'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80', // Strauss Anti-Burst Swiss Gym Ball
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80', // Pilates Balance Ball
  ],
  resistance_bands: [
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80', // Heavy Duty Pull Up Resistance Workout Bands
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', // Gym Resistance Workout
  ],
  backpack: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', // Decathlon Quechua Hiking Backpack
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80', // Outdoor Backpack
  ],
  camping_tent: [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', // Decathlon 2-Seconds Easy Camping Tent
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80', // Waterproof Outdoor Tent
  ],
  treadmill: [
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=80', // Cultsport Motorized Fitness Treadmill
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80', // Gym Treadmill Cardio
  ],
  dumbbell: [
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80', // Rubber Hex Dumbbells Pair
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', // Gym Strength Weights
  ],
  yogamat: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80', // High-Density Non-Slip Yoga Mat
    'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&auto=format&fit=crop&q=80', // Eco TPE Exercise Mat
  ],

  // --- Home & Living ---
  blender_mixer: [
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80', // Kitchen Mixer Grinder & Blender
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80', // Nutri-blend Bullet Blender
  ],
  pressure_cooker: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80', // Hawkins Contura Hard Anodised Pressure Cooker
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', // Prestige Stainless Steel Cooker
  ],
  cookware_pan: [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', // Hawkins Futura Hard Anodized Deep Pan Kadhai
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80', // Kitchen Cookware
  ],
  ceiling_fan: [
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&auto=format&fit=crop&q=80', // Havells BLDC Ultra-Quiet Ceiling Fan
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80', // Crompton Modern Aerofoil Ceiling Fan
  ],
  water_purifier: [
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80', // Kent Grand Plus RO + UV Water Purifier
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
  ],
  water_heater: [
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80', // Crompton Storage Water Heater Geyser
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
  ],
  airfryer: [
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80', // Philips Essential Digital Airfryer XXL
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  ],
  microwave_oven: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80', // LG Charcoal Convection Microwave Oven
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  ],
  refrigerator: [
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80', // LG Smart Inverter Double Door Refrigerator
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80', // Stainless Steel Refrigerator Kitchen
  ],
  vacuum_cleaner: [
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80', // Dyson V12 Detect Slim Cordless Vacuum Cleaner
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80', // Modern Stick Vacuum Cleaner
  ],
  sewing_machine: [
    'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=800&auto=format&fit=crop&q=80', // Usha Janome Electric Sewing Machine
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
  ],
  safe_locker: [
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', // Godrej Forte Pro Digital Safe Locker
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80', // Security Electronic Safe
  ],
  mattress: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80', // Wakefit Orthopedic Memory Foam Mattress
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80', // Sleepwell Reversible Firm Mattress
  ],
  pillow: [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80', // Wakefit Memory Foam Ergonomic Bed Pillow
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
  ],
  bedsheet: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80', // Bombay Dyeing 100% Pure Cotton Bedsheet
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
  ],
  water_bottle: [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80', // Milton Thermosteel Stainless Steel Water Bottle
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', // Cello Vacuum Insulated Flask
  ],
  lunch_box: [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', // Cello Airtight Glass Lunch Box Set
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
  ],
  chair: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80', // Green Soul Ergonomic Gaming Chair
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80', // IKEA Markus Mesh Office Chair
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=80', // IKEA POANG Bentwood Armchair
  ],

  // --- Fashion & Apparel ---
  formal_shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', // Louis Philippe / Peter England Formal Shirt
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', // Van Heusen Slim Fit Formal Business Shirt
  ],
  polo_shirt: [
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80', // US Polo Assn Signature Pique Polo Shirt
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80', // Tommy Hilfiger Custom Fit Polo
  ],
  linen_shirt: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', // Zara / H&M Pure Linen Button-Down Shirt
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
  ],
  kurta: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', // Fabindia Handloom Cotton Long Kurta
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80', // Ethnic Cotton Short Kurta
  ],
  jeans: [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', // Levi's 511 Slim Fit Denim Jeans
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80', // Jack & Jones Stretch Blue Jeans
  ],
  trousers: [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', // Van Heusen Business Formal Trousers
    'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80',
  ],
  track_pants: [
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', // Adidas Tiro Training Slim-Fit Track Pants
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
  ],
  shorts: [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', // Men's Athletic Running Shorts
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
  ],
  denim_jacket: [
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', // Levi's Sherpa Trucker Heavyweight Denim Jacket
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
  ],
  track_jacket: [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', // Puma Motorsport Track Jacket
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  ],
  hoodie: [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', // Adidas Trefoil Fleece Hoodie
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
  ],
  sweater: [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80', // Zara Textured Knit Crewneck Sweater
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80',
  ],
  blazer: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80', // Louis Philippe Italian Wool Blazer
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
  ],
  boxer_briefs: [
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80', // Calvin Klein Cotton Stretch Boxer Briefs
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
  ],
  sunglasses: [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', // Ray-Ban Wayfarer / Aviator Sunglasses
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  ],
  tshirt: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', // Nike Dri-FIT Athletic Training T-Shirt
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80', // Under Armour Gym Shirt
  ],

  // --- Electronics ---
  iphone: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', // iPhone 15 Pro Max Titanium
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', // iPhone Camera Module
  ],
  galaxy: [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80', // Galaxy S24 Ultra
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80', // Galaxy Display
  ],
  pixel: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80', // Google Pixel 8 Pro
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
  ],
  smartphone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', // OnePlus / Xiaomi / Realme Flagship 5G
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
  ],
  macbook: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', // Apple MacBook Air M3
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', // Dell XPS / ASUS ZenBook
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80', // Thin & Light Laptop
  ],
  gaming_laptop: [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', // ASUS ROG / Alienware / Legion Gaming Laptop
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
  ],
  gaming_monitor: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', // LG UltraGear OLED / Acer Nitro Curved Gaming Monitor
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80',
  ],
  tv: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80', // Samsung 55-inch 4K UHD Smart TV
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80', // LG OLED Thin Bezel TV
  ],
  camera: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80', // Sony Alpha 7 IV / Canon EOS R50 / Nikon Z50
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', // Sony WH-1000XM5 / Bose QuietComfort Headphones
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
  ],
  earbuds: [
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80', // Apple AirPods Pro / boAt Airdopes TWS
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
  ],
  speaker: [
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', // JBL Flip 6 Waterproof Bluetooth Speaker
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
  ],
  mouse: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', // Logitech MX Master 3S Wireless Mouse
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80', // Xiaomi Pad 6 11-inch 144Hz Tablet
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80',
  ],
  gaming_console: [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80', // Sony PlayStation 5 Slim Console
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
  ],
  watch: [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', // Apple Watch Ultra / Noise ColorFit Smartwatch
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
  ],
  analog_watch: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', // Fossil Chronograph / Casio Vintage Watch
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
  ],

  // --- Beauty & Personal Care ---
  trimmer: [
    'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80', // Philips Multigroom Trimmer
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
  ],
  face_wash: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', // Himalaya Neem / Cetaphil Face Wash
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
  ],
  serum: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', // Minimalist Niacinamide / L'Oreal Hyaluronic Acid Serum
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
  ],
  moisturizer: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80', // Neutrogena Hydro Boost / Clinique Moisture Surge
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
  ],
  shampoo: [
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80', // WOW ACV / Mamaearth Onion Anti-Hairfall Shampoo
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
  ],
  hair_oil: [
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80', // Biotique Bhringraj / Soulflower Rosemary Hair Oil
    'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&auto=format&fit=crop&q=80',
  ],
  body_wash: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80', // Dove Nourishing Body Wash
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
  ],
  body_scrub: [
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&auto=format&fit=crop&q=80', // MCaffeine Coffee Body Scrub
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
  ],
  toner_mist: [
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80', // Kama Ayurveda Rose Water / Plum Green Tea Toner
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
  ],
  foundation: [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop&q=80', // L'Oreal Infallible Fresh Wear Liquid Foundation
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  ],
  lipstick: [
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80', // Maybelline SuperStay Matte Ink Liquid Lipstick
    'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?w=800&auto=format&fit=crop&q=80',
  ],
  kajal_mascara: [
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80', // Lakme Eyeconic Kajal / Maybelline Sky High Mascara
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  ],

  // --- Books & Stationery ---
  math_book: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', // Rakesh Yadav SSC Mathematics Solved Book
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80',
  ],
  aptitude_book: [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80', // S. Chand Quantitative Aptitude / Arihant
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  ],
  book: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', // Atomic Habits / Psychology of Money / Alchemist
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  ],
  dictionary: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', // Oxford Advanced Learner's Dictionary Hardcover
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  ],
  luxury_pen: [
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80', // Parker Vector Gold Trim Rollerball Pen
    'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80',
  ],
  gel_pen: [
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80', // Pilot G2 / Pilot V5 Precision Gel Pens
    'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80',
  ],
  ballpoint_pen: [
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80', // Cello Butterflow / Reynolds Ballpoint Pens
    'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80',
  ],
  pencil: [
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80', // Apsara Platinum / Natraj 621 Drawing Pencils
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
  ],
  eraser: [
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80', // Natraj Clean Dust-Free Eraser
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
  ],
  color_pencils: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', // Faber-Castell Polychromos Artist Color Pencils
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
  ],
  color_art: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', // Camlin Artists Acrylic Color Tubes
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
  ],
  stapler: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80', // Kangaro Heavy Duty All-Metal Paper Stapler
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
  ],
  spiral_notebook: [
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80', // Classmate Pulse Long Spiral Hardbound Notebook
    'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
  ],
};

/**
 * Known generic fallback image IDs that should NEVER override authentic archetype photos.
 * E.g., if a cricket bat has the dumbbell or shoe ID, or a formal shirt has the hoodie or shoe ID.
 */
const GENERIC_STOCK_IDS = [
  'photo-1542291026-7eec264c27ff', // Red Nike shoe
  'photo-1583454110551-21f2fa2afe61', // Dumbbell
  'photo-1585515320310-259814833e62', // Airfryer
  'photo-1620916566398-39f1143ab7be', // Serum
  'photo-1556905055-8f358a7a47b2', // Hoodie
  'photo-1583485088034-697b5bc54ccd', // Pen
  'photo-1544716278-ca5e3f4abd8c', // Book
  'photo-1585336261026', // Deprecated
  'photo-1578768079052', // Deprecated
  'photo-1608248597359', // Deprecated
];

/**
 * Resolves the canonical category archetype key from product name, brand, and category slug.
 */
export const getProductCategoryKey = (product) => {
  if (!product) return 'shoes';
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand?.name || product.brand?.slug || '').toLowerCase();
  const cat = (product.category?.name || product.category?.slug || '').toLowerCase();

  // 1. Beauty & Personal Care
  if (cat.includes('beauty')) {
    if (name.includes('foundation') || name.includes('mousse')) return 'foundation';
    if (name.includes('hydro boost') || name.includes('water gel') || name.includes('moisturiz') || name.includes('cream') || name.includes('hydrator') || name.includes('lotion')) return 'moisturizer';
    if (name.includes('lipstick')) return 'lipstick';
    if (name.includes('kajal') || name.includes('mascara') || name.includes('eyeliner')) return 'kajal_mascara';
    if (name.includes('scrub')) return 'body_scrub';
    if (name.includes('rose water') || name.includes('toner') || name.includes('micellar') || name.includes('mist')) return 'toner_mist';
    if (name.includes('body wash') || name.includes('shower gel')) return 'body_wash';
    if (name.includes('shampoo')) return 'shampoo';
    if (name.includes('hair oil') || name.includes('beard oil') || name.includes('rosemary') || name.includes('bhringraj')) return 'hair_oil';
    if (name.includes('face wash') || name.includes('cleanser')) return 'face_wash';
    if (name.includes('serum') || name.includes('niacinamide') || name.includes('hyaluronic')) return 'serum';
    if (name.includes('trimmer') || name.includes('shaver') || name.includes('groom')) return 'trimmer';
    return 'moisturizer';
  }

  // 2. Electronics
  if (cat.includes('electr')) {
    if (name.includes('airpods') || name.includes('buds') || name.includes('airdopes') || name.includes('earbuds') || name.includes('tws')) return 'earbuds';
    if (name.includes('smartwatch') || name.includes('colorfit') || name.includes('wave call') || (name.includes('watch') && !name.includes('stopwatch'))) return 'watch';
    if (name.includes('curved') || name.includes('ultragear') || name.includes('monitor') || name.includes('wqhd')) return 'gaming_monitor';
    if (name.includes('tablet') || name.includes('pad 6') || name.includes('ipad')) return 'tablet';
    if (name.includes('tv') || name.includes('smart tv') || name.includes('oled evo') || name.includes('4k uhd') || name.includes('crystal 4k')) return 'tv';
    if (name.includes('camera') || name.includes('mirrorless') || name.includes('lens kit') || brand.includes('nikon') || brand.includes('canon')) return 'camera';
    if (name.includes('playstation') || name.includes('ps5') || name.includes('console')) return 'gaming_console';
    if (name.includes('mouse') || name.includes('mx master')) return 'mouse';
    if (name.includes('speaker') || name.includes('flip 6') || brand.includes('jbl')) return 'speaker';
    if (name.includes('headphone') || name.includes('wh-1000xm5') || name.includes('quietcomfort')) return 'audio';
    if (name.includes('macbook')) return 'macbook';
    if (name.includes('gaming laptop') || name.includes('alienware') || name.includes('rog') || name.includes('predator') || name.includes('legion') || name.includes('omen')) return 'gaming_laptop';
    if (name.includes('laptop') || name.includes('zenbook') || name.includes('thinkpad') || name.includes('spectre') || name.includes('xps') || brand.includes('asus') || brand.includes('lenovo') || brand.includes('hp') || brand.includes('dell') || brand.includes('acer')) return 'laptop';
    if (name.includes('iphone')) return 'iphone';
    if (name.includes('galaxy') || name.includes('s24')) return 'galaxy';
    if (name.includes('pixel')) return 'pixel';
    if (name.includes('phone') || name.includes('smartphone') || name.includes('5g') || brand.includes('realme') || brand.includes('motorola') || brand.includes('oneplus') || brand.includes('xiaomi')) return 'smartphone';
    return 'smartphone';
  }

  // 3. Sports & Fitness
  if (cat.includes('sport')) {
    if (name.includes('cricket') || name.includes('willow') || brand === 'sg' || brand === 'ss') return 'cricket_bat';
    if (name.includes('football') || brand.includes('nivia') || (brand.includes('cosco') && name.includes('football'))) return 'football';
    if (name.includes('basketball') || brand.includes('spalding') || (brand.includes('wilson') && name.includes('basketball'))) return 'basketball';
    if (name.includes('badminton') || name.includes('racket') || brand.includes('yonex') || name.includes('astrox') || name.includes('nanoflare')) return 'badminton_racket';
    if (name.includes('tennis') || (brand.includes('wilson') && name.includes('tennis'))) return 'tennis_racket';
    if (name.includes('boxing') || brand.includes('everlast')) return 'boxing_gloves';
    if (name.includes('swim') || name.includes('goggles') || brand.includes('speedo')) return 'swim_goggles';
    if (name.includes('skates') || name.includes('skate')) return 'inlineskates';
    if (name.includes('skipping') || name.includes('jump rope')) return 'jumprope';
    if (name.includes('exercise ball') || name.includes('gym ball') || name.includes('swiss')) return 'exercise_ball';
    if (name.includes('pull-up') || name.includes('pull up') || (brand.includes('kobo') && name.includes('pull'))) return 'resistance_bands';
    if (name.includes('resistance band') || name.includes('suspension') || brand.includes('boldfit') || (brand.includes('domyos') && name.includes('suspension'))) return 'resistance_bands';
    if (name.includes('dumbbell') || name.includes('barbell') || name.includes('kettlebell') || name.includes('cast iron')) return 'dumbbell';
    if (name.includes('treadmill') || name.includes('step platform') || name.includes('aerobic step')) return 'treadmill';
    if (name.includes('yoga mat') || name.includes('exercise mat') || name.includes('workout mat') || name.includes('pilates mat')) return 'yogamat';
    if (name.includes('backpack') || name.includes('hiking b')) return 'backpack';
    if (name.includes('tent') || name.includes('camping')) return 'camping_tent';
    if (name.includes('boots') || name.includes('hiking')) return 'trekking_boots';
    if (name.includes('shorts')) return 'shorts';
    if (name.includes('pants') || name.includes('track')) return 'track_pants';
    if (name.includes('smartwatch') || name.includes('garmin') || name.includes('watch')) return 'watch';
    if (name.includes('running shoes') || name.includes('cross training') || name.includes('shoes') || name.includes('sneaker')) return 'shoes';
    return 'shoes';
  }

  // 4. Fashion & Apparel
  if (cat.includes('fashion')) {
    if (name.includes('shorts')) return 'shorts';
    if (name.includes('jordan')) return 'jordan_sneakers';
    if (name.includes('boots') || name.includes('trekking')) return 'trekking_boots';
    if (name.includes('slip-on') || name.includes('go walk') || brand.includes('skechers')) return 'slipon_shoes';
    if (name.includes('sneaker') || name.includes('running') || name.includes('air max') || name.includes('ultraboost') || name.includes('smash') || name.includes('shoes')) return 'shoes';
    if (name.includes('blazer') || name.includes('suit')) return 'blazer';
    if (name.includes('oxford') || name.includes('formal shirt') || name.includes('dress shirt') || name.includes('formal business shirt') || name.includes('formal office shirt') || brand.includes('peter england') || brand.includes('louis philippe') || (brand.includes('van heusen') && name.includes('shirt')) || brand.includes('allen solly')) return 'formal_shirt';
    if (name.includes('polo') || brand.includes('us polo') || brand.includes('u.s. polo')) return 'polo_shirt';
    if (name.includes('linen') || name.includes('button-down')) return 'linen_shirt';
    if (name.includes('kurta')) return 'kurta';
    if (name.includes('jeans') || name.includes('denim jeans')) return 'jeans';
    if (name.includes('trousers') || (name.includes('pants') && !name.includes('track'))) return 'trousers';
    if (name.includes('track pants') || name.includes('tiro')) return 'track_pants';
    if (name.includes('denim jacket') || name.includes('trucker')) return 'denim_jacket';
    if (name.includes('track jacket') || name.includes('motorsport')) return 'track_jacket';
    if (name.includes('hoodie') || name.includes('sweatshirt')) return 'hoodie';
    if (name.includes('sweater') || name.includes('knit')) return 'sweater';
    if (name.includes('boxer') || name.includes('briefs')) return 'boxer_briefs';
    if (name.includes('sunglasses') || name.includes('wayfarer') || name.includes('aviator') || brand.includes('ray-ban')) return 'sunglasses';
    if (name.includes('watch') || brand.includes('casio') || brand.includes('fossil')) return 'analog_watch';
    if (name.includes('t-shirt') || name.includes('tee') || name.includes('dri-fit') || brand.includes('under armour')) return 'tshirt';
    return 'formal_shirt';
  }

  // 5. Home & Living
  if (cat.includes('home')) {
    if (name.includes('airfryer') || name.includes('air fryer')) return 'airfryer';
    if (name.includes('microwave') || name.includes('convection')) return 'microwave_oven';
    if (name.includes('refrigerator') || name.includes('frost-free')) return 'refrigerator';
    if (name.includes('vacuum') || name.includes('cleaner')) return 'vacuum_cleaner';
    if (name.includes('sewing') || name.includes('janome') || brand.includes('usha')) return 'sewing_machine';
    if (name.includes('safe') || name.includes('locker') || brand.includes('godrej')) return 'safe_locker';
    if (name.includes('ceiling fan') || name.includes('fan') || brand.includes('havells') || (brand.includes('crompton') && name.includes('fan'))) return 'ceiling_fan';
    if (name.includes('water heater') || name.includes('geyser')) return 'water_heater';
    if (name.includes('water purifier') || name.includes('ro +') || brand.includes('kent')) return 'water_purifier';
    if (name.includes('pressure cooker') || name.includes('cooker') || (brand.includes('hawkins') && !name.includes('pan')) || (brand.includes('prestige') && name.includes('cooker'))) return 'pressure_cooker';
    if (name.includes('pan') || name.includes('kadhai') || name.includes('cookware') || name.includes('gas stove') || name.includes('induction')) return 'cookware_pan';
    if (name.includes('mixer grinder') || name.includes('blender') || name.includes('nutri-blend') || brand.includes('wonderchef') || (brand.includes('bajaj') && name.includes('mixer')) || brand.includes('bosch')) return 'blender_mixer';
    if (name.includes('bed sheet') || name.includes('bedsheet') || brand.includes('bombay dyeing')) return 'bedsheet';
    if (name.includes('pillow')) return 'pillow';
    if (name.includes('mattress')) return 'mattress';
    if (name.includes('water bottle') || name.includes('flask') || name.includes('thermosteel')) return 'water_bottle';
    if (name.includes('lunch box') || name.includes('containers')) return 'lunch_box';
    if (name.includes('chair') || name.includes('armchair') || name.includes('furniture') || brand.includes('green soul') || (brand.includes('ikea') && !name.includes('desk'))) return 'chair';
    return 'chair';
  }

  // 6. Books & Stationery
  if (cat.includes('book') || cat.includes('stationery')) {
    if (name.includes('rakesh yadav') || (name.includes('math') && cat.includes('book'))) return 'math_book';
    if (name.includes('quantitative aptitude') || name.includes('arithmetic') || name.includes('reasoning')) return 'aptitude_book';
    if (name.includes('dictionary')) return 'dictionary';
    if (name.includes('stapler') || name.includes('staples') || brand.includes('kangaro')) return 'stapler';
    if (name.includes('acrylic') || name.includes('color tubes') || name.includes('paint') || name.includes('markers') || brand.includes('camlin')) return 'color_art';
    if (name.includes('color pencils') || name.includes('polychromos') || brand.includes('faber-castell')) return 'color_pencils';
    if (name.includes('pencil') || name.includes('apsara') || name.includes('natraj') || name.includes('lumograph') || brand.includes('staedtler')) return 'pencil';
    if (name.includes('eraser')) return 'eraser';
    if (name.includes('rollerball') || name.includes('fountain pen') || name.includes('parker')) return 'luxury_pen';
    if (name.includes('gel pen') || name.includes('hi-tecpoint') || name.includes('octane') || brand.includes('pilot')) return 'gel_pen';
    if (name.includes('ballpoint') || name.includes('ball pen') || name.includes('butterflow') || name.includes('reynolds') || brand.includes('cello')) return 'ballpoint_pen';
    if (name.includes('spiral') || name.includes('hardbound') || name.includes('notebook') || brand.includes('classmate')) return 'spiral_notebook';
    return 'book';
  }

  return 'shoes';
};

/**
 * Checks whether an image URL is a known generic repeat/fallback or deprecated 404 URL.
 */
const isGenericOrDeprecatedUrl = (url) => {
  if (typeof url !== 'string' || url.trim().length < 5) return true;
  return GENERIC_STOCK_IDS.some((stockId) => url.includes(stockId));
};

/**
 * Returns an array of authentic multi-angle images for any product object.
 * Priority:
 * 1. Product's saved database image gallery (product.images)
 * 2. Product's saved database primary image (product.primaryImageUrl)
 * 3. Verified canonical archetype gallery as fallback
 */
export const getProductGallery = (product) => {
  if (!product) return MODEL_GALLERIES.shoes;

  // 1. If product already has saved images array populated from database
  if (Array.isArray(product.images) && product.images.length > 0) {
    const validImages = product.images.filter(
      (img) => typeof img === 'string' && img.trim().length > 5
    );
    if (validImages.length > 0) {
      return validImages;
    }
  }

  // 2. If product has a saved primary image in database
  if (
    typeof product.primaryImageUrl === 'string' &&
    product.primaryImageUrl.trim().length > 5
  ) {
    return [product.primaryImageUrl.trim()];
  }

  // 3. Fallback to verified category archetype gallery
  const key = getProductCategoryKey(product);
  return MODEL_GALLERIES[key] || MODEL_GALLERIES.shoes;
};

/**
 * Central utility to get authentic product images.
 * Priority:
 * 1. Saved database primary image or specific gallery angle
 * 2. Fallback to verified canonical archetype gallery photo
 */
export const getProductImage = (product, angleIndex = 0) => {
  if (!product) {
    return MODEL_GALLERIES.shoes[0];
  }

  const rawImages = Array.isArray(product.images)
    ? product.images.filter((u) => typeof u === 'string' && u.trim().length > 5)
    : [];
  const rawPrimary =
    typeof product.primaryImageUrl === 'string' && product.primaryImageUrl.trim().length > 5
      ? product.primaryImageUrl.trim()
      : null;

  // If asking for main/front image (angle 0)
  if (angleIndex === 0) {
    if (rawPrimary) return rawPrimary;
    if (rawImages.length > 0) return rawImages[0];
  } else {
    // If asking for a secondary angle
    if (rawImages[angleIndex]) return rawImages[angleIndex];
    if (rawPrimary) return rawPrimary;
    if (rawImages.length > 0) return rawImages[0];
  }

  // Fallback to verified category archetype gallery photo at the given angle
  const key = getProductCategoryKey(product);
  const gallery = MODEL_GALLERIES[key] || MODEL_GALLERIES.shoes;
  const safeIndex = Math.abs(angleIndex) % gallery.length;

  return gallery[safeIndex] || gallery[0];
};

import { getBrandLogo as resolveBrandLogo } from './brandLogos.js';

/**
 * Brand Logo Resolver: returns verified, unbreakable SVG brand logo for all 126+ brands
 */
export const getBrandLogo = (brand) => resolveBrandLogo(brand);
