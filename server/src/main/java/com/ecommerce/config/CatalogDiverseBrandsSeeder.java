package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
public class CatalogDiverseBrandsSeeder {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public static class BrandProductItem {
        public String categorySlug;
        public String brandName;
        public String brandSlug;
        public String brandLogo;
        public String brandDesc;
        public String productName;
        public String productSlug;
        public String sku;
        public double price;
        public int discount;
        public int stock;
        public double rating;
        public int reviewCount;
        public String shortDesc;
        public String fullDesc;
        public String specsJson;
        public String[] images;

        public BrandProductItem(String categorySlug, String brandName, String brandSlug, String brandLogo, String brandDesc,
                                String productName, String productSlug, String sku, double price, int discount, int stock,
                                double rating, int reviewCount, String shortDesc, String fullDesc, String specsJson, String[] images) {
            this.categorySlug = categorySlug;
            this.brandName = brandName;
            this.brandSlug = brandSlug;
            this.brandLogo = brandLogo;
            this.brandDesc = brandDesc;
            this.productName = productName;
            this.productSlug = productSlug;
            this.sku = sku;
            this.price = price;
            this.discount = discount;
            this.stock = stock;
            this.rating = rating;
            this.reviewCount = reviewCount;
            this.shortDesc = shortDesc;
            this.fullDesc = fullDesc;
            this.specsJson = specsJson;
            this.images = images;
        }
    }

