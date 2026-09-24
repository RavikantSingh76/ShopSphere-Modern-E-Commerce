package com.ecommerce.service;

import com.ecommerce.entity.Brand;
import com.ecommerce.entity.Category;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BulkProductService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    private final Random random = new Random();

    // Specific Structured Product Archetype
    public static class ProductArchetype {
        public String categorySlug;
        public String brandName;
        public String baseName;
        public String[] imagePool;
        public double minPrice;
        public double maxPrice;
        public String shortDesc;
        public String fullDesc;
        public String specsJson;

        public ProductArchetype(String categorySlug, String brandName, String baseName, String[] imagePool,
                                double minPrice, double maxPrice, String shortDesc, String fullDesc, String specsJson) {
            this.categorySlug = categorySlug;
            this.brandName = brandName;
            this.baseName = baseName;
            this.imagePool = imagePool;
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
            this.shortDesc = shortDesc;
            this.fullDesc = fullDesc;
            this.specsJson = specsJson;
        }
    }

    private final List<ProductArchetype> archetypes = Arrays.asList(
            // 1. Electronics: Flagship 5G Smartphones
            new ProductArchetype(
                    "electronics", "Apple",
                    "iPhone 15 Pro Max (256GB - Titanium)",
                    new String[]{
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
                    },
                    129900, 159900,
                    "Forged in titanium with industry-leading A17 Pro chip and 48MP Pro camera system.",
                    "Experience iPhone 15 Pro Max. Crafted with aerospace-grade titanium that's strong yet light. The innovative 48MP camera offers 5x optical zoom, and the A17 Pro chip powers next-level mobile gaming.\n\nKey Highlights:\n- 6.7-inch Super Retina XDR with ProMotion 120Hz\n- Titanium design with Ceramic Shield front\n- Action button for quick shortcuts\n- USB-C connectivity with USB 3 speeds",
                    "{\"Display\":\"6.7-inch Super Retina XDR OLED 120Hz\",\"Processor\":\"Apple A17 Pro 3nm\",\"Camera\":\"48MP Main + 12MP Ultra-Wide + 12MP 5x Telephoto\",\"Storage\":\"256GB NVMe\",\"Battery\":\"Up to 29 hours video playback\",\"OS\":\"iOS 17\"}"
            ),
            new ProductArchetype(
                    "electronics", "Samsung",
                    "Galaxy S24 Ultra AI 5G (512GB - Titanium Gray)",
                    new String[]{
                            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
                    },
                    119999, 139999,
                    "Galaxy AI powered flagship with 200MP camera and embedded S-Pen stylus.",
                    "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. Powered by Galaxy AI with Circle to Search, Live Translate, and Note Assist.\n\nHighlights:\n- 200MP Quad Telephoto Camera with 100x Space Zoom\n- Corning Gorilla Armor anti-reflective glass\n- Snapdragon 8 Gen 3 for Galaxy",
                    "{\"Display\":\"6.8-inch QHD+ Dynamic AMOLED 2X 120Hz\",\"Processor\":\"Snapdragon 8 Gen 3\",\"Camera\":\"200MP + 50MP + 12MP + 10MP\",\"RAM\":\"12GB LPDDR5X\",\"Storage\":\"512GB UFS 4.0\",\"Battery\":\"5000mAh 45W Fast Charging\"}"
            ),

            // 2. Electronics: Wireless ANC Headphones
            new ProductArchetype(
                    "electronics", "Sony",
                    "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
                    new String[]{
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
                    },
                    26990, 31990,
                    "Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer.",
                    "Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and crystal-clear hands-free calls.\n\nHighlights:\n- 30-hour battery life with quick charging (3 min = 3 hrs)\n- Specially developed 30mm carbon fiber driver\n- Ultra-comfortable, lightweight soft fit leather",
                    "{\"Driver Unit\":\"30mm Carbon Fiber Composite\",\"Noise Cancellation\":\"HD Noise Cancelling Processor QN1\",\"Battery Life\":\"30 Hours (NC ON) / 40 Hours (NC OFF)\",\"Bluetooth\":\"v5.2 (LDAC, AAC, SBC)\",\"Weight\":\"250g\"}"
            ),

            // 3. Electronics: Laptops
            new ProductArchetype(
                    "electronics", "Dell",
                    "Dell XPS 15 3.5K OLED Touch Laptop (Core i9, 32GB, 1TB SSD, RTX 4070)",
                    new String[]{
                            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
                    },
                    189900, 229900,
                    "Stunning 3.5K OLED InfinityEdge display powered by 13th Gen Intel Core i9 and RTX 4070.",
                    "The XPS 15 is crafted with CNC machined aluminum and carbon fiber palm rest. Featuring a vivid 3.5K OLED touch screen and NVIDIA GeForce RTX 4070 for intense creative workflows.\n\nHighlights:\n- 15.6-inch 3.5K (3456x2160) OLED Display\n- 32GB DDR5 4800MHz Dual-Channel RAM\n- Quad-speaker design with Waves Nx 3D audio",
                    "{\"Display\":\"15.6-inch 3.5K OLED Touch 400-nit\",\"CPU\":\"Intel Core i9-13900H (14 Cores)\",\"GPU\":\"NVIDIA GeForce RTX 4070 8GB GDDR6\",\"RAM\":\"32GB DDR5\",\"Storage\":\"1TB PCIe 4.0 NVMe SSD\",\"Weight\":\"1.92 kg\"}"
            ),

            // 4. Electronics: Smartwatches
            new ProductArchetype(
                    "electronics", "Apple",
                    "Apple Watch Ultra 2 GPS + Cellular (49mm Titanium Case)",
                    new String[]{
                            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
                    },
                    79900, 89900,
                    "The most rugged and capable Apple Watch. Designed for outdoor adventure and endurance athletes.",
                    "Apple Watch Ultra 2 features the bright S9 SiP display, Double Tap gesture, and precision dual-frequency GPS. Up to 36 hours of battery life with normal use and 72 hours in Low Power Mode.\n\nHighlights:\n- 49mm corrosion-resistant titanium case\n- 3000-nit Always-On Retina Display\n- Water resistant 100m with Depth gauge",
                    "{\"Case Size\":\"49mm Aerospace Titanium\",\"Display\":\"Always-On Retina 3000 nits Sapphire Crystal\",\"Battery Life\":\"36 Hours Normal / 72 Hours Low Power\",\"Water Resistance\":\"100m ISO 22810 & EN13319\",\"Connectivity\":\"GPS + Cellular 4G LTE\"}"
            ),

            // 5. Fashion: Running Shoes
            new ProductArchetype(
                    "fashion", "Nike",
                    "Nike Air Max 270 Athletic Cushion Running Shoes",
                    new String[]{
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80"
                    },
                    8995, 12995,
                    "Nike's iconic big heel Air unit delivers super-soft cushioning and modern street style.",
                    "The Nike Air Max 270 boasts the brand's biggest heel Air unit for plush bounce with every stride. Breathable engineered mesh keeps feet cool, while the stretchy inner sleeve creates a snug, glove-like fit.\n\nHighlights:\n- Max Air 270 unit delivers all-day comfort\n- Woven and synthetic fabric on upper provides lightweight feel\n- Solid rubber outsole for traction",
                    "{\"Upper Material\":\"Engineered Breathable Mesh\",\"Sole\":\"Dual-Density Foam with Max Air 270 Heel\",\"Closure\":\"Lace-Up\",\"Weight\":\"310g\",\"Ideal For\":\"Road Running & Lifestyle\"}"
            ),
            new ProductArchetype(
                    "fashion", "Adidas",
                    "Adidas Ultraboost Light Performance Road Running Shoes",
                    new String[]{
                            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80"
                    },
                    11999, 16999,
                    "Lightest Ultraboost ever featuring 30% lighter Light BOOST foam and PRIMEKNIT+ upper.",
                    "Experience epic energy return with adidas Ultraboost Light. Packed with innovative Light BOOST cushioning and Continental Better Rubber outsole for superior wet and dry grip.\n\nHighlights:\n- Light BOOST midsole for highest energy return\n- PRIMEKNIT+ textile upper hugs your foot\n- Linear Energy Push system boosts stability",
                    "{\"Midsole\":\"Light BOOST cushioning\",\"Upper\":\"PRIMEKNIT+ recycled textile\",\"Outsole\":\"Continental Better Rubber\",\"Drop\":\"10mm\",\"Closure\":\"Lace-Up\"}"
            ),

            // 6. Fashion: Apparel & Hoodies
            new ProductArchetype(
                    "fashion", "Puma",
                    "Puma Classics Relaxed Fit Heavyweight French Terry Hoodie",
                    new String[]{
                            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                    },
                    2499, 3999,
                    "Premium 100% French Terry cotton hoodie with kangaroo pocket and relaxed streetwear cut.",
                    "Cozy, clean, and durable. This pullover hoodie is crafted from heavyweight 380 GSM French Terry cotton. Features ribbed cuffs, drawstring hood, and an embroidered archive Puma logo.\n\nHighlights:\n- 100% Combed ringspun cotton\n- Pre-shrunk bio-washed fabric\n- Deep kangaroo front pocket",
                    "{\"Fabric\":\"100% French Terry Cotton (380 GSM)\",\"Fit\":\"Relaxed Drop-Shoulder\",\"Care\":\"Machine Wash Cold\",\"Origin\":\"Made in India\"}"
            ),

            // 7. Home & Living: Air Fryers & Kitchen
            new ProductArchetype(
                    "home-living", "Philips",
                    "Philips Digital Airfryer XL (6.2L Rapid Air Technology)",
                    new String[]{
                            "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"
                    },
                    7999, 12499,
                    "Healthier frying with up to 90% less fat, 14-in-1 cooking presets, and NutriU recipe app support.",
                    "The Philips Airfryer XL uses hot air to cook your favorite foods to crispy perfection with little or no added oil. Its 6.2L capacity is perfect for family-sized meals.\n\nHighlights:\n- Rapid Air Technology with unique starfish design\n- Digital Touchscreen with 7 preset programs\n- Dishwasher-safe removable basket",
                    "{\"Capacity\":\"6.2 Liters (1.2 kg)\",\"Power\":\"2000 Watts\",\"Technology\":\"Rapid Air Convection\",\"Temperature Range\":\"40°C - 200°C\",\"Warranty\":\"2 Years International\"}"
            ),
            new ProductArchetype(
                    "home-living", "Green Soul",
                    "Green Soul Monster Ultimate Ergonomic Gaming & Desk Chair",
                    new String[]{
                            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80"
                    },
                    14990, 18990,
                    "Heavy-duty ergonomic chair with breathable Spandex fabric and magnetic memory foam headrest.",
                    "Engineered for 12+ hours of comfortable sitting with dynamic lumbar support, 4D adjustable armrests, and 180-degree reclining mechanism on a reinforced metal frame.\n\nHighlights:\n- Breathable cool Spandex fabric upholstery\n- Heavy-duty Class 4 pneumatic gas lift\n- Supports weight up to 150 kg",
                    "{\"Material\":\"High-Density Moulded Foam + Spandex Fabric\",\"Armrests\":\"4D Carbon Texture Adjustable\",\"Base\":\"Heavy Duty Metal Base\",\"Weight Capacity\":\"150 kg\",\"Warranty\":\"3 Years Domestic\"}"
            ),

            // 8. Beauty & Personal Care: Skincare Serums & Trimmers
            new ProductArchetype(
                    "beauty-personal-care", "Philips",
                    "Philips Multigroom 7000 All-in-One Cordless Trimmer (19 Tools)",
                    new String[]{
                            "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80"
                    },
                    3495, 4995,
                    "DualCut self-sharpening blades with 5 hours of runtime on a single charge and 100% waterproof body.",
                    "Ultimate precision styling for face, head, and body. Includes 19 premium quality trimming attachments with DualCut technology for 2x more blades.\n\nHighlights:\n- Self-sharpening stainless steel blades\n- Up to 5 hours runtime with Li-ion battery\n- 100% Showerproof and easy to clean",
                    "{\"Blades\":\"DualCut Stainless Steel\",\"Battery\":\"Lithium-Ion (5 Hours Runtime)\",\"Waterproof\":\"100% Fully Washable\",\"Included Attachments\":\"19 Grooming Guards + Travel Pouch\"}"
            ),
            new ProductArchetype(
                    "beauty-personal-care", "Philips",
                    "Philips SkinProtect Botanical Glow Cleansing Serum & Care Kit",
                    new String[]{
                            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
                    },
                    899, 1799,
                    "High-strength botanical glow serum to reduce blemishes and boost natural skin brightness.",
                    "A potent water-based serum that boosts skin brightness, improves smoothness, and reinforces the skin barrier over time with 10% pure Niacinamide and Botanical Vitamin C.\n\nHighlights:\n- Targets textural irregularities and excess shine\n- Alcohol-free, oil-free, silicone-free, vegan & cruelty-free\n- Dermatologically tested",
                    "{\"Volume\":\"60ml / 2 fl. oz.\",\"Key Ingredients\":\"10% Niacinamide, Botanical Vitamin C, Zinc PCA\",\"Skin Type\":\"All Skin Types, Dermatologist Tested\",\"Formulation\":\"Water-Based Lightweight Serum\"}"
            ),

            // 9. Sports & Fitness: Dumbbells & Yoga Mats
            new ProductArchetype(
                    "sports-outdoors", "Puma",
                    "Puma Train Hexagon Pro High-Density Rubber Encased Dumbbell Set",
                    new String[]{
                            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
                    },
                    2999, 4999,
                    "Commercial grade cast iron core with anti-roll hexagonal rubber casing and knurled steel grip.",
                    "Built for intense strength workouts and home gym training. The hexagonal shape prevents dumbbells from rolling on the floor, while the knurled chrome handle provides a non-slip grip.\n\nHighlights:\n- Solid cast iron core with virgin rubber coating\n- Ergonomic contoured knurled grip\n- Floor protective and noise-dampening",
                    "{\"Weight\":\"20kg Pair (10kg x 2)\",\"Material\":\"Cast Iron with Rubber Coating\",\"Handle\":\"Contoured Knurled Chrome Steel\",\"Shape\":\"Hexagonal Anti-Roll\"}"
            ),
            new ProductArchetype(
                    "sports-outdoors", "Nike",
                    "Nike Move 6mm Non-Slip Dual-Sided High-Grip Exercise Yoga Mat",
                    new String[]{
                            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&auto=format&fit=crop&q=80"
                    },
                    1295, 2495,
                    "High-density 6mm TPE cushioning with anti-tear mesh and laser-aligned grip texture.",
                    "Superior joint protection and floor traction for yoga, pilates, stretching, and floor workouts. 100% non-toxic, biodegradable, and waterproof.\n\nHighlights:\n- 6mm high-density cushioning protects spine and knees\n- Dual-sided textured grip prevents slipping\n- Includes carrying strap for easy transport",
                    "{\"Dimensions\":\"72 x 24 inches (183 x 61 cm)\",\"Thickness\":\"6 mm\",\"Material\":\"Eco-Friendly High-Density TPE\",\"Weight\":\"950g\",\"Includes\":\"Free Carry Strap\"}"
            ),

            // 10. Books & Stationery: 10 Rs Products (Pen, Pencil, Eraser)
            new ProductArchetype(
                    "books-stationery", "Cello",
                    "Cello Butterflow Classic Blue Ballpoint Pen (0.7mm Fine Tip)",
                    new String[]{
                            "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80"
                    },
                    10, 10,
                    "Smooth writing 0.7mm ballpoint pen with Lubriflow ink system for effortless notes.",
                    "The Cello Butterflow Ballpoint Pen features ultra-low viscosity Lubriflow ink that glides across paper smoothly without smudging. Perfect for students, office work, and daily writing.\n\nHighlights:\n- 0.7mm fine Swiss tip for neat and clean handwriting\n- Comfortable elasto-grip for fatigue-free writing\n- Long-lasting ink capacity with leak-proof design",
                    "{\"Tip Size\":\"0.7 mm Swiss Carbide Tip\",\"Ink Color\":\"Classic Royal Blue\",\"Grip\":\"Soft Rubberized Elasto-Grip\",\"Body\":\"Transparent Hexagonal Barrel\"}"
            ),
            new ProductArchetype(
                    "books-stationery", "Apsara",
                    "Apsara Platinum Extra Dark HB Graphite Wood Pencil",
                    new String[]{
                            "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80"
                    },
                    10, 10,
                    "Superior bonded extra-dark HB lead pencil crafted with soft treated wood for easy sharpening.",
                    "Apsara Platinum Extra Dark pencils give dark, neat impressions that require less pressure while writing. Made with premium quality graphite bonded to prevent lead breakage during sharpening.\n\nHighlights:\n- Extra dark lead for distinct and readable writing\n- Soft wood casing ensures smooth and easy sharpening\n- Ideal for exams, drawing, sketching, and shading",
                    "{\"Grade\":\"HB Extra Dark Graphite\",\"Wood Type\":\"FSC Certified Soft Treated Cedar Wood\",\"Lead Diameter\":\"2.2 mm Break-Resistant\",\"Shape\":\"Hexagonal Easy-Grip\"}"
            ),
            new ProductArchetype(
                    "books-stationery", "Natraj",
                    "Natraj Non-Dust Premium Soft Clean Eraser (White)",
                    new String[]{
                            "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                    },
                    10, 10,
                    "Non-dust formula eraser that rolls up dust into strands for mess-free clean erasing.",
                    "Natraj Non-Dust Eraser is formulated with soft, premium quality polymer that gently lifts graphite marks without damaging delicate paper surfaces or smudging.\n\nHighlights:\n- Non-dust technology leaves no loose powder residue\n- Soft texture prevents paper tearing and scuff marks\n- Phthalate and latex free for safe everyday use",
                    "{\"Material\":\"Soft Polymer Non-Dust Rubber\",\"Color\":\"Pure White\",\"Pack Type\":\"Protective Cardboard Sleeve\",\"Dimensions\":\"40 x 18 x 12 mm\"}"
            ),
            new ProductArchetype(
                    "books-stationery", "Classmate",
                    "Digital Creator Pro Hardbound Productivity Journal & Planner",
                    new String[]{
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80"
                    },
                    499, 899,
                    "Premium 120 GSM bleed-proof dotted hardcover productivity journal for goal setting and focus.",
                    "Organize your thoughts, daily schedules, habits, and projects with this premium hardbound journal. Built with acid-free woodfree paper, dual ribbon bookmarks, and an expandable inner pocket.\n\nHighlights:\n- 240 Pages of 120 GSM thick ivory paper\n- Water-resistant vegan leather hardcover\n- Lies completely flat 180° for easy writing",
                    "{\"Pages\":\"240 Dotted Pages\",\"Paper Quality\":\"120 GSM Bleed-Proof Ivory Paper\",\"Cover\":\"Water-Resistant Vegan Hardcover\",\"Dimensions\":\"A5 (5.8 x 8.3 inches)\"}"
            ),

            // 11. Competitive Exam Books (SSC Advanced Math, Quantitative Aptitude, Reasoning)
            new ProductArchetype(
                    "books-stationery", "Rakesh Yadav Publication",
                    "Rakesh Yadav Class Notes of Advanced Maths",
                    new String[]{
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80"
                    },
                    340, 420,
                    "SSC CGL, CHSL, MTS aur CPO ke liye sabse zyada use ki jane wali advanced math ki standard book.",
                    "Rakesh Yadav Class Notes of Advanced Maths provides comprehensive handwritten class notes covering Arithmetic and Advanced Mathematics (Geometry, Trigonometry, Algebra, Mensuration) with bilingual explanations and shortcut tricks for SSC CGL, CHSL, CPO, MTS, and Railway examinations.\n\nWriter: Rakesh Yadav\n\nHighlights:\n- Comprehensive handwritten solutions with step-by-step logic\n- Shortcut methods specifically designed for time-management in SSC exams\n- Bilingual content (Hindi & English medium supported)\n- Covers all previous year question patterns.",
                    "{\"Author\":\"Rakesh Yadav\",\"Subject\":\"Advanced Mathematics\",\"Target Exams\":\"SSC CGL, CHSL, CPO, MTS, Railways\",\"Language\":\"Bilingual (Hindi & English)\",\"Publisher\":\"Rakesh Yadav Readers Publication\",\"Pages\":\"480 Pages\",\"Binding\":\"Paperback\"}"
            ),
            new ProductArchetype(
                    "books-stationery", "S. Chand Publishing",
                    "Quantitative Aptitude for Competitive Examinations by R.S. Aggarwal",
                    new String[]{
                            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"
                    },
                    550, 680,
                    "SSC aur banking exams ke basic concepts aur shortcut tricks clear karne ke liye sabse behtareen book.",
                    "Quantitative Aptitude for Competitive Examinations by Dr. R.S. Aggarwal is India's most trusted comprehensive guide for SSC CGL, Bank PO, SBI, IBPS, RBI, CAT, and Civil Services aptitude tests. Covers more than 5500 practice questions with detailed step-by-step illustrations.\n\nWriter: R.S. Aggarwal\n\nHighlights:\n- 5500+ Fully solved questions with shortcut solutions\n- Comprehensive theory covering Arithmetic, Algebra, Number System & Geometry\n- Level-wise practice sets from basic to advanced\n- Updated syllabus pattern.",
                    "{\"Author\":\"Dr. R.S. Aggarwal\",\"Subject\":\"Quantitative Aptitude & Mathematics\",\"Target Exams\":\"SSC, Banking (IBPS/SBI), Railways, CAT, CDS\",\"Language\":\"English / Hindi Available\",\"Publisher\":\"S. Chand Publishing\",\"Pages\":\"920 Pages\",\"Edition\":\"Revised & Updated\"}"
            ),
            new ProductArchetype(
                    "books-stationery", "S. Chand Publishing",
                    "A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal",
                    new String[]{
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"
                    },
                    590, 720,
                    "Reasoning ke sabhi chapters (Logical, Analytical, Verbal) ke practice questions ke liye best source.",
                    "A Modern Approach to Verbal & Non-Verbal Reasoning by Dr. R.S. Aggarwal is the definitive benchmark book for mastering analytical ability, syllogisms, blood relations, series completion, coding-decoding, spatial reasoning, and non-verbal patterns for SSC, Banking, MBA, and UPSC CSAT.\n\nWriter: R.S. Aggarwal\n\nHighlights:\n- Complete coverage of Verbal, Analytical, and Non-Verbal reasoning\n- Thousands of model questions with illustrative explanations\n- Quick-solving shortcut tricks for high scoring\n- Previous year solved papers included.",
                    "{\"Author\":\"Dr. R.S. Aggarwal\",\"Subject\":\"Verbal & Non-Verbal Reasoning\",\"Target Exams\":\"SSC CGL/CHSL, Bank PO/Clerk, LIC, UPSC, Railways\",\"Language\":\"English\",\"Publisher\":\"S. Chand Publishing\",\"Pages\":\"1200 Pages\",\"Format\":\"Paperback\"}"
            ),

            // 12. Notebooks & Registers (A4 Spiral, Classmate A4)
            new ProductArchetype(
                    "books-stationery", "Classmate",
                    "Digital Creator Pro Hardbound Productivity Journal & Planner (A4 Spiral)",
                    new String[]{
                            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80"
                    },
                    350, 480,
                    "Notes banane, rough work ya daily practice ke liye durable hardbound A4 spiral copy.",
                    "Engineered for intense daily study, competitive exam practice, and project planning. Features twin-wire snag-free metal spiral binding, water-resistant hardbound covers, and ultra-thick 120 GSM bleed-proof ivory paper that handles fountain pens and gel ink effortlessly.\n\nType: A4 Spiral Notebook / Journal\n\nHighlights:\n- Twin-wire 360-degree lay-flat A4 spiral binding\n- 240 Pages of premium 120 GSM micro-perforated sheets\n- Includes daily goal planner, habit tracker, and index section\n- Heavy duty durable hardboard cover.",
                    "{\"Type\":\"A4 Spiral Bound Notebook & Planner\",\"Paper Quality\":\"120 GSM Bleed-Proof Ivory Sheets\",\"Pages\":\"240 Pages (120 Sheets)\",\"Ruling\":\"Dotted / Grid Hybrid for Problem Solving\",\"Binding\":\"Twin-Loop Metal Wire-O Spiral\",\"Cover\":\"Laminated Hardbound\"}"
            ),
            new ProductArchetype(
                    "books-stationery", "Classmate",
                    "Classmate A4 Notebook - Simple Soft Cover (Unruled/Ruled)",
                    new String[]{
                            "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
                    },
                    75, 95,
                    "Regular college notes aur practice ke liye clean aur smooth pages wali simple notebook.",
                    "Classmate A4 Notebooks feature ultra-smooth, elemental chlorine-free (Ozone treated) bright white paper that ensures frictionless fast handwriting. Designed with pin binding and attractive soft covers with informative trivia on the back.\n\nType: Simple Notebook\n\nHighlights:\n- Whiter, brighter, and smoother paper for effortless writing\n- High-strength pin binding with corner rounding to prevent dog-earing\n- Ideal for math rough work, coaching notes, and exam practice\n- Pack contains page marker and index page.",
                    "{\"Brand\":\"Classmate (ITC)\",\"Size\":\"A4 (29.7 cm x 21.0 cm)\",\"Pages\":\"172 Pages\",\"Paper Weight\":\"70 GSM Elemental Chlorine Free\",\"Ruling\":\"Single Ruled / Unruled Options\",\"Binding\":\"Center Stapled Soft Cover\"}"
            )
    );

    @Transactional
    public int seedBulkProducts(int targetCount) {
        List<Category> categories = categoryRepository.findAll();
        List<Brand> brands = brandRepository.findAll();

        Map<String, Category> categoryMap = new HashMap<>();
        for (Category c : categories) {
            categoryMap.put(c.getSlug(), c);
        }

        Map<String, Brand> brandMap = new HashMap<>();
        for (Brand b : brands) {
            brandMap.put(b.getName().toLowerCase(), b);
        }

        long currentCount = productRepository.count();
        int itemsToGenerate = targetCount;

        String insertSql = "INSERT INTO products (" +
                "name, slug, short_description, description, price, discount_percent, stock_quantity, sku, " +
                "category_id, brand_id, featured, is_new_arrival, is_best_seller, is_trending, average_rating, " +
                "review_count, specifications, active, created_at, updated_at, primary_image_url" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        int batchSize = 1000;
        List<Object[]> batchArgs = new ArrayList<>(batchSize);
        int totalInserted = 0;
        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        String[] colorVariations = {"Space Gray", "Midnight Black", "Arctic White", "Deep Blue", "Emerald Green", "Titanium Silver", "Sunset Gold", "Stealth Black"};

        for (int i = 1; i <= itemsToGenerate; i++) {
            long uniqueId = currentCount + i;
            ProductArchetype arch = archetypes.get(random.nextInt(archetypes.size()));

            Category category = categoryMap.getOrDefault(arch.categorySlug, categories.get(0));
            Brand brand = brandMap.get(arch.brandName.toLowerCase());

            String color = colorVariations[random.nextInt(colorVariations.length)];
            String name = arch.baseName + " (" + color + ", Edition " + (2025 + (uniqueId % 2)) + ")";
            String slug = (arch.baseName + "-" + color + "-" + uniqueId).toLowerCase().replaceAll("[^a-z0-9]+", "-");
            String sku = "SKU-" + arch.brandName.toUpperCase().substring(0, Math.min(4, arch.brandName.length())) + "-" + (100000 + (uniqueId % 900000));

            double basePrice;
            if (arch.minPrice <= 50) {
                basePrice = arch.minPrice;
            } else {
                double rawPrice = arch.minPrice + (random.nextDouble() * (arch.maxPrice - arch.minPrice));
                basePrice = Math.max(10.0, Math.round(rawPrice / 50.0) * 50.0);
            }

            int discount = random.nextInt(100) < 65 ? (5 + random.nextInt(8) * 5) : 0; // 5% to 40%
            int stock = 10 + random.nextInt(120);

            boolean featured = random.nextInt(100) < 15;
            boolean newArrival = random.nextInt(100) < 20;
            boolean bestSeller = random.nextInt(100) < 18;
            boolean trending = random.nextInt(100) < 15;

            double rating = 4.1 + (random.nextInt(9) * 0.1); // 4.1 to 4.9 high quality rating
            int reviewCount = 15 + random.nextInt(350);

            String image = arch.imagePool[random.nextInt(arch.imagePool.length)];

            batchArgs.add(new Object[]{
                    name,
                    slug,
                    arch.shortDesc,
                    arch.fullDesc,
                    BigDecimal.valueOf(basePrice),
                    discount,
                    stock,
                    sku,
                    category.getId(),
                    brand != null ? brand.getId() : null,
                    featured,
                    newArrival,
                    bestSeller,
                    trending,
                    Math.round(rating * 10.0) / 10.0,
                    reviewCount,
                    arch.specsJson,
                    true,
                    now,
                    now,
                    image
            });

            if (batchArgs.size() == batchSize) {
                jdbcTemplate.batchUpdate(insertSql, batchArgs);
                totalInserted += batchArgs.size();
                batchArgs.clear();
            }
        }

        if (!batchArgs.isEmpty()) {
            jdbcTemplate.batchUpdate(insertSql, batchArgs);
            totalInserted += batchArgs.size();
            batchArgs.clear();
        }

        return totalInserted;
    }

    @Transactional
    public int resetAndReseedAccurateCatalog(int totalCount) {
        // Delete all products except order items references or clear and reseed
        try {
            jdbcTemplate.execute("DELETE FROM product_images");
            jdbcTemplate.execute("DELETE FROM reviews");
            jdbcTemplate.execute("DELETE FROM cart_items");
            jdbcTemplate.execute("DELETE FROM wishlist_items");
            // Delete products that are not bound to orders
            jdbcTemplate.execute("DELETE FROM products WHERE id NOT IN (SELECT product_id FROM order_items WHERE product_id IS NOT NULL)");
        } catch (Exception e) {
            System.err.println("Notice during cleanup: " + e.getMessage());
        }

        return seedBulkProducts(totalCount);
    }

    @Transactional
    public int purgeRandomProducts() {
        try {
            try { jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0"); } catch (Exception ignored) {}

            try { jdbcTemplate.execute("DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM reviews WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM cart_items WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM wishlist_items WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM inventory_transactions WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM inventory WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM inventories WHERE product_id IN (SELECT id FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%')"); } catch (Exception ignored) {}

            int deleted = jdbcTemplate.update("DELETE FROM products WHERE sku LIKE 'SKU-%' OR name LIKE '%Edition 202%'");
            System.out.println(">>> Purged " + deleted + " random products from database.");

            // Clean up any random edition suffixes from existing order items so top sellers only show authentic names
            cleanOrderItemNames();

            try { jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1"); } catch (Exception ignored) {}
            return deleted;
        } catch (Exception e) {
            System.err.println("Error purging random products: " + e.getMessage());
            try { jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1"); } catch (Exception ignored) {}
            return 0;
        }
    }

    @Transactional
    public void cleanOrderItemNames() {
        try {
            List<Map<String, Object>> items = jdbcTemplate.queryForList("SELECT id, product_name FROM order_items WHERE product_name LIKE '%Edition 202%'");
            for (Map<String, Object> item : items) {
                Long id = ((Number) item.get("id")).longValue();
                String pName = (String) item.get("product_name");
                if (pName != null) {
                    String cleaned = pName.replaceAll(" \\([^)]*Edition 202[0-9]\\)", "").trim();
                    jdbcTemplate.update("UPDATE order_items SET product_name = ? WHERE id = ?", cleaned, id);
                }
            }
        } catch (Exception ignored) {}
    }

    @Transactional
    public int resetAllOrders() {
        try {
            try { jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0"); } catch (Exception ignored) {}

            try { jdbcTemplate.execute("DELETE FROM inventory_transactions"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM payments"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE FROM order_items"); } catch (Exception ignored) {}
            int count = jdbcTemplate.update("DELETE FROM orders");

            try { jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1"); } catch (Exception ignored) {}
            return count;
        } catch (Exception e) {
            System.err.println("Error resetting orders: " + e.getMessage());
            try { jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1"); } catch (Exception ignored) {}
            return 0;
        }
    }

    @Transactional
    public void repairAndAlignAllProductImages() {
        try {
            // 1. Shoes & Footwear
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%nike air max%' OR LOWER(name) LIKE '%air max 270%' OR LOWER(name) LIKE '%pegasus%' OR (LOWER(name) LIKE '%nike%' AND (LOWER(name) LIKE '%shoe%' OR LOWER(name) LIKE '%running%'))");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%ultraboost%' OR (LOWER(name) LIKE '%adidas%' AND (LOWER(name) LIKE '%shoe%' OR LOWER(name) LIKE '%running%'))");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80' WHERE (LOWER(name) LIKE '%running shoe%' OR LOWER(name) LIKE '%sneaker%' OR LOWER(name) LIKE '%footwear%') AND primary_image_url NOT LIKE '%photo-1542291026-7eec264c27ff%' AND primary_image_url NOT LIKE '%photo-1584735935682-2f2b69dff9d2%'");

            // 2. Apparel / Hoodies
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%hoodie%' OR LOWER(name) LIKE '%pullover%' OR LOWER(name) LIKE '%sweatshirt%' OR LOWER(name) LIKE '%crewneck%' OR (LOWER(name) LIKE '%terry%' AND LOWER(name) NOT LIKE '%mat%')");

            // 3. Smartwatches
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%watch%' OR LOWER(name) LIKE '%smartwatch%'");

            // 4. Smartphones (iPhone & Samsung Galaxy)
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%iphone%'");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%galaxy s24%' OR LOWER(name) LIKE '%samsung galaxy%' OR (LOWER(name) LIKE '%smartphone%' AND LOWER(name) NOT LIKE '%iphone%')");

            // 5. Laptops & Computers
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%dell xps%' OR LOWER(name) LIKE '%xps 15%'");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' WHERE (LOWER(name) LIKE '%macbook%' OR LOWER(name) LIKE '%laptop%') AND primary_image_url NOT LIKE '%photo-1593642632823-8f785ba67e45%'");

            // 6. Headphones & Audio
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%headphone%' OR LOWER(name) LIKE '%earbud%' OR LOWER(name) LIKE '%wh-1000xm5%' OR LOWER(name) LIKE '%airpod%' OR LOWER(name) LIKE '%earphone%'");

            // 7. Dumbbells & Gym Strength Weights
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%dumbbell%' OR LOWER(name) LIKE '%barbell%' OR LOWER(name) LIKE '%kettlebell%' OR LOWER(name) LIKE '%gym weight%' OR LOWER(name) LIKE '%cast iron dumbbell%'");

            // 8. Yoga & Fitness Exercise Mats
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%yoga mat%' OR LOWER(name) LIKE '%exercise mat%' OR (LOWER(name) LIKE '%yoga%' AND LOWER(name) LIKE '%mat%')");

            // 9. Airfryers & Kitchen
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%airfryer%' OR LOWER(name) LIKE '%air fryer%' OR LOWER(name) LIKE '%rapid air%'");

            // 10. Chairs & Furniture
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%chair%' OR LOWER(name) LIKE '%armchair%' OR LOWER(name) LIKE '%desk chair%' OR LOWER(name) LIKE '%gaming chair%'");

            // 11. Candles
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%candle%' OR LOWER(name) LIKE '%aromatherapy%'");

            // 12. Trimmers & Grooming
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%trimmer%' OR LOWER(name) LIKE '%multigroom%' OR LOWER(name) LIKE '%shaver%'");

            // 13. Skincare & Serums
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%serum%' OR LOWER(name) LIKE '%niacinamide%' OR LOWER(name) LIKE '%brightening face%'");

            // 14. Pens
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%butterflow%' OR LOWER(name) LIKE '%ballpoint pen%' OR (LOWER(name) LIKE '%cello%' AND LOWER(name) LIKE '%pen%')");

            // 15. Pencils
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%pencil%' OR LOWER(name) LIKE '%apsara%'");

            // 16. Erasers
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%eraser%' OR LOWER(name) LIKE '%natraj%'");

            // 17. Books & Journals
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%atomic habits%' OR LOWER(name) LIKE '%rakesh yadav%'");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%quantitative aptitude%' OR (LOWER(name) LIKE '%aggarwal%' AND LOWER(name) LIKE '%aptitude%')");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%reasoning%' OR (LOWER(name) LIKE '%aggarwal%' AND LOWER(name) LIKE '%verbal%')");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%spiral%' OR LOWER(name) LIKE '%planner%' OR LOWER(name) LIKE '%productivity journal%'");
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80' WHERE LOWER(name) LIKE '%classmate%' OR (LOWER(name) LIKE '%notebook%' AND LOWER(name) LIKE '%soft cover%')");

            // Global 404 URL Purge across products & product_images tables
            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80' WHERE primary_image_url LIKE '%photo-1585336261026%'");
            jdbcTemplate.execute("UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80' WHERE image_url LIKE '%photo-1585336261026%'");

            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' WHERE primary_image_url LIKE '%photo-1578768079052%'");
            jdbcTemplate.execute("UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' WHERE image_url LIKE '%photo-1578768079052%'");

            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80' WHERE primary_image_url LIKE '%photo-1608248597359%'");
            jdbcTemplate.execute("UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80' WHERE image_url LIKE '%photo-1608248597359%'");

            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&auto=format&fit=crop&q=80' WHERE primary_image_url LIKE '%photo-1602874801007%'");
            jdbcTemplate.execute("UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&auto=format&fit=crop&q=80' WHERE image_url LIKE '%photo-1602874801007%'");

            jdbcTemplate.execute("UPDATE products SET primary_image_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80' WHERE primary_image_url LIKE '%photo-1580481077198%'");
            jdbcTemplate.execute("UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80' WHERE image_url LIKE '%photo-1580481077198%'");

            System.out.println(">>> Verified and aligned all product image mappings across the entire database!");
        } catch (Exception e) {
            System.err.println("Notice during image alignment: " + e.getMessage());
        }
    }
}