    private final List<BrandProductItem> catalogItems = Arrays.asList(
            // ==========================================
            // 1. ELECTRONICS (21 Distinct Brands)
            // ==========================================
            new BrandProductItem("electronics", "Apple", "apple", "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", "Think Different. Premium consumer electronics.",
                    "Apple iPhone 15 Pro Max 256GB - Natural Titanium", "apple-iphone-15-pro-max", "ELEC-APPL-01",
                    149900, 8, 45, 4.9, 210, "Forged in aerospace-grade titanium with A17 Pro chip and 48MP Pro camera system.",
                    "Experience next-generation performance with the Apple iPhone 15 Pro Max. Features a strong, lightweight titanium design, customizable Action button, and 5x optical zoom camera.",
                    "{\"Display\":\"6.7-inch Super Retina XDR OLED\",\"Processor\":\"Apple A17 Pro\",\"Storage\":\"256GB\",\"Camera\":\"48MP + 12MP + 12MP\"}",
                    new String[]{"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Samsung", "samsung", "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", "Do what you can't. Global technology leader.",
                    "Samsung Galaxy S24 Ultra 5G AI Smartphone 512GB", "samsung-galaxy-s24-ultra", "ELEC-SAMS-01",
                    134999, 10, 35, 4.8, 185, "Galaxy AI flagship with 200MP camera, Snapdragon 8 Gen 3 and built-in S Pen.",
                    "Galaxy AI is here. Search effortlessly with Circle to Search, get real-time call translation, and capture breathtaking detail with 200MP Quad Telephoto camera.",
                    "{\"Display\":\"6.8-inch Dynamic AMOLED 2X 120Hz\",\"Processor\":\"Snapdragon 8 Gen 3\",\"RAM\":\"12GB\",\"Storage\":\"512GB\"}",
                    new String[]{"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Sony", "sony", "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg", "Be Moved. High fidelity audio and visuals.",
                    "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones", "sony-wh-1000xm5-headphones", "ELEC-SONY-01",
                    29990, 15, 60, 4.7, 142, "Industry-leading noise cancellation with dual processors and 8 microphones.",
                    "The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Auto NC Optimizer continuously adapts to your environment while 30-hour battery keeps music playing.",
                    "{\"Battery Life\":\"30 Hours\",\"Bluetooth\":\"v5.2 LDAC\",\"Weight\":\"250g\",\"Noise Cancellation\":\"HD Processor QN1\"}",
                    new String[]{"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Dell", "dell", "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg", "Powering enterprise and personal computing.",
                    "Dell XPS 15 Intel Core i9 32GB RAM 1TB SSD RTX 4070", "dell-xps-15-oled-laptop", "ELEC-DELL-01",
                    219900, 12, 18, 4.9, 96, "Unmatched power with stunning 3.5K OLED InfinityEdge touch display.",
                    "Crafted with machined aluminum and carbon fiber palm rest. 13th Gen Intel Core i9 processor and NVIDIA GeForce RTX 4070 graphics make it a powerhouse for creators.",
                    "{\"Display\":\"15.6-inch 3.5K OLED Touch\",\"CPU\":\"Intel Core i9-13900H\",\"RAM\":\"32GB DDR5\",\"Storage\":\"1TB NVMe SSD\"}",
                    new String[]{"https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "HP", "hp", "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg", "Keep Reinventing. Innovative PC hardware.",
                    "HP Spectre x360 2-in-1 OLED Convertible Laptop (Intel Core Ultra 7)", "hp-spectre-x360-oled", "ELEC-HP01-01",
                    154990, 10, 24, 4.7, 78, "Flagship AI-enhanced 2-in-1 laptop with 2.8K OLED display and stylus pen.",
                    "Immerse in pure brilliance with the HP Spectre x360. 14-inch 120Hz OLED screen, AI-assisted 9MP camera, and Intel Evo platform for all-day battery efficiency.",
                    "{\"Display\":\"14-inch 2.8K OLED Touch 120Hz\",\"CPU\":\"Intel Core Ultra 7 155H\",\"RAM\":\"16GB LPDDR5X\",\"Storage\":\"1TB SSD\"}",
                    new String[]{"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Lenovo", "lenovo", "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg", "Smarter technology for all.",
                    "Lenovo ThinkPad X1 Carbon Gen 11 Ultralight Business Laptop", "lenovo-thinkpad-x1-carbon-gen11", "ELEC-LENO-01",
                    168000, 14, 20, 4.8, 85, "Military-grade carbon fiber chassis with iconic Ergonomic TrackPoint keyboard.",
                    "The gold standard in enterprise laptops. Tested against 12 MIL-STD 810H standards with deep security features, sub-1.12kg weight, and Dolby Atmos audio.",
                    "{\"Display\":\"14-inch 2.8K OLED 400 nits\",\"Processor\":\"Intel Core i7-1365U\",\"RAM\":\"32GB\",\"Weight\":\"1.12 kg\"}",
                    new String[]{"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "ASUS", "asus", "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg", "In Search of Incredible.",
                    "ASUS ROG Zephyrus G14 Gaming Laptop (Ryzen 9, RTX 4070, OLED)", "asus-rog-zephyrus-g14-oled", "ELEC-ASUS-01",
                    174990, 8, 15, 4.9, 112, "Ultraportable gaming beast featuring ROG Nebula OLED 3K 120Hz display.",
                    "Precision-milled CNC aluminum body equipped with AMD Ryzen 9 8945HS and NVIDIA RTX 4070 graphics with custom vapor chamber cooling.",
                    "{\"Display\":\"14-inch 3K OLED 120Hz\",\"CPU\":\"AMD Ryzen 9 8945HS\",\"GPU\":\"RTX 4070 8GB\",\"RAM\":\"32GB LPDDR5X\"}",
                    new String[]{"https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Acer", "acer", "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg", "Explore beyond limits.",
                    "Acer Predator Helios 16 High-Performance Gaming Laptop", "acer-predator-helios-16", "ELEC-ACER-01",
                    144990, 18, 22, 4.6, 64, "16-inch WQXGA 240Hz screen powered by Core i9 and RTX 4080.",
                    "Dual custom 5th Gen AeroBlade 3D fans, liquid metal thermal grease, and per-key RGB backlit keyboard make Helios 16 a championship gaming machine.",
                    "{\"Display\":\"16-inch WQXGA 240Hz IPS\",\"CPU\":\"Intel Core i9-13900HX\",\"GPU\":\"NVIDIA RTX 4080\",\"RAM\":\"16GB DDR5\"}",
                    new String[]{"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "LG", "lg", "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg", "Life's Good. World-class displays and home tech.",
                    "LG C3 55-inch 4K OLED evo Smart TV with Dolby Vision Atmos", "lg-c3-55-inch-oled-evo-tv", "ELEC-LG01-01",
                    114990, 22, 12, 4.9, 134, "Self-lit pixels deliver infinite contrast, 100% color volume, and α9 AI Processor Gen6.",
                    "The benchmark in premium home theater. Features 0.1ms response time, 4 HDMI 2.1 ports for 120Hz 4K gaming, NVIDIA G-Sync, and webOS 23.",
                    "{\"Screen Size\":\"55 Inch\",\"Panel\":\"OLED evo 4K 120Hz\",\"HDR\":\"Dolby Vision / HDR10\",\"Audio\":\"40W 2.2 Channel Dolby Atmos\"}",
                    new String[]{"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "OnePlus", "oneplus", "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1_Line_RGB_red_2020.svg", "Never Settle. Premium performance smartphones.",
                    "OnePlus 12 5G Flagship Smartphone 256GB - Silky Black", "oneplus-12-5g-flagship", "ELEC-OPLU-01",
                    64999, 8, 40, 4.7, 160, "Snapdragon 8 Gen 3 with 4th Gen Hasselblad Camera and 100W SUPERVOOC charging.",
                    "Extreme speed meets exceptional clarity. 2K 120Hz ProXDR display, 5400mAh battery with 50W AIRVOOC wireless charging, and periscope telephoto sensor.",
                    "{\"Display\":\"6.82-inch 2K 120Hz ProXDR\",\"Processor\":\"Snapdragon 8 Gen 3\",\"RAM\":\"12GB\",\"Charging\":\"100W Wired + 50W Wireless\"}",
                    new String[]{"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Xiaomi", "xiaomi", "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg", "Innovation for everyone.",
                    "Xiaomi 14 Ultra 5G Quad 50MP Leica Professional Camera Phone", "xiaomi-14-ultra-leica", "ELEC-XIAO-01",
                    99999, 10, 20, 4.8, 92, "1-inch LYT-900 sensor with stepless variable aperture and Leica Summilux optics.",
                    "Designed like a traditional camera with circular metal bezel and vegan leather back. Capture cinematic Master Cinema 8K video on all 4 focal lengths.",
                    "{\"Camera\":\"50MP 1-inch LYT-900 + 50MP + 50MP + 50MP Leica\",\"Processor\":\"Snapdragon 8 Gen 3\",\"Battery\":\"5000mAh 90W HyperCharge\"}",
                    new String[]{"https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "boAt", "boat", "https://upload.wikimedia.org/wikipedia/commons/b/b3/Boat_logo.png", "Plug into Nirvana. India's #1 earwear brand.",
                    "boAt Airdopes 141 ANC TWS Earbuds with 42H Playtime", "boat-airdopes-141-anc", "ELEC-BOAT-01",
                    1499, 65, 150, 4.4, 450, "Active Noise Cancellation up to 32dB with ENx Quad Mic technology.",
                    "Experience crystal-clear conversations and immersive bass with 10mm drivers, Beast Mode 50ms low latency gaming, and ASAP Charge (10 mins = 150 mins).",
                    "{\"Playtime\":\"42 Hours\",\"ANC\":\"Up to 32dB\",\"Water Resistance\":\"IPX5\",\"Drivers\":\"10mm Dynamic\"}",
                    new String[]{"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "JBL", "jbl", "https://upload.wikimedia.org/wikipedia/commons/a/af/JBL_logo.svg", "Dare to Listen. Legendary JBL Pro Sound.",
                    "JBL Flip 6 Waterproof Portable Bluetooth Speaker with Powerful Bass", "jbl-flip-6-portable-speaker", "ELEC-JBL0-01",
                    9999, 30, 75, 4.8, 220, "2-way speaker system delivering loud, crystal-clear, powerful sound.",
                    "Racetrack-shaped woofer delivers exceptional low frequencies, while a separate tweeter produces crisp highs. IP67 waterproof and dustproof with 12 hours playtime.",
                    "{\"Output\":\"30W RMS\",\"Battery Life\":\"12 Hours\",\"Waterproof\":\"IP67\",\"PartyBoost\":\"Yes\"}",
                    new String[]{"https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Bose", "bose", "https://upload.wikimedia.org/wikipedia/commons/8/86/Bose_logo.svg", "Better Sound Through Research.",
                    "Bose QuietComfort Ultra Wireless Noise Cancelling Headphones", "bose-quietcomfort-ultra", "ELEC-BOSE-01",
                    35900, 10, 30, 4.9, 140, "World-class spatial audio with Bose Immersive Audio and CustomTune technology.",
                    "Breakthrough spatialized audio places sound right in front of you. Luxurious protein leather cushions and Quiet, Aware, and Immersion listening modes.",
                    "{\"Battery Life\":\"24 Hours\",\"Spatial Audio\":\"Bose Immersive Audio\",\"Bluetooth\":\"v5.3 Multipoint\",\"Weight\":\"252g\"}",
                    new String[]{"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Logitech", "logitech", "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg", "Defy Logic. Productivity and gaming peripherals.",
                    "Logitech MX Master 3S Advanced Ergonomic Wireless Mouse", "logitech-mx-master-3s-mouse", "ELEC-LOGI-01",
                    9495, 15, 65, 4.9, 310, "Quiet clicks with 8K DPI any-surface glass tracking and MagSpeed electromagnetic scroll.",
                    "Feel every moment of your workflow with even more precision and tactile feedback. MagSpeed wheel scrolls 1,000 lines a second in near silence.",
                    "{\"DPI\":\"200 to 8000 DPI (Tracks on glass)\",\"Battery\":\"Up to 70 days\",\"Connectivity\":\"Bluetooth + Logi Bolt\",\"Buttons\":\"7 Customisable\"}",
                    new String[]{"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Canon", "canon", "https://upload.wikimedia.org/wikipedia/commons/0/05/Canon_wordmark.svg", "Delighting You Always. Photography leadership.",
                    "Canon EOS R50 Mirrorless Camera with RF-S 18-45mm STM Lens Kit", "canon-eos-r50-mirrorless", "ELEC-CANO-01",
                    62990, 12, 18, 4.7, 88, "Compact creator camera with 24.2MP APS-C sensor, Dual Pixel CMOS AF II, and 4K 30p.",
                    "Lightweight mirrorless camera engineered for content creators. Features vari-angle touch screen, deep learning subject tracking, and vertical video mode.",
                    "{\"Sensor\":\"24.2MP APS-C CMOS\",\"Video\":\"4K 30p Uncropped Over-sampled\",\"Autofocus\":\"Dual Pixel CMOS AF II\",\"Mount\":\"Canon RF\"}",
                    new String[]{"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1502982720700-bfff97f2da8d?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Nikon", "nikon", "https://upload.wikimedia.org/wikipedia/commons/0/00/Nikon_Logo.svg", "At the heart of the image.",
                    "Nikon Z50 DX-Format Mirrorless Camera with 16-50mm VR Lens", "nikon-z50-dx-mirrorless", "ELEC-NIKO-01",
                    69990, 10, 15, 4.8, 56, "20.9MP DX sensor with ultra-wide Z mount for breathtaking low-light photos and 4K.",
                    "Tough, lightweight magnesium alloy body with weather sealing. 209-point hybrid AF with Eye-Detection AF keeps your subjects tack-sharp.",
                    "{\"Sensor\":\"20.9MP CMOS DX\",\"ISO\":\"100-51200\",\"Burst Rate\":\"11 fps\",\"Lens\":\"NIKKOR Z DX 16-50mm f/3.5-6.3 VR\"}",
                    new String[]{"https://images.unsplash.com/photo-1502982720700-bfff97f2da8d?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Noise", "noise", "https://upload.wikimedia.org/wikipedia/commons/8/87/Noise_Brand_Logo.png", "Listen to the noise within.",
                    "Noise ColorFit Pro 5 Max AMOLED Bluetooth Calling Smartwatch", "noise-colorfit-pro-5-max", "ELEC-NOIS-01",
                    3999, 60, 120, 4.5, 340, "1.96-inch AMOLED display with post-training recovery rate and SOS calling.",
                    "Track stress, SpO2, sleep stages, and heart rate with accuracy. Features functional digital crown, 100+ sports modes, and up to 7-day battery life.",
                    "{\"Display\":\"1.96-inch AMOLED 600 nits\",\"Battery\":\"Up to 7 Days\",\"Calling\":\"Bluetooth Single-chip TruSync\",\"Rating\":\"IP68\"}",
                    new String[]{"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Realme", "realme", "https://upload.wikimedia.org/wikipedia/commons/a/a2/Realme_logo.svg", "Dare to Leap.",
                    "Realme GT 6 5G Flagship AI Smartphone (Snapdragon 8s Gen 3)", "realme-gt-6-flagship", "ELEC-REAL-01",
                    40999, 12, 35, 4.6, 120, "6000-nit ultra-bright display with Sony LYT-808 OIS camera and 120W fast charging.",
                    "Top-tier performance meets flagship aesthetics with nano-mirror finish, Dual VC cooling architecture, and NextAI smart editing capabilities.",
                    "{\"Display\":\"6.78-inch 1.5K 8T LTPO 6000 nits\",\"Processor\":\"Snapdragon 8s Gen 3\",\"Camera\":\"50MP Sony LYT-808 OIS\",\"Charging\":\"120W SUPERVOOC\"}",
                    new String[]{"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Motorola", "motorola", "https://upload.wikimedia.org/wikipedia/commons/e/e5/Motorola_new_logo.svg", "Hello Moto. Legendary communication innovation.",
                    "Motorola Edge 50 Ultra 5G Pantone Curated Wood & Vegan Leather Edition", "motorola-edge-50-ultra", "ELEC-MOTO-01",
                    59999, 8, 25, 4.7, 95, "World's first Pantone validated camera and display with 144Hz pOLED screen.",
                    "Infused with real wood finish and IP68 underwater protection. 125W TurboPower charging gets you back in action in just 10 minutes.",
                    "{\"Display\":\"6.7-inch 144Hz Super HD pOLED\",\"Processor\":\"Snapdragon 8s Gen 3\",\"Camera\":\"50MP Main + 50MP UW + 64MP 3x Telephoto\",\"IP Rating\":\"IP68\"}",
                    new String[]{"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("electronics", "Google", "google-hardware", "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", "Helpful technology built with Google AI.",
                    "Google Pixel 8 Pro 5G with Gemini Nano AI & Magic Editor", "google-pixel-8-pro", "ELEC-GOOG-01",
                    106999, 10, 20, 4.8, 140, "Google Tensor G3 chip powers generative photo tools, Best Take, and 7 years of OS updates.",
                    "The pinnacle of mobile photography. 50MP main sensor captures lifelike color and details, while Audio Magic Eraser removes background distractions from videos.",
                    "{\"Display\":\"6.7-inch Super Actua OLED 1-120Hz\",\"Processor\":\"Google Tensor G3\",\"Camera\":\"50MP + 48MP UW + 48MP 5x Telephoto\",\"OS\":\"Android with 7 Years Updates\"}",
                    new String[]{"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"}),

            // ==========================================
            // 2. FASHION & APPAREL (21 Distinct Brands)
            // ==========================================
            new BrandProductItem("fashion", "Nike", "nike", "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", "Just Do It. Athletic footwear and apparel.",
                    "Nike Air Max 270 Men's Athletic Running Shoes", "nike-air-max-270-shoes", "FASH-NIKE-01",
                    11995, 20, 80, 4.6, 210, "Nike's biggest heel Air unit delivers super-soft bounce with modern street style.",
                    "Draws inspiration from iconic Air Max models, showcasing visible air cushioning and engineered mesh upper for all-day street comfort.",
                    "{\"Upper\":\"Engineered Mesh\",\"Sole\":\"Dual-Density Foam + Max Air 270 Heel\",\"Closure\":\"Lace-up\"}",
                    new String[]{"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Adidas", "adidas", "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", "Impossible Is Nothing. Iconic sportswear.",
                    "Adidas Ultraboost Light High-Performance Road Running Shoes", "adidas-ultraboost-light", "FASH-ADID-01",
                    14999, 25, 60, 4.8, 175, "Lightest Ultraboost yet with 30% lighter Boost material and Continental rubber.",
                    "Experience epic energy in every stride. Primeknit+ upper hugs the foot with tailored support while Linear Energy Push system increases responsiveness.",
                    "{\"Midsole\":\"Light BOOST Foam\",\"Outsole\":\"Continental Natural Rubber\",\"Upper\":\"Primeknit+ Textile\"}",
                    new String[]{"https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Puma", "puma", "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg", "Forever Faster. Sport and street lifestyle.",
                    "Puma Smash v2 Men's Soft Leather Casual Sneakers", "puma-smash-v2-leather", "FASH-PUMA-01",
                    3499, 45, 90, 4.5, 310, "Timeless tennis-inspired silhouette with clean leather upper and SoftFoam+ comfort.",
                    "Keep your everyday style crisp and sporty with durable rubber cupsole and iconic stitched Formstrip branding.",
                    "{\"Material\":\"Genuine Soft Leather\",\"Sockliner\":\"SoftFoam+ Dual Density\",\"Outsole\":\"Non-marking Rubber\"}",
                    new String[]{"https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Levi's", "levis", "https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg", "Quality Never Goes Out of Style. Original denim.",
                    "Levi's 511 Slim Fit Stretch Denim Jeans (Dark Indigo)", "levis-511-slim-fit-jeans", "FASH-LEVI-01",
                    3999, 30, 85, 4.7, 240, "Modern slim-cut denim with extra room to move and authentic copper rivets.",
                    "A modern slim with room to move. Added stretch keeps you comfortable all day without losing its original structured shape.",
                    "{\"Material\":\"99% Cotton, 1% Elastane\",\"Fit\":\"Slim from hip to ankle\",\"Rise\":\"Mid Rise\",\"Fly\":\"Zip Fly\"}",
                    new String[]{"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Zara", "zara", "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", "Contemporary global high-street fashion.",
                    "Zara Textured Knit Relaxed Crewneck Cotton Sweater", "zara-textured-knit-sweater", "FASH-ZARA-01",
                    2990, 20, 50, 4.6, 90, "Breathable textured waffle knit crafted from 100% sustainable combed cotton.",
                    "Effortless European minimalist aesthetic. Features dropped shoulders, ribbed trim, and a relaxed boxy silhouette suitable for layering.",
                    "{\"Material\":\"100% Cotton Waffle Knit\",\"Neckline\":\"Ribbed Crewneck\",\"Care\":\"Machine wash cold\"}",
                    new String[]{"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "H&M", "hm", "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg", "Fashion and quality at the best price.",
                    "H&M Regular Fit Pure Linen Long Sleeve Casual Shirt", "hm-regular-fit-linen-shirt", "FASH-HM01-01",
                    2299, 25, 70, 4.4, 130, "Airy woven pure linen shirt with turn-down collar and mother-of-pearl buttons.",
                    "Linen is naturally temperature-regulating and gets softer with every wash. Perfect for tropical climates, beach holidays, and smart-casual evenings.",
                    "{\"Material\":\"100% Linen\",\"Fit\":\"Regular Fit\",\"Pattern\":\"Solid Neutral Beige\"}",
                    new String[]{"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Under Armour", "under-armour", "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg", "I Will. High performance technical athletic wear.",
                    "Under Armour UA Tech 2.0 Short-Sleeve Athletic Training Tee", "under-armour-tech-2-tee", "FASH-UARM-01",
                    1999, 20, 95, 4.7, 180, "Quick-drying, ultra-soft UA Tech fabric with anti-odor technology.",
                    "Under Armour's original go-to training gear: loose, light, and keeps you cool. Sweat-wicking material pulls perspiration away from the skin instantly.",
                    "{\"Material\":\"100% Polyester UA Tech\",\"Fit\":\"Streamlined Loose Fit\",\"Technology\":\"Moisture Transport System\"}",
                    new String[]{"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Tommy Hilfiger", "tommy-hilfiger", "https://upload.wikimedia.org/wikipedia/commons/2/24/Tommy_Hilfiger_logo.svg", "Classic American Cool.",
                    "Tommy Hilfiger Custom Fit Embroidered Oxford Cotton Shirt", "tommy-hilfiger-oxford-shirt", "FASH-THIL-01",
                    5999, 30, 40, 4.8, 85, "Iconic button-down collar Oxford shirt with signature chest flag embroidery.",
                    "Crafted from 100% organic cotton for a premium substantial feel. Designed with a custom fit that offers clean contours through the chest and waist.",
                    "{\"Material\":\"100% Organic Oxford Cotton\",\"Cuffs\":\"Adjustable Button Cuffs\",\"Pattern\":\"Classic Light Blue\"}",
                    new String[]{"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Calvin Klein", "calvin-klein", "https://upload.wikimedia.org/wikipedia/commons/e/ed/Calvin_Klein_logo.svg", "Minimalist modern American designer lifestyle.",
                    "Calvin Klein Men's Cotton Stretch Boxer Briefs (Pack of 3)", "calvin-klein-boxer-briefs-pack3", "FASH-CKLE-01",
                    2999, 15, 60, 4.9, 210, "Ultra-soft cotton blend with flexible elastane and iconic repeat logo waistband.",
                    "Defined by the classic Calvin Klein elasticated band, contoured pouch for support, and smooth flatlock seams that eliminate chafing.",
                    "{\"Material\":\"95% Cotton, 5% Elastane\",\"Waistband\":\"Logo Jacquard Elastic\",\"Pack Size\":\"3 Boxer Briefs\"}",
                    new String[]{"https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Allen Solly", "allen-solly", "https://upload.wikimedia.org/wikipedia/commons/1/1a/Allen_Solly_logo.png", "Friday Dressing. Smart casual and formal fashion.",
                    "Allen Solly Men's Slim Fit Easy-Care Formal Business Shirt", "allen-solly-formal-business-shirt", "FASH-ASOL-01",
                    1799, 35, 80, 4.4, 150, "Wrinkle-resistant cotton blend shirt designed for 9-to-5 workday elegance.",
                    "Features stiffened spread collar, semi-cutaway cuffs, and micro-geometric weave pattern that stays sharp throughout long executive meetings.",
                    "{\"Material\":\"60% Cotton, 40% Polyester\",\"Collar\":\"Spread Collar\",\"Fit\":\"Slim Formal Fit\"}",
                    new String[]{"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Van Heusen", "van-heusen", "https://upload.wikimedia.org/wikipedia/commons/0/07/Van_Heusen_Logo.png", "Power Dressing for the Modern Professional.",
                    "Van Heusen Ultra-Soft 4-Way Stretch Business Formal Trousers", "van-heusen-stretch-formal-trousers", "FASH-VHEU-01",
                    2299, 30, 75, 4.6, 110, "Tailored flat-front dress pants with flexi-waistband for maximum seated comfort.",
                    "Engineered with shape retention fibers and Teflon fabric protector that resists minor spills and stains during business dinners.",
                    "{\"Material\":\"Poly-Viscose Stretch Blend\",\"Front\":\"Flat Front\",\"Pockets\":\"4 Ergonomic Pockets\"}",
                    new String[]{"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Peter England", "peter-england", "https://upload.wikimedia.org/wikipedia/commons/8/87/Peter_England_logo.png", "India's largest menswear brand.",
                    "Peter England Non-Iron Pure Cotton Executive Formal Shirt", "peter-england-non-iron-formal-shirt", "FASH-PENG-01",
                    1499, 25, 90, 4.5, 190, "100% long-staple cotton with baked-in wrinkle recovery finish.",
                    "Wash, hang, and wear. Taped seams prevent puckering at armholes and side seams, giving you a crisp freshly-ironed appearance always.",
                    "{\"Material\":\"100% Combed Cotton\",\"Finish\":\"Non-Iron Liquid Ammonia Treated\",\"Pattern\":\"Subtle Twill Weave\"}",
                    new String[]{"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Louis Philippe", "louis-philippe", "https://upload.wikimedia.org/wikipedia/commons/b/b3/Louis_Philippe_logo.png", "The Upper Crest. Luxury gentlemen's tailoring.",
                    "Louis Philippe Classic Italian Wool Single-Breasted Blazer", "louis-philippe-italian-wool-blazer", "FASH-LPHI-01",
                    9999, 20, 25, 4.9, 70, "Super 120s Australian merino wool tailored blazer with horn buttons and silk lining.",
                    "Uncompromising sophistication. Peak lapels, double back vents, and half-canvas construction that drapes naturally across the shoulders.",
                    "{\"Fabric\":\"Super 120s Merino Wool Blend\",\"Lining\":\"Bemberg Silk Blend\",\"Buttons\":\"Handcrafted Natural Horn\"}",
                    new String[]{"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Ray-Ban", "ray-ban", "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ray-Ban_logo.svg", "Genuine Since 1937. Iconic eyewear.",
                    "Ray-Ban Classic Aviator Gradient Polarized Sunglasses (Gold Frame)", "ray-ban-classic-aviator-gold", "FASH-RBAN-01",
                    9890, 10, 35, 4.9, 280, "Classic teardrop aviator with crystal green G-15 polarized anti-glare lenses.",
                    "Originally created for US aviators in 1937. Provides 100% UV protection, visual clarity, and timeless elegance with lightweight steel frames.",
                    "{\"Lens Width\":\"58 mm\",\"Bridge\":\"14 mm\",\"Temple\":\"135 mm\",\"Lens\":\"Crystal Polarized G-15\"}",
                    new String[]{"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Fossil", "fossil", "https://upload.wikimedia.org/wikipedia/commons/7/77/Fossil_Group_logo.svg", "Timeless vintage American horology.",
                    "Fossil Grant Chronograph Roman Dial Genuine Leather Watch", "fossil-grant-chronograph-leather-watch", "FASH-FOSS-01",
                    12495, 30, 45, 4.7, 160, "Classic Roman numerals with 3-eye stopwatch chronograph subdials and rich brown leather.",
                    "Model inspired by vintage clocks with deep blue sunray dial, stainless steel 44mm case, and interchangeable 22mm genuine leather strap.",
                    "{\"Case Size\":\"44 mm\",\"Movement\":\"Quartz Chronograph\",\"Water Resistance\":\"50m (5 ATM)\",\"Strap\":\"22mm Leather\"}",
                    new String[]{"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Casio", "casio", "https://upload.wikimedia.org/wikipedia/commons/2/29/Casio_logo.svg", "Creativity and Contribution. Japanese precision.",
                    "Casio Vintage Digital Illuminator Stainless Steel Watch (A168WA)", "casio-vintage-digital-a168wa", "FASH-CASI-01",
                    2695, 10, 80, 4.8, 380, "Iconic retro gold/silver electro-luminescent backlight digital watch.",
                    "The legendary digital timepiece with 1/100-second stopwatch, daily alarm, hourly time signal, auto calendar, and 7-year battery life.",
                    "{\"Case\":\"Chrome Plated Resin\",\"Band\":\"Stainless Steel Adjustable\",\"Water Resistant\":\"Yes\",\"Battery Life\":\"7 Years\"}",
                    new String[]{"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Woodland", "woodland", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Woodland_Company_Logo.jpg", "Explore More. Tough outdoor adventure footwear.",
                    "Woodland Oiled Nubuck High-Traction Leather Trekking Boots", "woodland-oiled-nubuck-trekking-boots", "FASH-WOOD-01",
                    4995, 20, 50, 4.7, 190, "Heavy-duty full-grain nubuck leather boots with deep lug rubber traction outsole.",
                    "Engineered for rugged terrain and mountain trails. Padded collar protects ankles while shock-absorbing midsole cushions rocky impacts.",
                    "{\"Upper\":\"Full Grain Nubuck Leather\",\"Sole\":\"Deep-Tread Rubber Lug Outsole\",\"Ankle Support\":\"High Padded Collar\"}",
                    new String[]{"https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Skechers", "skechers", "https://upload.wikimedia.org/wikipedia/commons/b/b3/Skechers_logo.svg", "Comfort Technology Company.",
                    "Skechers Go Walk Max Slip-On Walking Shoes with Air Cooled Goga Mat", "skechers-go-walk-max-slipon", "FASH-SKE0-01",
                    4299, 25, 75, 4.8, 260, "Ultra-cushioned slip-on shoe with 5GEN shock absorbing sole and high-rebound insole.",
                    "Walk with supreme ease. Mesh fabric upper stretches with your foot for nearly weightless comfort from morning walks to travel days.",
                    "{\"Insole\":\"Goga Max High-Rebound\",\"Midsole\":\"5GEN Proprietary Cushioning\",\"Upper\":\"Breathable Knit Mesh\"}",
                    new String[]{"https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "US Polo Assn", "us-polo-assn", "https://upload.wikimedia.org/wikipedia/commons/8/87/US_Polo_Assn_Logo.png", "Live Authentically. Official polo heritage.",
                    "U.S. Polo Assn. Men's Pique Cotton Embroidered Polo T-Shirt", "us-polo-assn-pique-polo-tshirt", "FASH-USPA-01",
                    1699, 40, 95, 4.5, 230, "Classic 2-button placket polo shirt crafted from 100% breathable honeycomb pique cotton.",
                    "Features ribbed collar, tennis tail split hem, and signature double horseman crest embroidered on the left chest.",
                    "{\"Material\":\"100% Pique Cotton\",\"Fit\":\"Classic Custom Fit\",\"Collar\":\"Ribbed Polo Collar\"}",
                    new String[]{"https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Jack & Jones", "jack-jones", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Jack_%26_Jones_Logo.svg", "Denim Brotherhood. Urban European youth fashion.",
                    "Jack & Jones Liam Super Stretch Distressed Skinny Fit Jeans", "jack-jones-liam-skinny-jeans", "FASH-JJON-01",
                    2799, 35, 60, 4.4, 140, "Low-rise skinny fit jeans crafted with high-elasticity Super Stretch 50% denim.",
                    "Doesn't sag or bag out. Features manual whisker abrasions, light stonewash, and vintage metal rivets for that authentic rocker look.",
                    "{\"Material\":\"93% Cotton, 5% Elastomultiester, 2% Elastane\",\"Fit\":\"Skinny Fit Liam\",\"Wash\":\"Light Blue Distressed\"}",
                    new String[]{"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("fashion", "Fabindia", "fabindia", "https://upload.wikimedia.org/wikipedia/commons/7/75/Fabindia_logo.png", "Celebrate India. Handwoven ethnic textiles and craft.",
                    "Fabindia Handloom Pure Cotton Long Kurta with Mandarin Collar", "fabindia-handloom-cotton-kurta", "FASH-FABI-01",
                    1990, 15, 65, 4.8, 170, "Handwoven by traditional Indian artisans with natural vegetable dyes and wooden buttons.",
                    "A celebration of authentic Indian craftsmanship. Light, airy, and effortlessly graceful for festivals, weddings, and formal puja ceremonies.",
                    "{\"Material\":\"100% Handspun Cotton\",\"Neck\":\"Mandarin Collar\",\"Sleeve\":\"Full Sleeve with Button Cuffs\"}",
                    new String[]{"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"}),

            // ==========================================
            // 3. HOME & LIVING / APPLIANCES (21 Distinct Brands)
            // ==========================================
            new BrandProductItem("home-living", "IKEA", "ikea", "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg", "Affordable Scandinavian design and home furnishings.",
                    "IKEA POÄNG Armchair with Layered Bentwood Birch Frame & Cushion", "ikea-poang-armchair", "HOME-IKEA-01",
                    7990, 10, 25, 4.8, 310, "Timeless bentwood armchair providing relaxing springiness and high neck support.",
                    "Designed in 1976 and loved worldwide. The bentwood frame follows the contours of the body, providing restorative back and lumbar comfort.",
                    "{\"Frame\":\"Layered Bent Birch Veneer\",\"Upholstery\":\"Removable Washable Cotton Cushion\",\"Max Load\":\"170 kg\"}",
                    new String[]{"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Philips", "philips-home", "https://upload.wikimedia.org/wikipedia/commons/b/b2/Philips_logo.svg", "Innovation and you. Home appliances.",
                    "Philips Essential Digital Airfryer XXL with Rapid Air Technology 6.2L", "philips-essential-digital-airfryer-xxl", "HOME-PHIL-01",
                    12995, 30, 40, 4.9, 260, "Fry, bake, grill, and roast with up to 90% less fat using patented starfish design.",
                    "Cook meals for the entire family in one go. Features 7 preset touch menus, Keep Warm function, and NutriU recipe app integration.",
                    "{\"Capacity\":\"6.2 Litres (1.2 kg)\",\"Power\":\"2000 Watts\",\"Technology\":\"Rapid Air Starfish Base\",\"Dishwasher Safe\":\"Yes\"}",
                    new String[]{"https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Prestige", "prestige", "https://upload.wikimedia.org/wikipedia/commons/4/4b/TTK_Prestige_Logo.png", "Jo biwi se kare pyaar, woh Prestige se kaise kare inkaar.",
                    "Prestige Deluxe Alpha Stainless Steel Pressure Cooker 5L", "prestige-deluxe-alpha-pressure-cooker-5l", "HOME-PRES-01",
                    3150, 20, 60, 4.7, 340, "Heavy-duty sandwich base compatible with both gas stoves and induction cooktops.",
                    "Designed with precision weight valve, controlled gasket release system, and double screw durable handles for decades of safe family cooking.",
                    "{\"Capacity\":\"5.0 Litres\",\"Body\":\"Food-Grade 304 Stainless Steel\",\"Base\":\"Alpha Sandwich Base (Induction + Gas)\"}",
                    new String[]{"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Hawkins", "hawkins", "https://upload.wikimedia.org/wikipedia/commons/8/82/Hawkins_Cookers_Limited_Logo.png", "The brand you can trust for a lifetime.",
                    "Hawkins Contura Hard Anodised Inner Lid Pressure Cooker 3L", "hawkins-contura-hard-anodised-cooker-3l", "HOME-HAWK-01",
                    2175, 15, 80, 4.8, 290, "Hard anodised black body heats faster and doesn't tarnish or react with food.",
                    "Features curved body for easy stirring, pressure-locked safety lid that cannot be opened until pressure drops, and 60-micron durable black finish.",
                    "{\"Capacity\":\"3.0 Litres\",\"Material\":\"Hard Anodised Aluminium\",\"Lid\":\"Inner-Fitting Safety Lid\",\"Warranty\":\"5 Years\"}",
                    new String[]{"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Bajaj", "bajaj-appliances", "https://upload.wikimedia.org/wikipedia/commons/6/6c/Bajaj_Electricals_Logo.svg", "Inspiring Trust. Everyday Indian home solutions.",
                    "Bajaj Rex 500W Mixer Grinder with 3 Stainless Steel Jars", "bajaj-rex-500w-mixer-grinder", "HOME-BAJA-01",
                    2399, 35, 70, 4.5, 410, "500-watt titanium motor with Nutri-Pro feature for nutrient-rich chutney and spices.",
                    "Comes with 1.2L liquidizing jar, 0.8L dry grinding jar, and 0.3L chutney jar. Features 3-speed control with incher and overload protection.",
                    "{\"Motor\":\"500 Watts 100% Copper\",\"Jars\":\"3 Stainless Steel Jars\",\"Speed\":\"3 Speed with Pulse\",\"Warranty\":\"1 Year\"}",
                    new String[]{"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Havells", "havells", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Havells_Logo.svg", "Making a difference. Premier electricals.",
                    "Havells Stealth Air BLDC Ceiling Fan with Remote (1200mm, Espresso)", "havells-stealth-air-bldc-fan", "HOME-HAVE-01",
                    7490, 25, 45, 4.8, 160, "Whisper-quiet aerodynamic blades powered by 5-star energy saving BLDC motor.",
                    "Saves up to 60% electricity compared to regular induction fans. Operates smoothly even on low voltage with timer mode and reverse rotation.",
                    "{\"Sweep\":\"1200 mm\",\"Motor\":\"26W Eco-Active BLDC\",\"Air Delivery\":\"240 m3/min\",\"Control\":\"RF Remote Control\"}",
                    new String[]{"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Godrej", "godrej-security", "https://upload.wikimedia.org/wikipedia/commons/5/53/Godrej_Logo.svg", "Brighter Living. Pioneer in home security.",
                    "Godrej Security Forte Pro Digital Electronic Locker Safe (15L)", "godrej-forte-pro-digital-safe", "HOME-GODR-01",
                    6999, 20, 30, 4.7, 120, "Motorized dual shoot bolts with digital keypad, USB battery backup, and master key.",
                    "Protect cash, gold jewelry, passports, and documents against theft. Auto-freezes for 3 minutes after 3 consecutive wrong PIN entries.",
                    "{\"Capacity\":\"15 Litres\",\"Locking\":\"Motorized Solid Steel Bolts\",\"Access\":\"4-6 Digit Master PIN + Key\",\"Weight\":\"6.5 kg\"}",
                    new String[]{"https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Bosch", "bosch-home", "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-Logo.svg", "Invented for life. German engineering.",
                    "Bosch TrueMixx Pro 1000W Heavy Duty Mixer Grinder & Blender", "bosch-truemixx-pro-1000w", "HOME-BOSC-01",
                    7999, 22, 35, 4.9, 180, "PoundingBlade technology delivers authentic traditional stone-pounded spice texture.",
                    "All-metal drive coupling with active motor cooling. Handles tough turmeric, idli batter, and dry masala with effortless perfection.",
                    "{\"Power\":\"1000 Watts\",\"Jars\":\"4 Ergonomic Steel Jars with Flow Breakers\",\"Safety\":\"Overload Protector\"}",
                    new String[]{"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "LG Appliances", "lg-appliances", "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg", "Life's Good. Kitchen & home appliances.",
                    "LG 28L Charcoal Convection Microwave Oven with Diet Fry & Tandoor", "lg-28l-charcoal-convection-microwave", "HOME-LGAP-01",
                    19990, 28, 20, 4.8, 140, "Charcoal lighting heater prepares crispy tandoori rotis, barbecues, and oil-free snacks.",
                    "Recreate authentic outdoor tandoori flavours inside your home kitchen. 301 Indian auto-cook menus with stainless steel interior cavity.",
                    "{\"Capacity\":\"28 Litres\",\"Cavity\":\"Stainless Steel Anti-Bacterial\",\"Heater\":\"Charcoal Lighting Heater\",\"Control\":\"Tactile Dial\"}",
                    new String[]{"https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Dyson", "dyson", "https://upload.wikimedia.org/wikipedia/commons/c/c9/Dyson_logo.svg", "Solves the problems others ignore.",
                    "Dyson V11 Absolute Cordless Stick Vacuum Cleaner with LCD Screen", "dyson-v11-absolute-cordless-vacuum", "HOME-DYSO-01",
                    49900, 15, 15, 4.9, 190, "Hyperdymium motor spins at 125,000rpm for twice the suction of any cordless vacuum.",
                    "Intelligently senses and adapts to carpet and hard floors. Dynamic Load Sensor technology optimizes run time up to 60 minutes.",
                    "{\"Suction Power\":\"185 AW\",\"Run Time\":\"Up to 60 Minutes\",\"Filtration\":\"Whole-Machine Advanced HEPA\",\"Weight\":\"3.0 kg\"}",
                    new String[]{"https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Sleepwell", "sleepwell", "https://upload.wikimedia.org/wikipedia/commons/8/87/Sleepwell_logo.png", "The Mattress Experts.",
                    "Sleepwell Dual Pro Orthopedic Profiled Foam Reversible Queen Mattress", "sleepwell-dual-pro-ortho-mattress", "HOME-SLEE-01",
                    14500, 20, 20, 4.7, 130, "Dual firmness technology offering gentle soft comfort on one side and firm orthopedic support on other.",
                    "Engineered with profiled Resitec foam for pressure point relief and air circulation. Treated with Neem Fresche anti-microbial barrier.",
                    "{\"Dimensions\":\"78 x 60 x 6 Inches (Queen)\",\"Support\":\"Profiled Orthopedic HR Foam\",\"Fabric\":\"Soft Knitted Anti-Bacterial\"}",
                    new String[]{"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Wakefit", "wakefit", "https://upload.wikimedia.org/wikipedia/commons/9/91/Wakefit_Logo.png", "Home Solutions for modern Indians.",
                    "Wakefit Sleeping Memory Foam Breathable Ergonomic Bed Pillow (Pack of 2)", "wakefit-memory-foam-pillow-pack2", "HOME-WAKE-01",
                    1899, 35, 80, 4.8, 350, "Moulds to the contour of your neck and spine for zero pressure restful sleep.",
                    "Hypoallergenic memory foam cores encased in removable, machine-washable cotton covers that stay cool throughout the night.",
                    "{\"Material\":\"100% High-Density Memory Foam\",\"Cover\":\"Breathable Premium Knitted Fabric\",\"Pack\":\"2 Pillows\"}",
                    new String[]{"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Green Soul", "green-soul", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&auto=format&fit=crop&q=80", "India's leading ergonomic gaming and work chairs.",
                    "Green Soul Monster Ultimate Multi-Functional Ergonomic Gaming Chair", "green-soul-monster-ultimate-chair", "HOME-GREE-01",
                    17990, 25, 30, 4.8, 220, "Heavy-duty steel skeleton with cold-cured moulded foam and magnetic memory foam headrest.",
                    "Reclines up to 180 degrees with 4D adjustable armrests and Class 4 gas lift tested for up to 140kg body weight.",
                    "{\"Upholstery\":\"Breathable Spandex & PU Leather\",\"Armrests\":\"4D Carbon Textured\",\"Gas Lift\":\"Class 4 Heavy Duty\"}",
                    new String[]{"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Pigeon", "pigeon-stovekraft", "https://upload.wikimedia.org/wikipedia/commons/4/44/Stovekraft_Logo.png", "Celebrating togetherness. Kitchen essentials.",
                    "Pigeon by Stovekraft 4-Burner Toughened Glass Gas Stove (Black)", "pigeon-4-burner-glass-gas-stove", "HOME-PIGE-01",
                    3895, 45, 60, 4.4, 210, "Thermal-resistant toughened black glass cooktop with high-efficiency brass burners.",
                    "Provides high heat output with uniform flame distribution for fast Indian cooking. Includes spill-proof stainless steel trays.",
                    "{\"Burners\":\"4 Tri-Pin Brass Burners\",\"Top\":\"8mm Toughened Black Glass\",\"Ignition\":\"Manual\"}",
                    new String[]{"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Crompton", "crompton", "https://upload.wikimedia.org/wikipedia/commons/8/87/Crompton_Greaves_Consumer_Electricals_Logo.png", "Let's hang out. Trusted Indian electricals.",
                    "Crompton Arno Neo 15-Litre 5-Star Storage Water Heater Geyser", "crompton-arno-neo-15l-geyser", "HOME-CROM-01",
                    6499, 30, 40, 4.6, 175, "Nano Polybond tank coating resists hard water corrosion with 8-bar pressure rating.",
                    "High-rise building compatible. Features magnesium anode rod that prevents limescale buildup and smart energy-saver thermostat.",
                    "{\"Capacity\":\"15 Litres\",\"Pressure\":\"8 Bar (High Rise Compatible)\",\"Energy Rating\":\"5 Star BEE\",\"Heating Element\":\"Copper\"}",
                    new String[]{"https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Kent", "kent-ro", "https://upload.wikimedia.org/wikipedia/commons/8/8e/Kent_RO_Systems_Logo.png", "House of Purity. RO water purifiers.",
                    "Kent Grand Plus Mineral RO + UV + UF + TDS Control Water Purifier (9L)", "kent-grand-plus-ro-water-purifier", "HOME-KENT-01",
                    17500, 20, 35, 4.8, 280, "Zero water wastage technology purifies water while retaining essential minerals.",
                    "Multi-stage purification kills viruses and bacteria. Features in-tank UV disinfection that keeps stored water pure 24 hours a day.",
                    "{\"Purification\":\"RO + UV + UF + TDS Controller\",\"Tank\":\"9 Litres Food Grade ABS\",\"Purification Rate\":\"20 L/hr\"}",
                    new String[]{"https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Usha", "usha", "https://upload.wikimedia.org/wikipedia/commons/1/1b/Usha_International_Logo.png", "Making life better since 1934.",
                    "Usha Janome Dream Stitch Automatic Zig-Zag Electric Sewing Machine", "usha-janome-dream-stitch-sewing-machine", "HOME-USHA-01",
                    9890, 15, 30, 4.7, 130, "7 built-in decorative stitches with 4-step buttonholing and drop feed for embroidery.",
                    "Compact free-arm sewing machine ideal for sewing cuffs and collars. Equipped with sewing light and auto-tripping bobbin winder.",
                    "{\"Stitch Functions\":\"14 Built-In Applications\",\"Speed\":\"550 SPM\",\"Body\":\"Compact Aluminum Die-Cast Frame\"}",
                    new String[]{"https://images.unsplash.com/photo-1528458933221-bc015949d11a?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Wonderchef", "wonderchef", "https://upload.wikimedia.org/wikipedia/commons/8/87/Wonderchef_logo.png", "Cook with Pride. Curated by Chef Sanjeev Kapoor.",
                    "Wonderchef Nutri-blend Compact 400W Bullet Mixer Blender (Black)", "wonderchef-nutri-blend-400w-blender", "HOME-WOND-01",
                    2999, 40, 70, 4.6, 230, "Extracts every micro-nutrient from fruits and greens with 22,000 RPM super-fast motor.",
                    "Includes 2 unbreakable polycarbonate jars with sipper lid to carry smoothies on the go. Surgical steel blades grind whole coffee beans easily.",
                    "{\"Motor\":\"400W 22,000 RPM High Torque\",\"Blades\":\"Laser-Cut Surgical Stainless Steel\",\"Jars\":\"Long Jar (500ml) & Short Jar (300ml)\"}",
                    new String[]{"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Bombay Dyeing", "bombay-dyeing", "https://upload.wikimedia.org/wikipedia/commons/4/48/Bombay_Dyeing_Logo.png", "Since 1879. Luxurious bed and bath linens.",
                    "Bombay Dyeing 100% Pure Cotton 300 Thread Count Double Bedsheet with 2 Pillow Covers", "bombay-dyeing-cotton-double-bedsheet", "HOME-BDYE-01",
                    2499, 30, 85, 4.7, 190, "Silky sateen weave crafted from long-staple combed cotton for cool soothing slumber.",
                    "Colorfast and skin-friendly reactive dyes ensure vibrant floral patterns don't fade even after repeated machine washes.",
                    "{\"Size\":\"Double Bed (274 cm x 274 cm)\",\"Thread Count\":\"300 TC Sateen\",\"Includes\":\"1 Bedsheet + 2 Pillow Covers\"}",
                    new String[]{"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Milton", "milton", "https://upload.wikimedia.org/wikipedia/commons/3/3d/Milton_Homewares_Logo.png", "Kuch Naya Sochte Hain. Smart homeware & flasks.",
                    "Milton Thermosteel Flip Lid Vacuum Insulated Water Flask 1000ml", "milton-thermosteel-flask-1000ml", "HOME-MILT-01",
                    999, 20, 110, 4.8, 380, "Double-walled vacuum insulation keeps liquids steaming hot or ice cold for 24 hours.",
                    "Constructed from 100% rust-proof 304 food-grade stainless steel with leak-proof flip lid and carrying jacket with strap.",
                    "{\"Capacity\":\"1000 ml\",\"Insulation\":\"24 Hours Hot / Cold\",\"Steel\":\"Food Grade 304\",\"BPA Free\":\"Yes\"}",
                    new String[]{"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("home-living", "Cello Home", "cello-home", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cello_Pens_Logo.png", "Companion for Life. Kitchen and home storage.",
                    "Cello Max Fresh Click Airtight Borosilicate Glass Lunch Box Set (3 Containers)", "cello-max-fresh-glass-lunch-box-set", "HOME-CELH-01",
                    1499, 35, 75, 4.6, 170, "100% leak-proof microwave and oven safe borosilicate glass containers with insulated bag.",
                    "Crystal-clear glass does not absorb food stains or odors. Withstands thermal shocks up to 400°C with 4-side locking clip lids.",
                    "{\"Capacity\":\"3 x 400ml\",\"Material\":\"100% Borosilicate Glass\",\"Safe For\":\"Microwave, Oven, Freezer, Dishwasher\"}",
                    new String[]{"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"}),

            // ==========================================
            // 4. BEAUTY & PERSONAL CARE (21 Distinct Brands)
            // ==========================================
            new BrandProductItem("beauty-personal-care", "Minimalist", "minimalist", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80", "Science-backed transparent skincare and actives.",
                    "Minimalist 10% Niacinamide Face Serum with Zinc for Blemish & Pore Care", "minimalist-niacinamide-10-zinc-serum", "BEAU-MINI-01",
                    599, 10, 120, 4.7, 340, "Pure Vitamin B3 and Zinc PCA serum that fades acne marks and balances excess sebum.",
                    "Clinically proven formula infused with EUK-134 antioxidant. Calms redness, strengthens skin barrier, and imparts a refined smooth texture.",
                    "{\"Key Actives\":\"10% Niacinamide + 1% Zinc PCA\",\"Volume\":\"30 ml\",\"Skin Type\":\"Oily, Acne-Prone & Combination\"}",
                    new String[]{"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "L'Oréal", "loreal", "https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg", "Because You're Worth It. Global beauty authority.",
                    "L'Oréal Paris Revitalift 1.5% Pure Hyaluronic Acid Plumping Serum", "loreal-revitalift-hyaluronic-acid-serum", "BEAU-LORE-01",
                    999, 25, 90, 4.8, 410, "Lightweight non-sticky serum that instantly plumps skin and reduces fine lines by 60%.",
                    "Formulated with micro and macro hyaluronic acid molecules that penetrate deep into dermal layers, locking in moisture for radiant glass skin.",
                    "{\"Key Ingredient\":\"1.5% Pure Hyaluronic Acid\",\"Volume\":\"30 ml\",\"Benefits\":\"Deep Hydration & Anti-Aging Plump\"}",
                    new String[]{"https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Nivea", "nivea", "https://upload.wikimedia.org/wikipedia/commons/9/91/Nivea_logo.svg", "100 years of gentle skincare heritage.",
                    "Nivea Men Dark Spot Reduction Moisturizing Face Wash (150g)", "nivea-men-dark-spot-reduction-facewash", "BEAU-NIVE-01",
                    325, 20, 110, 4.6, 290, "10x Whitanat Vita Complex deep cleanses dirt and oil while fading dark spots.",
                    "Gentle foaming formula that doesn't strip skin of its natural moisture. Leaves your complexion refreshed, bright, and deeply clean.",
                    "{\"Volume\":\"150 grams\",\"Skin Type\":\"All Skin Types\",\"Active\":\"Whitanat Formula + Licorice Extract\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Mamaearth", "mamaearth", "https://upload.wikimedia.org/wikipedia/commons/3/3f/Mamaearth_logo.png", "Goodness Inside. Toxin-free natural care.",
                    "Mamaearth Onion Hair Oil with Redensyl for Hair Fall Control (250ml)", "mamaearth-onion-hair-oil-redensyl", "BEAU-MAMA-01",
                    599, 15, 80, 4.5, 330, "Sulfur-rich red onion seed oil enriched with Redensyl and Almond oil to boost hair density.",
                    "Dermatologically tested and free of mineral oil, silicones, and parabens. Nourishes scalp, reduces hair breakage, and restores glossy shine.",
                    "{\"Volume\":\"250 ml\",\"Key Ingredients\":\"Red Onion Seed Oil + Redensyl + Bhringraj\",\"Toxin Free\":\"Made Safe Certified\"}",
                    new String[]{"https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "WOW Skin Science", "wow-skin-science", "https://upload.wikimedia.org/wikipedia/commons/8/87/WOW_Skin_Science_logo.png", "Pure & traditional holistic wellness.",
                    "WOW Skin Science Organic Apple Cider Vinegar Foaming Face Wash with Built-in Brush", "wow-apple-cider-vinegar-foaming-facewash", "BEAU-WOWS-01",
                    399, 30, 95, 4.4, 210, "Soft silicone bristled brush unclogs pores and washes away dead skin cells.",
                    "Enriched with raw apple cider vinegar, aloe vera extract, and vitamins B5 & E. Balances skin pH and controls breakouts naturally.",
                    "{\"Volume\":\"150 ml\",\"Includes\":\"Built-in Silicone Exfoliating Brush\",\"Key Ingredient\":\"Raw Apple Cider Vinegar\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Maybelline", "maybelline", "https://upload.wikimedia.org/wikipedia/commons/a/a3/Maybelline_Logo.svg", "Maybe she's born with it. Maybe it's Maybelline.",
                    "Maybelline New York Lash Sensational Sky High Waterproof Mascara", "maybelline-sky-high-mascara", "BEAU-MAYB-01",
                    799, 20, 85, 4.9, 480, "Flex Tower brush delivers limitless length and full volume from root to tip.",
                    "Infused with bamboo extract and fibers for lightweight, impact-resistant lashes that don't flake or smudge for up to 24 hours.",
                    "{\"Shade\":\"Very Black\",\"Brush\":\"Flexible Tower Brush\",\"Waterproof\":\"Yes 24H Smudge-Proof\"}",
                    new String[]{"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Lakmé", "lakme", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Lakm%C3%A9_Cosmetics_Logo.svg", "Reinventing beauty for Indian women.",
                    "Lakmé Absolute Skin Natural Mousse Matte SPF 8 Foundation (Rose Fair)", "lakme-absolute-skin-natural-mousse", "BEAU-LAKM-01",
                    850, 15, 60, 4.7, 190, "Feather-light whipped texture blends effortlessly for a flawless poreless matte finish.",
                    "Lasts up to 16 hours without touch-ups. Hides blemishes, evens out pigmentation, and feels weightless on the skin all day.",
                    "{\"Weight\":\"25 grams\",\"Coverage\":\"Medium to Full Matte\",\"SPF\":\"SPF 8 UV Protection\"}",
                    new String[]{"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "The Body Shop", "the-body-shop", "https://upload.wikimedia.org/wikipedia/commons/e/ec/The_Body_Shop_logo.svg", "Ethical beauty with community fair trade ingredients.",
                    "The Body Shop British Rose Shower Gel (250ml) & Body Butter Set", "the-body-shop-british-rose-body-butter-set", "BEAU-TBOD-01",
                    1495, 10, 40, 4.8, 110, "Infused with hand-picked English organic rose petals and Community Fair Trade shea butter.",
                    "Lather up in delicate floral decadence. Body butter provides 96 hours of nourishing moisture for petal-soft, glowing skin.",
                    "{\"Volume\":\"250ml Shower Gel + 200ml Body Butter\",\"Ingredients\":\"Hand-Picked British Rose Essence\",\"Vegan\":\"100% Certified\"}",
                    new String[]{"https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Dove", "dove", "https://upload.wikimedia.org/wikipedia/commons/8/87/Dove_wordmark.svg", "Real Beauty. Deep moisture care.",
                    "Dove Deep Moisture Nourishing Body Wash with NutriumMoisture (800ml)", "dove-deep-moisture-body-wash-800ml", "BEAU-DOVE-01",
                    499, 25, 90, 4.7, 360, "1/4 moisturizing cream formula that transforms dry skin in just one single shower.",
                    "Microbiome gentle body wash with plant-based cleansers and rich creamy lather that restores your skin's protective lipid barrier.",
                    "{\"Volume\":\"800 ml\",\"Formula\":\"1/4 Moisturising Cream\",\"Sulfate Free\":\"Yes\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Garnier", "garnier", "https://upload.wikimedia.org/wikipedia/commons/b/b2/Garnier_logo.svg", "By Garnier, Naturally. Green beauty commitment.",
                    "Garnier SkinActive Micellar Cleansing Water All-in-1 Makeup Remover (400ml)", "garnier-micellar-cleansing-water-400ml", "BEAU-GARN-01",
                    399, 20, 100, 4.8, 420, "Micelles lift away waterproof makeup, dirt, and pollution like a magnet with zero rubbing.",
                    "Suitable for all skin types including sensitive eyes and lips. Alcohol-free, fragrance-free, and oil-free gentle cleansing formula.",
                    "{\"Volume\":\"400 ml (Up to 200 Uses)\",\"Formula\":\"Micellar Magnetic Cleansing\",\"Rinse Free\":\"Yes\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Neutrogena", "neutrogena", "https://upload.wikimedia.org/wikipedia/commons/6/6f/Neutrogena_Logo.svg", "Dermatologist Recommended Skincare.",
                    "Neutrogena Hydro Boost Water Gel Face Moisturizer with Hyaluronic Acid (50g)", "neutrogena-hydro-boost-water-gel", "BEAU-NEUT-01",
                    950, 15, 75, 4.9, 390, "Oil-free gel moisturizer that absorbs instantly and keeps skin hydrated for 72 hours.",
                    "Prebiotics boost skin's natural hyaluronic acid synthesis. Strengthens skin's moisture barrier for a plump, supple, and glowing bounce.",
                    "{\"Weight\":\"50 grams\",\"Texture\":\"Water Gel Non-Comedogenic\",\"Key Ingredient\":\"Purified Hyaluronic Acid\"}",
                    new String[]{"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Biotique", "biotique", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Biotique_Logo.png", "100% Ayurvedic Recipe. Swiss biotechnology.",
                    "Biotique Bio Kelp Protein Complex Anti-Hairfall Treatment Shampoo (650ml)", "biotique-bio-kelp-anti-hairfall-shampoo", "BEAU-BIOT-01",
                    480, 30, 90, 4.4, 210, "Pure kelp, natural proteins, peppermint oil, and mint leaf extract stimulate root follicles.",
                    "Invigorates the scalp for healthier hair growth and lustrous shine without parabens or harsh artificial foaming agents.",
                    "{\"Volume\":\"650 ml\",\"Key Actives\":\"Pure Kelp + Tesu + Neem Bark Extract\",\"Ayurvedic\":\"100% Botanical Extracts\"}",
                    new String[]{"https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Forest Essentials", "forest-essentials", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=80", "Luxurious Ayurveda. Royal Indian beauty rituals.",
                    "Forest Essentials Delicate Facial Cleanser with Kashmiri Saffron & Neem (200ml)", "forest-essentials-saffron-neem-cleanser", "BEAU-FESS-01",
                    1575, 10, 35, 4.9, 140, "Handcrafted Ayurvedic infusion of Kashmiri saffron, pure kewda water, and purifying neem.",
                    "Gently clears dead cells and unclogs pores while leaving skin hydrated, supple, and glowing with an authentic royal fragrance.",
                    "{\"Volume\":\"200 ml\",\"Key Actives\":\"Kashmiri Saffron + Neem Oil + Pure Kewda\",\"Finish\":\"Gentle Golden Dewy Glow\"}",
                    new String[]{"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Soulflower", "soulflower", "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=150&auto=format&fit=crop&q=80", "100% pure organic aromatherapy and wellness.",
                    "Soulflower 100% Pure Organic Rosemary Essential Oil for Hair Growth (30ml)", "soulflower-organic-rosemary-essential-oil", "BEAU-SOUL-01",
                    450, 15, 80, 4.7, 310, "Steam-distilled therapeutic-grade rosemary oil proven to awaken dormant hair roots.",
                    "Controls scalp dandruff, stimulates blood micro-circulation, and imparts deep calming herbaceous aromatherapy benefits.",
                    "{\"Volume\":\"30 ml\",\"Extraction\":\"100% Pure Steam Distilled\",\"Application\":\"Hair Growth & Scalp Stimulation\"}",
                    new String[]{"https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Clinique", "clinique", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Clinique_Logo.svg", "Allergy Tested. 100% Fragrance Free.",
                    "Clinique Moisture Surge 100H Auto-Replenishing Hydrator Gel-Cream (50ml)", "clinique-moisture-surge-100h", "BEAU-CLIN-01",
                    3100, 10, 25, 4.9, 160, "Aloe bio-ferment and hyaluronic acid penetrate over 10 layers deep for 100 hours of hydration.",
                    "Addictive oil-free gel-cream works like a moisture reservoir. Soothes skin in 3 seconds and leaves a luminous, glass-like dewy finish.",
                    "{\"Volume\":\"50 ml\",\"Technology\":\"Auto-Replenishing Aloe Bio-Ferment\",\"Fragrance Free\":\"100% Tested\"}",
                    new String[]{"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Plum", "plum-goodness", "https://upload.wikimedia.org/wikipedia/commons/a/a2/Plum_Goodness_Logo.png", "Be Good. 100% vegan beauty.",
                    "Plum Green Tea Alcohol-Free Clarifying Face Toner with Glycolic Acid (200ml)", "plum-green-tea-alcohol-free-toner", "BEAU-PLUM-01",
                    390, 15, 90, 4.6, 270, "Antioxidant-rich green tea extracts and mild glycolic acid tighten pores and combat acne.",
                    "Completely alcohol-free formula that doesn't sting or dehydrate. Clears away excess dead cells and leaves skin feeling crisp and radiant.",
                    "{\"Volume\":\"200 ml\",\"Key Actives\":\"Organic Green Tea + Glycolic Acid\",\"Alcohol Free\":\"Yes 100%\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Kama Ayurveda", "kama-ayurveda", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=80", "Authentic Ayurvedic Treatments.",
                    "Kama Ayurveda Pure Rose Water Facial Mist Toner (200ml)", "kama-ayurveda-pure-rose-water-200ml", "BEAU-KAMA-01",
                    1450, 10, 30, 4.9, 180, "Steam-distilled from the petals of luxurious Kannauj Roses for unmatched natural toning.",
                    "An incredible face mist that restores moisture, cools sun-stressed skin, tightens enlarged pores, and imparts an authentic soothing rose aroma.",
                    "{\"Volume\":\"200 ml\",\"Ingredient\":\"100% Steam Distilled Kannauj Rose Water\",\"Preservatives\":\"Zero Chemicals\"}",
                    new String[]{"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Cetaphil", "cetaphil", "https://upload.wikimedia.org/wikipedia/commons/a/af/Cetaphil_Logo.svg", "Gentle Power. #1 Dermatologist Recommended Cleanser.",
                    "Cetaphil Gentle Skin Cleanser for Dry to Normal Sensitive Skin (250ml)", "cetaphil-gentle-skin-cleanser-250ml", "BEAU-CETA-01",
                    399, 10, 110, 4.8, 380, "Soap-free, non-irritating formula cleanses without stripping skin's natural protective oils.",
                    "Enriched with Niacinamide, Vitamin B5, and Hydrating Glycerin. Clinically proven to hydrate while cleansing sensitive face and body.",
                    "{\"Volume\":\"250 ml\",\"pH\":\"Balanced to Skin Neutral\",\"Soap Free\":\"Yes Non-Comedogenic\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Beardo", "beardo", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Beardo_Logo.png", "Anybody can grow a beard, but not everybody can be a Beardo.",
                    "Beardo Godfather Luxury Beard Growth Oil with Mineral Complex (30ml)", "beardo-godfather-beard-oil-30ml", "BEAU-BEAR-01",
                    399, 20, 85, 4.6, 240, "Almond oil and argan oil blend softens coarse beard hair and conditions itchy stubble.",
                    "Non-greasy nourishing grooming oil with masculine woodsy cologne fragrance. Promotes healthy thick beard density.",
                    "{\"Volume\":\"30 ml\",\"Key Oils\":\"Argan Oil + Almond Oil + Vitamin E\",\"Fragrance\":\"Premium Godfather Scent\"}",
                    new String[]{"https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "Himalaya", "himalaya-wellness", "https://upload.wikimedia.org/wikipedia/commons/2/25/Himalaya_Wellness_Company_Logo.svg", "Happiness through Wellness since 1930.",
                    "Himalaya Purifying Neem Face Wash for Pimples and Clear Skin (300ml)", "himalaya-purifying-neem-facewash-300ml", "BEAU-HIMA-01",
                    350, 25, 120, 4.7, 490, "Soap-free herbal formula that gently removes impurities and prevents recurring acne.",
                    "Combines the antibacterial properties of pure Neem with soothing Turmeric to purify skin and maintain natural moisture balance.",
                    "{\"Volume\":\"300 ml\",\"Key Actives\":\"Organic Neem + Golden Turmeric\",\"Free From\":\"Parabens & Harsh Sulfates\"}",
                    new String[]{"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("beauty-personal-care", "MCaffeine", "mcaffeine", "https://upload.wikimedia.org/wikipedia/commons/3/3a/MCaffeine_Logo.png", "India's 1st Caffeinated Personal Care Brand.",
                    "mCaffeine Naked & Raw Exfoliating Coffee Body Scrub for Tan Removal (100g)", "mcaffeine-coffee-body-scrub-100g", "BEAU-MCAF-01",
                    449, 20, 75, 4.7, 260, "Pure Arabica coffee grounds and cold-pressed coconut oil buff away stubborn tan.",
                    "Exfoliates dead skin cells, reduces cellulite, and unclogs ingrown hairs, leaving full-body skin buttery smooth and caffeinated.",
                    "{\"Weight\":\"100 grams\",\"Key Ingredients\":\"Pure Arabica Coffee + Virgin Coconut Oil\",\"Benefit\":\"Tan Removal & Cellulite Reduction\"}",
                    new String[]{"https://images.unsplash.com/photo-1608248597359-051515efdb67?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"}),

            // ==========================================
            // 5. SPORTS & FITNESS (21 Distinct Brands)
            // ==========================================
            new BrandProductItem("sports-outdoors", "Cultsport", "cultsport", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80", "High-performance fitness gear and home workout equipment.",
                    "Cultsport SmartRun Touchscreen Foldable Treadmill for Home Gym", "cultsport-smartrun-foldable-treadmill", "SPOR-CULT-01",
                    28990, 30, 15, 4.8, 120, "2.0 HP continuous duty DC motor with 12 level auto-incline and live workout streaming.",
                    "Heavy-gauge steel frame with 6-point shock absorption system to protect knees and joints during intense running sessions.",
                    "{\"Motor\":\"2.0 HP Peak 4.0 HP\",\"Speed\":\"1 to 14 km/h\",\"Max User Weight\":\"115 kg\",\"Display\":\"LCD Touch Display\"}",
                    new String[]{"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Decathlon", "decathlon", "https://upload.wikimedia.org/wikipedia/commons/0/08/Decathlon_Logo.svg", "Sport for all, all for sport.",
                    "Decathlon Quechua 2-Seconds Easy Waterproof Camping Tent (3 Person)", "decathlon-quechua-2-seconds-tent", "SPOR-DECA-01",
                    6999, 15, 25, 4.9, 190, "Patented instant pop-up mechanism sets up your shelter in under two seconds.",
                    "Fresh & Black fabric technology reflects sunlight and keeps tent dark and cool even during bright midday sunshine.",
                    "{\"Capacity\":\"3 Persons\",\"Waterproof\":\"2000 mm Tropical Rain Tested\",\"Wind Resistance\":\"Force 6 (50 km/h)\"}",
                    new String[]{"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Yonex", "yonex", "https://upload.wikimedia.org/wikipedia/commons/6/60/Yonex_logo.svg", "Far beyond ordinary. #1 in global badminton.",
                    "Yonex Astrox 99 Pro High-Modulus Carbon Badminton Racket (Made in Japan)", "yonex-astrox-99-pro-racket", "SPOR-YONE-01",
                    14990, 20, 30, 4.9, 210, "Head-heavy power smash racket engineered with Rotational Generator System and Namd graphite.",
                    "The weapon of choice for world champions. Delivers steep, explosive smashes and pinpoint shuttle control from the back court.",
                    "{\"Frame\":\"HM Graphite + Namd + Volume Cut Resin\",\"Weight\":\"4U (83g)\",\"Grip\":\"G5\",\"Flex\":\"Extra Stiff\"}",
                    new String[]{"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Cosco", "cosco-sports", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Cosco_India_Logo.png", "Official Sports Equipment Supplier of India.",
                    "Cosco Premier Football FIFA Quality Pro Match Ball (Size 5)", "cosco-premier-football-size5", "SPOR-COSC-01",
                    1890, 25, 70, 4.6, 160, "Hand-stitched Japanese polyurethane outer casing with multi-ply latex bladder for true flight.",
                    "Engineered for all-weather professional club matches and competitive tournament play on natural and artificial turf.",
                    "{\"Size\":\"Size 5 Official\",\"Material\":\"PU Microfiber Leather\",\"Bladder\":\"Taiwanese Air-Lock Latex\"}",
                    new String[]{"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Nivia", "nivia", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Nivia_Sports_Logo.png", "Step Out And Play. India's iconic ball makers.",
                    "Nivia Storm Rubber Football with High Abrasion Outer Layer (Size 5)", "nivia-storm-rubber-football-size5", "SPOR-NIVI-01",
                    699, 30, 120, 4.5, 410, "Reinforced cross-laminated composite rubber carcass built for rough Indian ground surfaces.",
                    "Resistant to gravel, concrete, and mud. Zero water absorption ensures predictable rebound and optimal shooting accuracy.",
                    "{\"Construction\":\"32 Panel Molded\",\"Outer\":\"Rubberized Tough Outer\",\"Ideal For\":\"Hard and Rough Grounds\"}",
                    new String[]{"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Speedo", "speedo", "https://upload.wikimedia.org/wikipedia/commons/f/fc/Speedo_logo.svg", "The World's Leading Swimwear Brand.",
                    "Speedo Fastskin Elite Mirrored Anti-Fog Competition Swim Goggles", "speedo-fastskin-elite-mirrored-goggles", "SPOR-SPEE-01",
                    3299, 15, 45, 4.8, 140, "Hydrodynamic low-profile racing goggles featuring IQfit 3D seal for leak-free swimming.",
                    "Mirrored chrome finish lenses eliminate water glare under harsh pool lighting while wide peripheral field aids lap timing.",
                    "{\"Lens\":\"Polycarbonate Mirrored\",\"Strap\":\"IQfit Tensioning Scale Silicone\",\"Anti-Fog\":\"Hydroscopic Coating\"}",
                    new String[]{"https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Wilson", "wilson-tennis", "https://upload.wikimedia.org/wikipedia/commons/4/40/Wilson_Sporting_Goods_logo.svg", "More Win. Unrivaled racket sports heritage.",
                    "Wilson Pro Staff 97 v14 Precision Performance Tennis Racket", "wilson-pro-staff-97-v14", "SPOR-WILS-01",
                    21990, 10, 20, 4.9, 85, "Braided 45 construction delivers incredible ball pocketing and pinpoint court control.",
                    "The iconic racket of Roger Federer. Paradigm Bending technology optimizes the bending profile between frame and shaft for classic feel.",
                    "{\"Head Size\":\"97 sq in\",\"Unstrung Weight\":\"315 grams\",\"String Pattern\":\"16 x 19\",\"Balance\":\"31.0 cm 10 pts HL\"}",
                    new String[]{"https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Reebok Fitness", "reebok-fitness", "https://upload.wikimedia.org/wikipedia/commons/d/d4/Reebok_2019_logo.svg", "Life is not a spectator sport.",
                    "Reebok Professional Non-Slip Aerobic Step Workout Platform", "reebok-professional-aerobic-step", "SPOR-REEB-01",
                    8999, 20, 35, 4.8, 170, "Studio-grade step board with 3 adjustable heights (15cm, 20cm, 25cm) and non-slip rubber grip.",
                    "The gold standard in aerobic cardio and strength training. Built with rugged high-density polyethylene that supports up to 150kg.",
                    "{\"Dimensions\":\"102 x 38.5 x 25 cm\",\"Heights\":\"3 Levels (15, 20, 25cm)\",\"Surface\":\"Textured Bubble Non-Slip Rubber\"}",
                    new String[]{"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Everlast", "everlast", "https://upload.wikimedia.org/wikipedia/commons/3/30/Everlast_logo.svg", "Choice of Champions since 1910.",
                    "Everlast Pro Style Boxing Training Gloves 12oz (Synthetic Leather)", "everlast-pro-style-boxing-gloves-12oz", "SPOR-EVER-01",
                    2999, 25, 50, 4.7, 190, "Two-layer foam padding with full wrist wrap hook-and-loop strap for superior hand protection.",
                    "Features EverCool mesh palm for ventilation and anti-microbial EverFresh treatment to keep boxing gloves free from sweat odors.",
                    "{\"Weight\":\"12 oz\",\"Padding\":\"Dual Layer Density Foam\",\"Closure\":\"Full Wrist Wrap Hook & Loop\"}",
                    new String[]{"https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Strauss", "strauss", "https://upload.wikimedia.org/wikipedia/commons/4/41/Strauss_Sports_Logo.png", "Fitness for your active lifestyle.",
                    "Strauss Anti-Skid Eco-Friendly TPE Yoga & Pilates Exercise Mat 6mm with Carry Strap", "strauss-tpe-yoga-mat-6mm", "SPOR-STRA-01",
                    1299, 45, 90, 4.6, 270, "Dual-color dual-textured non-slip surface provides superior floor grip and joint cushioning.",
                    "Made from 100% recyclable, non-toxic TPE material. Moisture-resistant surface cleans easily with soap and water after hot yoga.",
                    "{\"Thickness\":\"6 mm High Density\",\"Material\":\"Eco-Friendly TPE\",\"Dimensions\":\"183 cm x 61 cm\"}",
                    new String[]{"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Boldfit", "boldfit", "https://upload.wikimedia.org/wikipedia/commons/8/87/Boldfit_Logo.png", "Fitness Unleashed. Leading Indian D2C workout gear.",
                    "Boldfit Heavy Duty Pull Up Resistance Bands Set for Home Gym (Set of 3)", "boldfit-heavy-duty-resistance-bands-set", "SPOR-BOLD-01",
                    1499, 40, 85, 4.7, 310, "100% natural Malaysian latex bands offering progressive resistance from 15 to 85 lbs.",
                    "Perfect for assisted pull-ups, calisthenics, powerlifting, deep stretching, and full-body physical therapy workouts.",
                    "{\"Material\":\"100% Natural Malaysian Latex\",\"Resistance\":\"Light (15-35 lbs), Medium (25-65 lbs), Heavy (35-85 lbs)\"}",
                    new String[]{"https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Vector X", "vector-x", "https://upload.wikimedia.org/wikipedia/commons/8/82/Vector_X_Sports_Logo.png", "Victory in every movement.",
                    "Vector X Pro Speed Leather Skipping Jump Rope with 360° Ball Bearings", "vector-x-pro-speed-leather-jump-rope", "SPOR-VECT-01",
                    499, 30, 100, 4.5, 230, "Smooth 9-foot solid leather rope with precision ball bearings for tangle-free high-speed skips.",
                    "Ergonomic wooden handles absorb palm sweat. Accelerates cardiovascular endurance, footwork, and boxer conditioning.",
                    "{\"Rope Material\":\"Solid Cowhide Leather 9ft\",\"Handles\":\"Smooth Polished Wood\",\"Bearing\":\"360-Degree Steel Bearing\"}",
                    new String[]{"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "SG", "sg-cricket", "https://upload.wikimedia.org/wikipedia/commons/a/ad/Sanspareils_Greenlands_Logo.png", "Believe. India's premier cricket manufacturers.",
                    "SG Sunny Gold Icon Grade 1 English Willow Cricket Bat (Full Size SH)", "sg-sunny-gold-icon-cricket-bat", "SPOR-SG01-01",
                    24999, 15, 20, 4.9, 130, "Handcrafted from top-grade unbleached English Willow with massive contoured edges and sweet spot.",
                    "Features round Sarawak cane handle with chevron grip for vibration dampening and effortless stroke play across all ground formats.",
                    "{\"Willow\":\"Grade 1 English Willow (6-9 Grains)\",\"Weight\":\"1180 - 1220 grams\",\"Edge\":\"38-40 mm Contoured\"}",
                    new String[]{"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "SS", "ss-cricket", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Sareen_Sports_Logo.png", "Power Play. Official gear of international cricketers.",
                    "SS Master 500 Super Grade Kashmir Willow Cricket Bat with Toe Guard", "ss-master-500-kashmir-willow-bat", "SPOR-SS01-01",
                    2799, 30, 65, 4.6, 210, "Air-dried seasoned Kashmir willow with deep bow and thick power drive spine.",
                    "Fitted with multi-piece cane handle with rubber spring inserts for maximum power transmission on lofted sixes.",
                    "{\"Willow\":\"Premium Air Dried Kashmir Willow\",\"Sweet Spot\":\"Mid to Low\",\"Handle\":\"Short Handle Sarawak Cane\"}",
                    new String[]{"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Spalding", "spalding", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Spalding_logo.svg", "True to the Game. Legendary basketballs.",
                    "Spalding NBA Official Leather Indoor / Outdoor Composite Basketball (Size 7)", "spalding-nba-composite-basketball-size7", "SPOR-SPAL-01",
                    1999, 25, 75, 4.8, 280, "Premium tack composite leather cover with deep pebbling and wide channel design for ultimate grip.",
                    "Maintains exact sphericity and true bounce on concrete playgrounds, asphalt courts, and polished hardwood indoor gyms.",
                    "{\"Size\":\"Size 7 (29.5 Inches)\",\"Cover\":\"Premium Tack Composite Leather\",\"Bladder\":\"Butyl Rubber Air Retention\"}",
                    new String[]{"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Kobo", "kobo-fitness", "https://upload.wikimedia.org/wikipedia/commons/8/87/Kobo_Sports_Logo.png", "Stronger every day.",
                    "Kobo Solid Cast Iron Hex Dumbbells Pair (10kg x 2 = 20kg Total)", "kobo-solid-cast-iron-hex-dumbbells-10kg-pair", "SPOR-KOBO-01",
                    3899, 35, 45, 4.7, 190, "Anti-roll hexagonal heads coated with resilient virgin rubber and knurled ergonomic chrome handles.",
                    "Protects home floors from dents while preventing rolling. Perfect for dumbbell bench presses, goblet squats, and bicep curls.",
                    "{\"Total Weight\":\"20 kg (2 x 10kg)\",\"Core\":\"Solid Cast Iron\",\"Handle\":\"Contoured Knurled Chrome Grip\"}",
                    new String[]{"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Quechua", "quechua", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Quechua_Logo.svg", "Designed in the French Alps for hiking and outdoor trails.",
                    "Quechua NH Escape 500 23L Ergonomic Water-Resistant Hiking Backpack", "quechua-nh-escape-500-23l-backpack", "SPOR-QUEC-01",
                    2499, 15, 60, 4.9, 320, "Engineered with 14 functional pockets including padded 15-inch laptop compartment and rain cover.",
                    "Padded ventilated mesh back panel and chest strap distribute weight evenly, making mountain trails and city commuting effortless.",
                    "{\"Volume\":\"23 Litres\",\"Laptop Pocket\":\"Up to 15.6 Inch\",\"Fabric\":\"Abrasion Resistant Coated Polyester\"}",
                    new String[]{"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Domyos", "domyos", "https://upload.wikimedia.org/wikipedia/commons/6/67/Domyos_Logo.svg", "Fitness and gymnastics equipment by Decathlon.",
                    "Domyos 500 Elastic Bodyweight Resistance Suspension Trainer System", "domyos-bodyweight-suspension-trainer-500", "SPOR-DOMY-01",
                    1499, 20, 70, 4.6, 150, "Anchor securely to any door, pull-up bar, or outdoor tree for hundreds of bodyweight workouts.",
                    "Strengthen core, back, chest, and arms using gravity and your own bodyweight. Compact mesh carry pouch included.",
                    "{\"Max Load\":\"130 kg\",\"Straps\":\"High-Tenacity Industrial Webbing\",\"Includes\":\"Door Anchor + Mesh Pouch\"}",
                    new String[]{"https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Asics", "asics", "https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg", "Anima Sana In Corpore Sano. Sound mind in a sound body.",
                    "Asics Gel-Kayano 30 Max Stability Long Distance Running Shoes", "asics-gel-kayano-30-running-shoes", "SPOR-ASIC-01",
                    13999, 15, 40, 4.9, 230, "4D Guidance System delivers adaptive stability and PureGEL heel technology for plush landings.",
                    "Engineered stretch knit upper provides breathable comfort while FF BLAST PLUS ECO cushioning creates cloud-like bounce over marathons.",
                    "{\"Cushioning\":\"FF BLAST PLUS ECO + PureGEL\",\"Pronation\":\"Overpronation & Neutral\",\"Weight\":\"303g\"}",
                    new String[]{"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Garmin", "garmin", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Garmin_logo.svg", "Engineered on the inside for life on the outside.",
                    "Garmin Forerunner 265 Running GPS Smartwatch with Bright AMOLED Display", "garmin-forerunner-265-gps-watch", "SPOR-GARM-01",
                    46990, 8, 20, 4.9, 110, "Brilliant touchscreen AMOLED display with training readiness score, HRV status, and VO2 Max.",
                    "Multi-band satellite GPS gives superior accuracy under dense tree cover. Up to 13 days of battery life in smartwatch mode.",
                    "{\"Display\":\"1.3-inch AMOLED Touchscreen\",\"Battery Life\":\"Up to 13 Days\",\"GPS\":\"Multi-Band GNSS with SatIQ\",\"Water Rating\":\"5 ATM\"}",
                    new String[]{"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("sports-outdoors", "Kalenji", "kalenji", "https://upload.wikimedia.org/wikipedia/commons/b/ba/Kalenji_Logo.png", "Find your rhythm. Running gear for everyone.",
                    "Kalenji Dry+ Men's Breathable Lightweight Running Shorts with Zipper Phone Pocket", "kalenji-dry-plus-running-shorts", "SPOR-KALE-01",
                    899, 20, 90, 4.6, 280, "Ultra-lightweight moisture-wicking running shorts with integrated breathable brief lining.",
                    "Equipped with secure sweat-resistant zippered smartphone back pocket that stops your phone from bouncing during fast sprints.",
                    "{\"Fabric\":\"100% Recycled Quick-Dry Polyester\",\"Pocket\":\"Zipper Back Phone Pocket\",\"Lining\":\"Built-In Breathable Brief\"}",
                    new String[]{"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}),

            // ==========================================
            // 6. BOOKS & STATIONERY (21 Distinct Brands)
            // ==========================================
            new BrandProductItem("books-stationery", "Classmate", "classmate", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Classmate_logo.svg/1200px-Classmate_logo.svg.png", "India's No.1 Notebook Brand by ITC.",
                    "Classmate Pulse Long Spiral Hardbound Notebooks 300 Pages (Pack of 4)", "classmate-pulse-spiral-notebooks-pack4", "BOOK-CLAS-01",
                    599, 15, 120, 4.8, 380, "Whiter, brighter, and smoother paper engineered with ozone-treated chlorine-free pulp.",
                    "Twin-wire snag-free spiral binding lays flat 360 degrees for effortless coaching lecture notes and mathematical derivations.",
                    "{\"Pages\":\"300 Pages per Notebook\",\"Binding\":\"Spiral Wire-O Bound\",\"Paper\":\"70 GSM Bright White\"}",
                    new String[]{"https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Cello", "cello", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cello_Pens_Logo.png", "Joy of writing. Smooth and reliable ballpoint pens.",
                    "Cello Butterflow Classic Blue Ballpoint Pens (Box of 20 Pens)", "cello-butterflow-blue-pens-box20", "BOOK-CELL-01",
                    299, 20, 150, 4.7, 490, "Lubriflow low-viscosity ink system delivers silky smooth pressure-free handwriting.",
                    "India's most loved examination pen. Features comfortable elasto-grip for hours of non-fatiguing speed writing during board exams.",
                    "{\"Ink Color\":\"Royal Blue\",\"Tip Size\":\"0.7 mm Swiss Carbide Ball\",\"Grip\":\"Soft Rubberized Elasto-Grip\"}",
                    new String[]{"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Apsara", "apsara", "https://upload.wikimedia.org/wikipedia/commons/6/64/Hindustan_Pencils_Logo.png", "Extra dark and smooth writing pencils.",
                    "Apsara Platinum Extra Dark Writing Pencils (Pack of 30 with Sharpener & Eraser)", "apsara-platinum-extra-dark-pencils-pack30", "BOOK-APSA-01",
                    240, 10, 130, 4.8, 420, "Specially bonded high-density lead produces distinctly dark, crisp impressions with less pressure.",
                    "Soft wood casing sharpens smoothly without lead breakage. Comes with non-dust erasers and deluxe point-protecting sharpeners.",
                    "{\"Lead\":\"High-Density Platinum Extra Dark\",\"Pack\":\"30 Pencils + 3 Erasers + 3 Sharpeners\",\"Wood\":\"Sustainably Harvested\"}",
                    new String[]{"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Natraj", "natraj", "https://upload.wikimedia.org/wikipedia/commons/6/64/Hindustan_Pencils_Logo.png", "Durable and non-dust stationery essentials.",
                    "Natraj 621 Bold Drawing Pencils & Dust-Free Clean Erasers Mega Combo", "natraj-621-bold-pencils-combo", "BOOK-NATR-01",
                    199, 15, 140, 4.6, 290, "The classic red-and-black striped pencil trusted across Indian schools for over 50 years.",
                    "Smooth graphite core ideal for drafting, geometry rough work, and sketching without smudging across pages.",
                    "{\"Pencil Model\":\"Natraj 621\",\"Lead Grade\":\"HB Semi-Hexagonal\",\"Includes\":\"20 Pencils + 10 Erasers\"}",
                    new String[]{"https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Faber-Castell", "faber-castell", "https://upload.wikimedia.org/wikipedia/commons/8/86/Faber-Castell_logo.svg", "Companion for a lifetime of creative expression since 1761.",
                    "Faber-Castell Connector Pen Sketch Markers Set of 25 with Animal Craft Clip", "faber-castell-connector-pens-set25", "BOOK-FABE-01",
                    220, 10, 110, 4.8, 310, "Unique click-together connector caps allow children to clip pens together while creating art.",
                    "Food-grade washable ink cleans easily from fabrics and hands. Medium bullet tip produces vivid, bold coloring lines.",
                    "{\"Colors\":\"25 Vibrant Shades\",\"Ink\":\"Non-Toxic Food-Grade Washable\",\"Features\":\"Click Connector Caps\"}",
                    new String[]{"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Camlin", "camlin", "https://upload.wikimedia.org/wikipedia/commons/5/5e/Kokuyo_Camlin_Logo.png", "Inspiring creativity in Indian art.",
                    "Kokuyo Camlin Artists Acrylic Color Tubes Set of 12 (20ml Each)", "camlin-artists-acrylic-colour-set12", "BOOK-CAML-01",
                    495, 10, 85, 4.7, 190, "Fast-drying, rich, highly pigmented acrylic colors that retain brilliance on canvas, paper, and wood.",
                    "Inter-mixable colors with smooth buttery consistency that doesn't crack or yellow over decades of fine art display.",
                    "{\"Tubes\":\"12 Tubes x 20ml\",\"Pigment\":\"Permanent High Lightfastness\",\"Surface\":\"Canvas, Paper, Wood, Clay\"}",
                    new String[]{"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Reynolds", "reynolds", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Reynolds_Pens_Logo.png", "Writing with pride across the globe.",
                    "Reynolds 045 Fine Carbide Ballpoint Pens Classic Pack of 20", "reynolds-045-carbide-ball-pens-pack20", "BOOK-REYN-01",
                    200, 10, 160, 4.6, 440, "The iconic white body blue cap pen known for zero-leakage reliable writing performance.",
                    "Laser-tip technology and tungsten carbide ball ensure smooth consistent lines until the very last drop of ink.",
                    "{\"Tip\":\"0.5 mm Fine Point\",\"Ink Color\":\"Blue\",\"Body\":\"White Hexagonal Barrel\"}",
                    new String[]{"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Staedtler", "staedtler", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Staedtler_Logo.svg", "Head of ideas. German engineering.",
                    "Staedtler Mars Lumograph Premium Graphite Sketching Pencils (Set of 12 Degrees)", "staedtler-mars-lumograph-pencils-set12", "BOOK-STAE-01",
                    990, 15, 60, 4.9, 210, "Super-bonded lead with high break resistance for professional drafting, portraits, and sketches.",
                    "Includes 12 calibrated hardness degrees from 6B to 4H in a protective metal tin. Lines reproduce clearly on architectural blueprints.",
                    "{\"Degrees\":\"6B, 5B, 4B, 3B, 2B, B, HB, F, H, 2H, 3H, 4H\",\"Case\":\"Embossed Storage Tin Box\",\"Origin\":\"Made in Germany\"}",
                    new String[]{"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Parker", "parker", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Parker_Pen_Company_logo.svg", "Makers of fine writing instruments since 1888.",
                    "Parker Vector Matte Black Fountain Pen with Chrome Trim (Fine Nib)", "parker-vector-matte-black-fountain-pen", "BOOK-PARK-01",
                    499, 10, 90, 4.7, 310, "Resilient stainless steel nib engineered to accommodate left and right-handed angles.",
                    "Iconic arrow clip with matte black molded epoxy resin barrel. Comes with twin-channel ink feed and converter for bottled ink.",
                    "{\"Nib\":\"Stainless Steel Fine (F)\",\"Body\":\"Matte Black Molded Resin\",\"Refill\":\"Parker Quink Ink Cartridge / Converter\"}",
                    new String[]{"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Pilot", "pilot", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Pilot_Corporation_logo.svg", "Over 100 years of Japanese liquid ink excellence.",
                    "Pilot V5 Hi-Tecpoint 0.5mm Precision Liquid Ink Rollerball Pens (Set of 5)", "pilot-v5-hi-tecpoint-rollerball-pens-set5", "BOOK-PILO-01",
                    350, 10, 110, 4.8, 370, "Unique pure liquid ink multi-dimple tip guarantees smooth, skip-free writing to the last drop.",
                    "Features transparent ink viewing window and patented ink controller mechanism that prevents blotting during temperature changes.",
                    "{\"Tip\":\"0.5 mm Stainless Steel Multi-Dimple\",\"Ink\":\"Pure Liquid Ink (Water Resistant)\",\"Pack\":\"5 Pens (Blue)\"}",
                    new String[]{"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Penguin Random House", "penguin-random-house", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80", "Global publisher of life-transforming bestsellers.",
                    "Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear", "atomic-habits-james-clear", "BOOK-PENG-01",
                    499, 30, 200, 4.9, 850, "World #1 bestseller on habit formation, tiny changes, and remarkable life outcomes.",
                    "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies to form good habits and break bad ones.",
                    "{\"Author\":\"James Clear\",\"Pages\":\"320 Pages\",\"Publisher\":\"Penguin Business\",\"Format\":\"Paperback Bestseller\"}",
                    new String[]{"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "HarperCollins", "harpercollins", "https://upload.wikimedia.org/wikipedia/commons/4/4b/HarperCollins_logo.svg", "Publishers since 1817.",
                    "The Psychology of Money: Timeless Lessons on Wealth, Greed & Happiness by Morgan Housel", "psychology-of-money-morgan-housel", "BOOK-HARP-01",
                    399, 25, 180, 4.9, 720, "19 short stories exploring the strange ways people think about money and risk.",
                    "Doing well with money isn't necessarily about what you know. It's about how you behave. Essential reading for financial freedom and behavioral psychology.",
                    "{\"Author\":\"Morgan Housel\",\"Pages\":\"256 Pages\",\"Publisher\":\"Jaico / HarperCollins\",\"Language\":\"English\"}",
                    new String[]{"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "S. Chand Publishing", "s-chand-publishing", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=150&auto=format&fit=crop&q=80", "Standard reference books by R.S. Aggarwal and academic authors.",
                    "Quantitative Aptitude for Competitive Examinations by Dr. R.S. Aggarwal (Revised Edition)", "quantitative-aptitude-rs-aggarwal", "BOOK-SCHA-01",
                    745, 20, 140, 4.8, 520, "Comprehensive practice questions with shortcut techniques for SSC, Banking, Railways & CAT.",
                    "The most authoritative reference book for mastering arithmetic, algebra, geometry, and number systems for Indian competitive exams.",
                    "{\"Author\":\"Dr. R.S. Aggarwal\",\"Pages\":\"920 Pages\",\"Publisher\":\"S. Chand Publishing\",\"Target\":\"SSC, Bank PO, UPSC, CAT\"}",
                    new String[]{"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Rakesh Yadav Publication", "rakesh-yadav-readers-publication", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80", "SSC & Government Exam Preparatory Books.",
                    "SSC Mathematics 7300+ Bilingual Chapterwise Objective Solved Questions", "rakesh-yadav-ssc-mathematics-7300", "BOOK-RAKE-01",
                    690, 25, 110, 4.8, 410, "Detailed bilingual step-by-step arithmetic and advanced mathematics solutions with QR code video hints.",
                    "Covers all TCS and SSC CGL, CPO, CHSL past examination papers from 1999 to date with Rakesh Yadav's personal classroom shortcuts.",
                    "{\"Author\":\"Rakesh Yadav Sir\",\"Language\":\"Bilingual (Hindi + English)\",\"Pages\":\"1050 Pages\",\"Format\":\"Paperback\"}",
                    new String[]{"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Oxford", "oxford-university-press", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Oxford_University_Press_logo.svg", "Oxford University Press. World reference authority.",
                    "Oxford Advanced Learner's Dictionary 10th Edition with Hardcover", "oxford-advanced-learners-dictionary-10th", "BOOK-OXFO-01",
                    995, 15, 60, 4.9, 310, "Over 182,000 words, phrases, and meanings with Oxford 3000 and 5000 core vocabulary guides.",
                    "The world's bestselling advanced learner's dictionary. Includes visual vocabulary illustrations, collocations, and pronunciation guides.",
                    "{\"Publisher\":\"Oxford University Press\",\"Edition\":\"10th Hardbound Edition\",\"Pages\":\"1840 Pages\",\"Weight\":\"1.4 kg\"}",
                    new String[]{"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Arihant", "arihant-publications", "https://upload.wikimedia.org/wikipedia/commons/8/82/Arihant_Publications_Logo.png", "Books for competitive exams across India.",
                    "Fast Track Objective Arithmetic by Rajesh Verma (Revised Expanded Edition)", "arihant-fast-track-objective-arithmetic", "BOOK-ARIH-01",
                    495, 20, 95, 4.7, 340, "Fast calculations, master shortcuts, and thousands of practice exercises for government recruitment tests.",
                    "Structured into Base Level and Higher Skill Level exercises with clear explanations and Vedic math tricks.",
                    "{\"Author\":\"Rajesh Verma\",\"Pages\":\"840 Pages\",\"Publisher\":\"Arihant Publications\",\"Coverage\":\"SSC, Bank PO, NDA, CDS\"}",
                    new String[]{"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Disha Publication", "disha-publication", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=150&auto=format&fit=crop&q=80", "Nurturing young minds towards exam success.",
                    "10,000+ Objective General Studies Questions with 100% Explanations", "disha-10000-general-studies-objective", "BOOK-DISH-01",
                    599, 25, 80, 4.6, 260, "Topic-wise MCQs covering Indian Polity, History, Geography, Economy, and General Science.",
                    "Divided into 8 sections with authentic previous year questions from UPSC, State PSC, SSC, and Railway examinations.",
                    "{\"Publisher\":\"Disha Publication\",\"Questions\":\"10,000+ Verified MCQs\",\"Pages\":\"980 Pages\",\"Format\":\"Paperback\"}",
                    new String[]{"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Pearson", "pearson-education", "https://upload.wikimedia.org/wikipedia/commons/3/30/Pearson_logo.svg", "Always Learning. Leading global educational publishing.",
                    "Pearson IIT Foundation Series Mathematics & Science Class 10 Combo", "pearson-iit-foundation-class-10-combo", "BOOK-PEAR-01",
                    899, 20, 60, 4.8, 190, "Builds solid conceptual clarity and advanced problem solving for JEE, NEET, and Olympiads.",
                    "Features graded exercises, concept maps, and tricky application-based problems that bridge school syllabus and entrance exams.",
                    "{\"Publisher\":\"Pearson Education\",\"Level\":\"Class 10 IIT-JEE / NEET Foundation\",\"Includes\":\"Maths + Science Volumes\"}",
                    new String[]{"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Rupa", "rupa-publications", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80", "Publishers of India's finest literature and memoirs.",
                    "Wings of Fire: An Autobiography of APJ Abdul Kalam", "wings-of-fire-apj-abdul-kalam", "BOOK-RUPA-01",
                    350, 20, 160, 4.9, 950, "The inspiring true story of a boy from Rameshwaram who became India's Missile Man and President.",
                    "Written with humility and profound wisdom. A timeless motivational blueprint for Indian students and aspiring scientists.",
                    "{\"Author\":\"Dr. A.P.J. Abdul Kalam & Arun Tiwari\",\"Pages\":\"180 Pages\",\"Publisher\":\"Universities Press / Rupa\"}",
                    new String[]{"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Scholastic", "scholastic", "https://upload.wikimedia.org/wikipedia/commons/2/22/Scholastic_logo.svg", "The Most Trusted Name in Learning.",
                    "Harry Potter and the Philosopher's Stone: Illustrated Edition by J.K. Rowling", "harry-potter-philosophers-stone-illustrated", "BOOK-SCHO-01",
                    1499, 20, 50, 4.9, 410, "Breathtaking full-color illustrated hardback edition brought to life by artist Jim Kay.",
                    "Experience J.K. Rowling's wizarding world with dazzling full-page artwork on premium art paper with ribbon bookmark.",
                    "{\"Author\":\"J.K. Rowling\",\"Illustrator\":\"Jim Kay\",\"Pages\":\"256 Pages Full Color\",\"Cover\":\"Hardbound with Dust Jacket\"}",
                    new String[]{"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"}),

            new BrandProductItem("books-stationery", "Kangaro", "kangaro", "https://upload.wikimedia.org/wikipedia/commons/a/ad/Kangaro_Staplers_Logo.png", "Stationery that stays put. Leading stapling instruments.",
                    "Kangaro Heavy Duty No. 10 Stapler with 1000 Staple Pins & Built-In Remover", "kangaro-no10-stapler-with-pins", "BOOK-KANG-01",
                    120, 10, 180, 4.8, 520, "All-metal steel chassis with plastic casing and quick-loading mechanism for 20-sheet binding.",
                    "India's household staple tool for offices, school projects, and legal documentation. Durable, jam-resistant, and ergonomic.",
                    "{\"Throat Depth\":\"52 mm\",\"Capacity\":\"Up to 20 Sheets\",\"Pins\":\"Uses No. 10 Staples\",\"Includes\":\"1000 Free Pins\"}",
                    new String[]{"https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"})
    );

    @Transactional
    public int seedDiverseCatalogWith20BrandsPerCategory() {
        System.out.println(">>> Starting seeding of Diverse Catalog with at least 20 distinct brands per category...");

        // Ensure Categories exist
        Map<String, Category> categoryMap = new HashMap<>();
        List<Category> allCategories = categoryRepository.findAll();
        for (Category c : allCategories) {
            categoryMap.put(c.getSlug(), c);
        }

        // Ensure Default Locations exist for inventory linkage
        Location defaultLocation = locationRepository.findAll().stream().findFirst().orElseGet(() -> {
            Location loc = new Location();
            loc.setName("Central Fulfillment Hub");
            loc.setCode("HUB-BLR-01");
            loc.setType(LocationType.CENTRAL_WAREHOUSE);
            loc.setAddress("Electronic City Phase 1");
            loc.setCity("Bengaluru");
            loc.setState("Karnataka");
            loc.setPostalCode("560100");
            loc.setCountry("India");
            loc.setContactPerson("Ravikant Singh");
            loc.setContactPhone("+91 9696675081");
            loc.setActive(true);
            return locationRepository.save(loc);
        });

        int seededBrands = 0;
        int seededProducts = 0;

        for (BrandProductItem item : catalogItems) {
            Category category = categoryMap.get(item.categorySlug);
            if (category == null) {
                category = new Category(
                        capitalizeWords(item.categorySlug.replace("-", " ")),
                        item.categorySlug,
                        "Category for " + item.categorySlug,
                        item.images.length > 0 ? item.images[0] : null,
                        "Package"
                );
                category = categoryRepository.save(category);
                categoryMap.put(item.categorySlug, category);
            }

            // Ensure Brand exists by name or slug
            Brand brand = brandRepository.findByNameIgnoreCase(item.brandName)
                    .or(() -> brandRepository.findBySlug(item.brandSlug))
                    .orElse(null);
            if (brand == null) {
                brand = new Brand(item.brandName, item.brandSlug, item.brandLogo, item.brandDesc);
                brand.setActive(true);
                brand = brandRepository.save(brand);
                seededBrands++;
            }

            // Ensure Product exists
            Product product = productRepository.findBySlug(item.productSlug).orElse(null);
            if (product == null) {
                product = new Product();
                product.setName(item.productName);
                product.setSlug(item.productSlug);
                product.setSku(item.sku);
                product.setPrice(BigDecimal.valueOf(item.price));
                product.setDiscountPercent(item.discount);
                product.setStockQuantity(item.stock);
                product.setShortDescription(item.shortDesc);
                product.setDescription(item.fullDesc);
                product.setSpecifications(item.specsJson);
                product.setCategory(category);
                product.setBrand(brand);
                product.setFeatured(true);
                product.setNewArrival(true);
                product.setBestSeller(true);
                product.setTrending(true);
                product.setAverageRating(item.rating);
                product.setReviewCount(item.reviewCount);
                product.setActive(true);
                if (item.images.length > 0) {
                    product.setPrimaryImageUrl(item.images[0]);
                }

                Product savedProduct = productRepository.save(product);
                seededProducts++;

                // Attach Product Images
                for (int i = 0; i < item.images.length; i++) {
                    productImageRepository.save(new ProductImage(item.images[i], i == 0, i, savedProduct));
                }

                // Attach Inventory
                try {
                    Inventory inv = new Inventory();
                    inv.setProduct(savedProduct);
                    inv.setLocation(defaultLocation);
                    inv.setQuantityOnHand(item.stock);
                    inv.setQuantityReserved(0);
                    inv.setQuantityAvailable(item.stock);
                    inv.setMinStockAlert(10);
                    inv.setBinRackNumber("RACK-" + item.categorySlug.substring(0, 3).toUpperCase() + "-" + (100 + (savedProduct.getId() % 900)));
                    inventoryRepository.save(inv);
                } catch (Exception ignored) {}
            } else {
                // If product already exists, ensure brand and category are accurately linked
                if (product.getBrand() == null || !product.getBrand().getId().equals(brand.getId())) {
                    product.setBrand(brand);
                    productRepository.save(product);
                }
            }
        }

        System.out.println(">>> Seeding Completed! Seeded Brands: " + seededBrands + ", Seeded Products: " + seededProducts);
        return seededProducts;
    }

    private String capitalizeWords(String str) {
        if (str == null || str.isEmpty()) return str;
        String[] words = str.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1).toLowerCase()).append(" ");
            }
        }
        return sb.toString().trim();
    }
}
