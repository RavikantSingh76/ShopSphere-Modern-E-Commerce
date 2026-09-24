package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.ecommerce.service.BulkProductService bulkProductService;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private CatalogDiverseBrandsSeeder catalogDiverseBrandsSeeder;

    @Autowired
    private com.ecommerce.service.DeliveryPartnerService deliveryPartnerService;

    @org.springframework.beans.factory.annotation.Value("${app.seed-sample-data:false}")
    private boolean seedSampleData;

    @org.springframework.beans.factory.annotation.Value("${app.demo.admin-email:${DEMO_ADMIN_EMAIL:ravikantsinghravi366@gmail.com}}")
    private String demoAdminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.demo.admin-password:${DEMO_ADMIN_PASSWORD:}}")
    private String demoAdminPassword;

    @org.springframework.beans.factory.annotation.Value("${app.demo.customer-email:${DEMO_CUSTOMER_EMAIL:customer@ecommerce.com}}")
    private String demoCustomerEmail;

    @org.springframework.beans.factory.annotation.Value("${app.demo.customer-password:${DEMO_CUSTOMER_PASSWORD:}}")
    private String demoCustomerPassword;

    @org.springframework.beans.factory.annotation.Value("${app.demo.manager-email:${DEMO_MANAGER_EMAIL:manager.ravi@ecommerce.com}}")
    private String demoManagerEmail;

    @org.springframework.beans.factory.annotation.Value("${app.demo.manager-password:${DEMO_MANAGER_PASSWORD:}}")
    private String demoManagerPassword;

    @org.springframework.beans.factory.annotation.Value("${app.demo.vendor-email:${DEMO_VENDOR_EMAIL:vendor.ravi@ecommerce.com}}")
    private String demoVendorEmail;

    @org.springframework.beans.factory.annotation.Value("${app.demo.vendor-password:${DEMO_VENDOR_PASSWORD:}}")
    private String demoVendorPassword;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE orders ALTER COLUMN payment_method SET DATA TYPE VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE payments ALTER COLUMN method SET DATA TYPE VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN role SET DATA TYPE VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE orders ALTER COLUMN order_status SET DATA TYPE VARCHAR(50)");

            // Drop any legacy check constraints on orders and users
            try {
                List<String> orderConstraints = jdbcTemplate.queryForList(
                    "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.CONSTRAINTS WHERE TABLE_NAME = 'ORDERS' AND CONSTRAINT_TYPE = 'CHECK'",
                    String.class);
                for (String c : orderConstraints) {
                    try {
                        jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS " + c);
                    } catch (Exception ignored) {}
                }
            } catch (Exception ignored) {}

            try {
                jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS CONSTRAINT_4C");
            } catch (Exception ignored) {}
        } catch (Exception ignored) {}

        // Ensure Admin user is updated/created only if configured
        if (demoAdminEmail != null && !demoAdminEmail.isBlank() && demoAdminPassword != null && !demoAdminPassword.isBlank()) {
            var adminOpt = userRepository.findByEmail("admin@ecommerce.com");
            if (adminOpt.isPresent()) {
                User existingAdmin = adminOpt.get();
                existingAdmin.setEmail(demoAdminEmail);
                existingAdmin.setName("Ravikant Singh");
                existingAdmin.setAvatarUrl("/admin-avatar.jpeg");
                userRepository.save(existingAdmin);
            }

            var raviOpt = userRepository.findByEmail(demoAdminEmail);
            if (raviOpt.isEmpty()) {
                User admin = new User("Ravikant Singh", demoAdminEmail, passwordEncoder.encode(demoAdminPassword), Role.ROLE_ADMIN);
                admin.setPhone("+91 9696675081");
                admin.setAvatarUrl("/admin-avatar.jpeg");
                userRepository.save(admin);
            } else {
                User ravi = raviOpt.get();
                ravi.setAvatarUrl("/admin-avatar.jpeg");
                ravi.setName("Ravikant Singh");
                ravi.setPhone("+91 9696675081");
                userRepository.save(ravi);
            }
        }

        // Seed Store Operations Manager if configured
        if (demoManagerEmail != null && !demoManagerEmail.isBlank() && demoManagerPassword != null && !demoManagerPassword.isBlank()) {
            var mgrOpt = userRepository.findByEmail(demoManagerEmail);
            if (mgrOpt.isEmpty()) {
                User manager = new User("Ravikant Singh", demoManagerEmail, passwordEncoder.encode(demoManagerPassword), Role.ROLE_MANAGER);
                manager.setPhone("+91 9696675081");
                manager.setAvatarUrl("/admin-avatar.jpeg");
                userRepository.save(manager);
            }
        }

        // Seed Certified Vendor & Manufacturer if configured
        if (demoVendorEmail != null && !demoVendorEmail.isBlank() && demoVendorPassword != null && !demoVendorPassword.isBlank()) {
            var vendorOpt = userRepository.findByEmail(demoVendorEmail);
            if (vendorOpt.isEmpty()) {
                User vendor = new User("Ravikant Singh", demoVendorEmail, passwordEncoder.encode(demoVendorPassword), Role.ROLE_VENDOR);
                vendor.setPhone("+91 9696675081");
                vendor.setAvatarUrl("/admin-avatar.jpeg");
                userRepository.save(vendor);
            }
        }

        // Seed Default Demo Customer if configured
        if (demoCustomerEmail != null && !demoCustomerEmail.isBlank() && demoCustomerPassword != null && !demoCustomerPassword.isBlank()) {
            var custOpt = userRepository.findByEmail(demoCustomerEmail);
            if (custOpt.isEmpty()) {
                User customer = new User("Rahul Sharma", demoCustomerEmail, passwordEncoder.encode(demoCustomerPassword), Role.ROLE_CUSTOMER);
                customer.setPhone("+91 9123456780");
                customer.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
                userRepository.save(customer);
            }
        }

        // Seed 20+ authentic brands and products per category if catalog has fewer than 120 items
        if (productRepository.count() < 120) {
            System.out.println(">>> Catalog has fewer than 120 items. Seeding 20+ authentic brands per category...");
            catalogDiverseBrandsSeeder.seedDiverseCatalogWith20BrandsPerCategory();
        }

        // Initialize comprehensive multi-city and express delivery fleet
        try {
            deliveryPartnerService.seedDeliveryFleetNetwork();
            System.out.println(">>> Delivery Fleet Network initialized with regional & express hubs!");
        } catch (Exception e) {
            System.err.println(">>> Warning: Delivery fleet initialization: " + e.getMessage());
        }

        if (!seedSampleData) {
            System.out.println(">>> Sample data seeding is DISABLED (app.seed-sample-data=false).");
            System.out.println(">>> App will only use authentic data from the connected database without inserting any random/dummy data.");
            if (demoAdminEmail != null && !demoAdminEmail.isBlank()) {
                System.out.println(">>> Admin account ready: " + demoAdminEmail);
            }
            return;
        }

        String targetCustEmail = (demoCustomerEmail != null && !demoCustomerEmail.isBlank()) ? demoCustomerEmail : "customer@ecommerce.com";
        String targetCustPass = (demoCustomerPassword != null && !demoCustomerPassword.isBlank()) ? demoCustomerPassword : java.util.UUID.randomUUID().toString();
        User customer = userRepository.findByEmail(targetCustEmail).orElseGet(() -> {
            User c = new User("Rahul Sharma", targetCustEmail, passwordEncoder.encode(targetCustPass), Role.ROLE_CUSTOMER);
            c.setPhone("+91 9123456780");
            c.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
            c = userRepository.save(c);

            // Seed Customer Address
            Address address = new Address();
            address.setUser(c);
            address.setFullName("Rahul Sharma");
            address.setPhone("+91 9123456780");
            address.setStreetAddress("Flat 402, Sunshine Residency, Outer Ring Road");
            address.setApartment("Sunshine Residency");
            address.setCity("Bengaluru");
            address.setState("Karnataka");
            address.setPostalCode("560103");
            address.setCountry("India");
            address.setDefault(true);
            addressRepository.save(address);
            return c;
        });

        // Seed Delivery Partner Fleet if empty
        if (deliveryPartnerRepository.count() == 0) {
            deliveryPartnerRepository.save(new DeliveryPartner("Ramesh Kumar", "+91 9811223344", "ramesh.delivery@ecommerce.com", "KA-01-EQ-9124", "Hero Splendor Plus (Bike)", "Bengaluru Central"));
            deliveryPartnerRepository.save(new DeliveryPartner("Amit Patel", "+91 9822334455", "amit.delivery@ecommerce.com", "KA-03-MB-4512", "Honda Activa 6G (Scooter)", "Koramangala / Indiranagar"));
            deliveryPartnerRepository.save(new DeliveryPartner("Suresh Verma", "+91 9833445566", "suresh.delivery@ecommerce.com", "KA-05-ZX-7890", "Ather 450X (EV Electric)", "Whitefield / HSR Layout"));
            deliveryPartnerRepository.save(new DeliveryPartner("Vikram Singh", "+91 9844556677", "vikram.delivery@ecommerce.com", "KA-04-HY-3311", "TVS Raider 125 (Bike)", "Electronic City / Outer Ring Road"));
            deliveryPartnerRepository.save(new DeliveryPartner("Priya Sharma", "+91 9855667788", "priya.delivery@ecommerce.com", "KA-02-AB-6721", "Ola S1 Pro (EV Electric)", "Malleshwaram / Rajajinagar"));
            System.out.println(">>> Seeded 5 Active Delivery Fleet Personnel!");
        }

        // 2. Seed / Fetch Categories
        Category catElectronics = categoryRepository.findBySlug("electronics").orElseGet(() -> categoryRepository.save(new Category("Electronics", "electronics", "Latest gadgets, smartphones, laptops and smart accessories", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80", "Smartphone")));
        Category catFashion = categoryRepository.findBySlug("fashion").orElseGet(() -> categoryRepository.save(new Category("Fashion & Apparel", "fashion", "Trendy clothing, footwear and stylish accessories for all", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80", "Shirt")));
        Category catHome = categoryRepository.findBySlug("home-living").orElseGet(() -> categoryRepository.save(new Category("Home & Living", "home-living", "Modern furniture, kitchen appliances and elegant home decor", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80", "Home")));
        Category catBeauty = categoryRepository.findBySlug("beauty-personal-care").orElseGet(() -> categoryRepository.save(new Category("Beauty & Personal Care", "beauty-personal-care", "Premium skincare, grooming, makeup and fragrances", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80", "Sparkles")));
        Category catSports = categoryRepository.findBySlug("sports-outdoors").orElseGet(() -> categoryRepository.save(new Category("Sports & Fitness", "sports-outdoors", "Activewear, gym equipment, yoga mats and outdoor gear", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80", "Dumbbell")));
        Category catBooks = categoryRepository.findBySlug("books-stationery").orElseGet(() -> categoryRepository.save(new Category("Books & Stationery", "books-stationery", "Best-selling novels, self-development books and premium stationery", "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80", "BookOpen")));

        // 3. Seed / Fetch Brands
        Brand brandApple = brandRepository.findBySlug("apple").orElseGet(() -> brandRepository.save(new Brand("Apple", "apple", "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", "Think Different. Premium consumer electronics.")));
        Brand brandSamsung = brandRepository.findBySlug("samsung").orElseGet(() -> brandRepository.save(new Brand("Samsung", "samsung", "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", "Do what you can't. Global technology leader.")));
        Brand brandSony = brandRepository.findBySlug("sony").orElseGet(() -> brandRepository.save(new Brand("Sony", "sony", "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg", "Be Moved. High fidelity audio and visuals.")));
        Brand brandNike = brandRepository.findBySlug("nike").orElseGet(() -> brandRepository.save(new Brand("Nike", "nike", "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", "Just Do It. Athletic footwear and apparel.")));
        Brand brandAdidas = brandRepository.findBySlug("adidas").orElseGet(() -> brandRepository.save(new Brand("Adidas", "adidas", "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", "Impossible Is Nothing. Iconic sportswear brand.")));
        Brand brandDell = brandRepository.findBySlug("dell").orElseGet(() -> brandRepository.save(new Brand("Dell", "dell", "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg", "Powering enterprise and personal computing.")));
        Brand brandPhilips = brandRepository.findBySlug("philips").orElseGet(() -> brandRepository.save(new Brand("Philips", "philips", "https://upload.wikimedia.org/wikipedia/commons/b/b2/Philips_logo.svg", "Innovation and you. Home & personal grooming.")));
        Brand brandPuma = brandRepository.findBySlug("puma").orElseGet(() -> brandRepository.save(new Brand("Puma", "puma", "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg", "Forever Faster. Sport and street lifestyle.")));

        Brand brandCello = brandRepository.findBySlug("cello").orElseGet(() -> brandRepository.save(new Brand("Cello", "cello", "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cello_Pens_Logo.png", "Joy of writing. Smooth and reliable ballpoint pens.")));
        Brand brandApsara = brandRepository.findBySlug("apsara").orElseGet(() -> brandRepository.save(new Brand("Apsara", "apsara", "https://upload.wikimedia.org/wikipedia/commons/6/64/Hindustan_Pencils_Logo.png", "Extra dark and smooth writing pencils and art supplies.")));
        Brand brandNatraj = brandRepository.findBySlug("natraj").orElseGet(() -> brandRepository.save(new Brand("Natraj", "natraj", "https://upload.wikimedia.org/wikipedia/commons/6/64/Hindustan_Pencils_Logo.png", "Durable and non-dust stationery essentials.")));
        Brand brandClassmate = brandRepository.findBySlug("classmate").orElseGet(() -> brandRepository.save(new Brand("Classmate", "classmate", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Classmate_logo.svg/1200px-Classmate_logo.svg.png", "India's No.1 Notebook Brand by ITC.")));
        Brand brandRakeshYadav = brandRepository.findBySlug("rakesh-yadav-readers-publication").orElseGet(() -> brandRepository.save(new Brand("Rakesh Yadav Publication", "rakesh-yadav-readers-publication", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80", "SSC & Government Exam Preparatory Books.")));
        Brand brandSChand = brandRepository.findBySlug("s-chand-publishing").orElseGet(() -> brandRepository.save(new Brand("S. Chand Publishing", "s-chand-publishing", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=150&auto=format&fit=crop&q=80", "Standard reference books by R.S. Aggarwal and academic authors.")));
        Brand brandGreenSoul = brandRepository.findBySlug("green-soul").orElseGet(() -> brandRepository.save(new Brand("Green Soul", "green-soul", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&auto=format&fit=crop&q=80", "India's leading ergonomic gaming and work chairs.")));
        Brand brandPenguin = brandRepository.findBySlug("penguin-random-house").orElseGet(() -> brandRepository.save(new Brand("Penguin Random House", "penguin-random-house", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80", "Global publisher of life-transforming bestsellers.")));
        Brand brandMinimalist = brandRepository.findBySlug("minimalist").orElseGet(() -> brandRepository.save(new Brand("Minimalist", "minimalist", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80", "Science-backed transparent skincare and actives.")));
        Brand brandCultsport = brandRepository.findBySlug("cultsport").orElseGet(() -> brandRepository.save(new Brand("Cultsport", "cultsport", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80", "High-performance fitness gear and home workout equipment.")));
        Brand brandIkea = brandRepository.findBySlug("ikea").orElseGet(() -> brandRepository.save(new Brand("IKEA", "ikea", "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg", "Affordable Scandinavian design and modern furniture.")));
        Brand brandSoulflower = brandRepository.findBySlug("soulflower").orElseGet(() -> brandRepository.save(new Brand("Soulflower", "soulflower", "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=150&auto=format&fit=crop&q=80", "100% pure organic aromatherapy candles and wellness.")));

        // Auto-heal existing product-brand integrity across the entire database
        try {
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%cello%'", brandCello.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%apsara%'", brandApsara.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%natraj%'", brandNatraj.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%classmate%' OR LOWER(name) LIKE '%journal%' OR LOWER(name) LIKE '%planner%' OR LOWER(name) LIKE '%spiral%'", brandClassmate.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%rakesh yadav%'", brandRakeshYadav.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%aggarwal%' OR LOWER(name) LIKE '%quantitative aptitude%' OR LOWER(name) LIKE '%reasoning%'", brandSChand.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%green soul%' OR (LOWER(name) LIKE '%chair%' AND LOWER(name) LIKE '%monster%')", brandGreenSoul.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%atomic habits%' OR LOWER(name) LIKE '%james clear%'", brandPenguin.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%serum%' AND brand_id IS NULL", brandMinimalist.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE (LOWER(name) LIKE '%dumbbell%' OR LOWER(name) LIKE '%weight%') AND brand_id IS NULL", brandCultsport.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE (LOWER(name) LIKE '%armchair%' OR LOWER(name) LIKE '%nordic%') AND brand_id IS NULL", brandIkea.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE (LOWER(name) LIKE '%candle%' OR LOWER(name) LIKE '%aromatherapy%') AND brand_id IS NULL", brandSoulflower.getId());
            jdbcTemplate.update("UPDATE products SET brand_id = ? WHERE LOWER(name) LIKE '%yoga mat%' AND brand_id IS NULL", brandNike.getId());

            // Remove mismatched electronics/footwear brand links on books & stationery items
            jdbcTemplate.update("UPDATE products SET brand_id = NULL WHERE category_id = (SELECT id FROM categories WHERE slug = 'books-stationery') AND brand_id IN (SELECT id FROM brands WHERE slug IN ('philips', 'apple', 'samsung', 'dell', 'sony', 'nike', 'adidas', 'puma')) AND LOWER(name) NOT LIKE '%cello%' AND LOWER(name) NOT LIKE '%apsara%' AND LOWER(name) NOT LIKE '%natraj%' AND LOWER(name) NOT LIKE '%classmate%'");

            // Update user & location phone number
            jdbcTemplate.update("UPDATE users SET phone = '+91 9696675081' WHERE email IN ('ravikantsinghravi366@gmail.com', 'admin@ecommerce.com', 'manager.ravi@ecommerce.com', 'vendor.ravi@ecommerce.com')");
            jdbcTemplate.update("UPDATE locations SET contact_phone = '+91 9696675081' WHERE contact_person = 'Ravikant Singh'");
        } catch (Exception e) {
            System.err.println("Brand & phone integrity update notice: " + e.getMessage());
        }

        // 4. Seed Coupons if empty
        if (couponRepository.count() == 0) {
            couponRepository.save(new Coupon("WELCOME10", 10, BigDecimal.valueOf(500), BigDecimal.valueOf(499), LocalDate.now().plusMonths(6)));
            couponRepository.save(new Coupon("SUPER20", 20, BigDecimal.valueOf(1000), BigDecimal.valueOf(1499), LocalDate.now().plusMonths(3)));
            couponRepository.save(new Coupon("FESTIVE50", 50, BigDecimal.valueOf(2500), BigDecimal.valueOf(2999), LocalDate.now().plusMonths(1)));
        }

        // 5. Seed Products
        List<Product> products = new ArrayList<>();

        // Product 1: Apple iPhone 15 Pro
        Product p1 = createProduct(
                "Apple iPhone 15 Pro Max 256GB - Natural Titanium",
                "apple-iphone-15-pro-max",
                "Forged in titanium with industry-leading A17 Pro chip and 48MP camera system.",
                "iPhone 15 Pro Max is the first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars. Titanium has one of the best strength-to-weight ratios of any metal, making these our lightest Pro models ever. You'll notice the difference the moment you pick one up.\n\nKey Highlights:\n- A17 Pro Chip with 6-core GPU for next-level mobile gaming.\n- 48MP Main Camera with 5x Telephoto optical zoom.\n- Action Button for instant shortcuts.\n- USB-C connector with USB 3 speeds.",
                BigDecimal.valueOf(149900),
                8,
                45,
                "IPHONE-15-PRO-MAX",
                catElectronics,
                brandApple,
                true, true, true, true,
                4.8, 124,
                "{\"Display\":\"6.7-inch Super Retina XDR with ProMotion\",\"Processor\":\"A17 Pro\",\"Storage\":\"256 GB\",\"Camera\":\"48MP + 12MP + 12MP\",\"Battery\":\"Up to 29 hours video playback\",\"Weight\":\"221 grams\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p1);

        // Product 2: Sony WH-1000XM5
        Product p2 = createProduct(
                "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
                "sony-wh-1000xm5-headphones",
                "Industry-leading noise cancellation with two processors and 8 microphones.",
                "The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE – Extreme and Hi-Res audio support, the WH-1000XM5 headphones provide awe-inspiring audio quality.\n\nFeatures:\n- Auto NC Optimizer constantly adjusts noise cancellation based on environment.\n- 30-hour battery life with quick charging (3 min charge for 3 hours playback).\n- Ultra-comfortable, lightweight design with soft fit leather.",
                BigDecimal.valueOf(29990),
                15,
                60,
                "SONY-XM5-BLK",
                catElectronics,
                brandSony,
                true, false, true, true,
                4.7, 89,
                "{\"Battery Life\":\"30 Hours\",\"Driver Unit\":\"30mm\",\"Bluetooth\":\"v5.2 with LDAC\",\"Weight\":\"250 grams\",\"Microphones\":\"8 mics for NC\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p2);

        // Product 3: Samsung Galaxy S24 Ultra
        Product p3 = createProduct(
                "Samsung Galaxy S24 Ultra 5G AI Smartphone 512GB",
                "samsung-galaxy-s24-ultra",
                "Galaxy AI is here. Epic 200MP camera, Snapdragon 8 Gen 3 and embedded S Pen.",
                "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. It's an absolute marvel of design. Search like never before with Circle to Search, get quick language translation on a call, format your notes into a clear summary, and effortlessly edit your photos - all from your phone, all with AI.\n\nFeatures:\n- Armor Aluminum and Corning Gorilla Armor glass.\n- Quad Tele System with 50MP 5x optical zoom.\n- Real-time Live Translate and Chat Assist.",
                BigDecimal.valueOf(134999),
                10,
                30,
                "SAMSUNG-S24-ULTRA",
                catElectronics,
                brandSamsung,
                true, true, true, false,
                4.6, 76,
                "{\"Display\":\"6.8-inch QHD+ Dynamic AMOLED 2X 120Hz\",\"RAM\":\"12 GB\",\"Storage\":\"512 GB\",\"Processor\":\"Snapdragon 8 Gen 3\",\"Battery\":\"5000 mAh\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p3);

        // Product 4: Dell XPS 15 Laptop
        Product p4 = createProduct(
                "Dell XPS 15 Intel Core i9 32GB RAM 1TB SSD RTX 4070",
                "dell-xps-15-oled-laptop",
                "Unmatched power and stunning 3.5K OLED InfinityEdge display for creators and pros.",
                "The XPS 15 is the perfect balance of power and portability with an unrivaled 15.6-inch 3.5K OLED touch display. Bring your creations to life with 13th Gen Intel Core i9 processing and NVIDIA GeForce RTX 4070 graphics.\n\nConstructed with CNC machined aluminum and carbon fiber palm rest with soft touch coating.",
                BigDecimal.valueOf(219900),
                12,
                18,
                "DELL-XPS15-9530",
                catElectronics,
                brandDell,
                true, false, true, false,
                4.9, 43,
                "{\"Display\":\"15.6-inch 3.5K (3456 x 2160) OLED Touch\",\"Processor\":\"Intel Core i9-13900H\",\"Graphics\":\"NVIDIA GeForce RTX 4070 8GB\",\"RAM\":\"32GB DDR5\",\"Storage\":\"1TB PCIe 4.0 NVMe SSD\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p4);

        // Product 5: Nike Air Max 270 Running Shoes
        Product p5 = createProduct(
                "Nike Air Max 270 Men's Athletic Running Shoes",
                "nike-air-max-270-shoes",
                "Nike's biggest heel Air unit yet delivers super-soft bounce with legendary style.",
                "Boasting Nike's biggest heel Air unit yet, the Nike Air Max 270 delivers visible cushioning under every step. The design draws inspiration from iconic Air Max shoes, showcasing Nike's greatest innovation with its large window and fresh array of colors.\n\nHighlights:\n- Knit fabric upper provides a lightweight fit and airy feel.\n- Stretchy inner sleeve creates a personalized fit.\n- Rubber on the outsole adds traction and durability.",
                BigDecimal.valueOf(11995),
                20,
                80,
                "NIKE-AM270-BLK",
                catFashion,
                brandNike,
                true, true, true, true,
                4.6, 210,
                "{\"Material\":\"Breathable Engineered Mesh\",\"Sole\":\"Dual-density foam with Max Air 270 heel\",\"Closure\":\"Lace-up\",\"Weight\":\"310 grams\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p5);

        // Product 6: Adidas Ultraboost Light
        Product p6 = createProduct(
                "Adidas Ultraboost Light Performance Road Running Shoes",
                "adidas-ultraboost-light-running-shoes",
                "Epic energy in our lightest Ultraboost ever, crafted with 30% lighter Boost material.",
                "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST. Its unique molecule design achieves the lightest BOOST foam to date and boasts a 10% lower carbon footprint than previous models.",
                BigDecimal.valueOf(15999),
                25,
                55,
                "ADIDAS-UB-LIGHT",
                catFashion,
                brandAdidas,
                false, true, true, true,
                4.7, 145,
                "{\"Midsole\":\"Light BOOST cushioning\",\"Upper\":\"PRIMEKNIT+ textile\",\"Outsole\":\"Continental Better Rubber\",\"Drop\":\"10mm\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p6);

        // Product 7: Puma Classics Minimalist Hoodie
        Product p7 = createProduct(
                "Puma Classics Relaxed Fit French Terry Pullover Hoodie",
                "puma-classics-french-terry-hoodie",
                "Premium heavyweight cotton blend hoodie with embroidered Puma archive logo.",
                "Clean, cozy and comfortable. This relaxed hoodie is made with sustainable French Terry cotton. Features ribbed cuffs and hem, kangaroo pocket, and drawcord adjustable hood for effortless everyday casual wear.",
                BigDecimal.valueOf(3499),
                30,
                110,
                "PUMA-HD-001",
                catFashion,
                brandPuma,
                false, false, false, true,
                4.5, 67,
                "{\"Fit\":\"Relaxed / Oversized\",\"Fabric\":\"80% Cotton, 20% Recycled Polyester\",\"Care\":\"Machine Wash Cold\",\"Origin\":\"Imported\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p7);

        // Product 8: Apple Watch Ultra 2
        Product p8 = createProduct(
                "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case",
                "apple-watch-ultra-2",
                "The most rugged and capable Apple Watch. Built for outdoor adventure and endurance training.",
                "The ultimate sports and adventure watch features a lightweight titanium case, extra-long battery life, the brightest Apple display ever, and the Double Tap gesture for magical interaction without touching the screen.",
                BigDecimal.valueOf(89900),
                5,
                24,
                "APPLE-WATCH-U2",
                catElectronics,
                brandApple,
                true, true, false, true,
                4.9, 82,
                "{\"Case\":\"49mm Aerospace-grade Titanium\",\"Display\":\"3000 nits Always-On Retina\",\"Water Resistance\":\"100 meters / EN13319\",\"Battery\":\"Up to 36 hours (72h Low Power)\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p8);

        // Product 9: Philips Smart Touch Air Fryer
        Product p9 = createProduct(
                "Philips Digital Air Fryer XXL with Rapid Air Technology",
                "philips-xxl-digital-air-fryer",
                "Healthy frying with up to 90% less fat. 7.2L family capacity with digital touch presets.",
                "Cook healthy, crispy, and tender meals for the whole family with Philips Airfryer XXL. Rapid Air Technology swirls hot air to create delicious foods with little to no added oil. Includes 16-in-1 cooking functions including fry, bake, grill, roast and reheat.",
                BigDecimal.valueOf(14995),
                18,
                38,
                "PHILIPS-AF-XXL",
                catHome,
                brandPhilips,
                true, false, true, false,
                4.6, 94,
                "{\"Capacity\":\"7.2 Liters (1.4kg food)\",\"Power\":\"2000W\",\"Preset Programs\":\"8 one-touch presets\",\"Dishwasher Safe\":\"Yes\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p9);

        // Product 10: Ergonomic Memory Foam Living Lounge Chair
        Product p10 = createProduct(
                "Nordic Minimalist Fabric Lounge Armchair with Solid Oak Legs",
                "nordic-minimalist-fabric-armchair",
                "Comfort meets Scandinavian craftsmanship. High density foam cushioning with textured weave.",
                "Transform your living room or study with this Scandinavian-inspired accent chair. Designed with deep, plush seating and ergonomic back support, wrapped in durable stain-resistant premium textured upholstery and supported by sturdy solid oak legs.",
                BigDecimal.valueOf(18999),
                22,
                15,
                "HOME-CHR-092",
                catHome,
                brandIkea,
                false, true, false, true,
                4.8, 38,
                "{\"Dimensions\":\"82cm W x 86cm D x 90cm H\",\"Material\":\"Textured Boucle Fabric & Oak Wood\",\"Max Weight\":\"150 kg\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p10);

        // Product 11: Luxury Scented Candle Gift Set
        Product p11 = createProduct(
                "Aromatherapy Natural Soy Wax Scented Candles 4-Pack Set",
                "aromatherapy-soy-candles-set",
                "Infused with natural essential oils: French Lavender, Vanilla Amber, Eucalyptus and Cedarwood.",
                "Hand-poured 100% natural soy wax candles with lead-free cotton wicks. Burn cleanly for over 45 hours per jar, filling your living space with calming and therapeutic botanical fragrances.",
                BigDecimal.valueOf(1999),
                35,
                90,
                "BEAUTY-CNDL-4PK",
                catHome,
                brandSoulflower,
                false, false, true, false,
                4.7, 52,
                "{\"Wax Type\":\"100% Organic Soy Wax\",\"Burn Time\":\"45+ Hours each\",\"Scents\":\"Lavender, Vanilla, Eucalyptus, Cedarwood\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p11);

        // Product 12: Premium Skincare Glow Serum
        Product p12 = createProduct(
                "Hydrating Vitamin C & Hyaluronic Acid Brightening Face Serum 50ml",
                "hydrating-vitamin-c-glow-serum",
                "Dermatologically tested daily brightening serum for radiant, plump and revitalized skin.",
                "Enriched with 15% Pure Vitamin C (L-Ascorbic Acid), Ferulic Acid and multi-molecular Hyaluronic Acid. Fights dark spots, boosts natural collagen synthesis, and provides intense 24-hour hydration without greasy residue.",
                BigDecimal.valueOf(1299),
                15,
                140,
                "BEAUTY-SRM-50ML",
                catBeauty,
                brandMinimalist,
                true, true, false, true,
                4.9, 180,
                "{\"Volume\":\"50 ml\",\"Key Ingredients\":\"15% Vitamin C, 2% Hyaluronic Acid, Ferulic Acid\",\"Skin Type\":\"All skin types, Non-comedogenic\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p12);

        // Product 13: Adjustable Cast Iron Dumbbell Set
        Product p13 = createProduct(
                "Adjustable Quick-Select Cast Iron Dumbbell Set 24kg (Pair)",
                "quick-select-adjustable-dumbbells-24kg",
                "Space-saving home gym dumbbells with instant dial weight selection from 2.5kg to 24kg.",
                "Replaces 15 sets of weights in a compact footprint. Turn the dial to change resistance in 1.5kg increments. Built with heavy-duty laser cut steel plates and anti-slip knurled grip handles for safe, intense strength training.",
                BigDecimal.valueOf(16999),
                20,
                25,
                "FIT-DBL-24KG",
                catSports,
                brandCultsport,
                true, false, true, true,
                4.8, 64,
                "{\"Weight Range\":\"2.5 kg to 24 kg per dumbbell\",\"Material\":\"Cast Iron with Nylon coating\",\"Tray Dimensions\":\"40cm x 20cm\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p13);

        // Product 14: Atomic Habits Hardcover
        Product p14 = createProduct(
                "Atomic Habits: An Easy & Proven Way to Build Good Habits (Hardcover)",
                "atomic-habits-james-clear-hardcover",
                "The #1 New York Times multi-million copy bestseller by James Clear.",
                "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
                BigDecimal.valueOf(799),
                25,
                200,
                "BOOK-AH-001",
                catBooks,
                brandPenguin,
                true, true, true, false,
                4.9, 340,
                "{\"Author\":\"James Clear\",\"Pages\":\"320 pages\",\"Publisher\":\"Penguin Random House\",\"Language\":\"English\",\"Format\":\"Hardcover\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p14);

        // Product 15: Philips Multigroom Series 7000
        Product p15 = createProduct(
                "Philips Multigroom Series 7000 14-in-1 All-in-One Trimmer",
                "philips-multigroom-series-7000-trimmer",
                "DualCut self-sharpening stainless steel blades with 5 hours cordless runtime.",
                "Ultimate precision styling for beard, head and body hair. DualCut technology includes 2x more blades for maximum precision. 100% waterproof for convenient shower use and easy faucet cleaning.",
                BigDecimal.valueOf(3995),
                18,
                75,
                "PHILIPS-MG7715",
                catBeauty,
                brandPhilips,
                false, false, true, true,
                4.6, 112,
                "{\"Battery Runtime\":\"5 Hours\",\"Attachments\":\"14 tools\",\"Waterproof\":\"100% Washable\",\"Warranty\":\"5 Years\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p15);

        // Product 16: Rakesh Yadav Advanced Maths
        Product p16 = createProduct(
                "Rakesh Yadav Class Notes of Advanced Maths",
                "rakesh-yadav-class-notes-advanced-maths",
                "SSC CGL, CHSL, MTS aur CPO ke liye sabse zyada use ki jane wali advanced math ki standard book.",
                "Rakesh Yadav Class Notes of Advanced Maths provides comprehensive handwritten class notes covering Arithmetic and Advanced Mathematics (Geometry, Trigonometry, Algebra, Mensuration) with bilingual explanations and shortcut tricks for SSC CGL, CHSL, CPO, MTS, and Railway examinations.\n\nWriter: Rakesh Yadav\n\nHighlights:\n- Comprehensive handwritten solutions with step-by-step logic\n- Shortcut methods specifically designed for time-management in SSC exams\n- Bilingual content (Hindi & English medium supported)\n- Covers all previous year question patterns.",
                BigDecimal.valueOf(340),
                15,
                150,
                "BOOK-RY-MATH-01",
                catBooks,
                brandRakeshYadav,
                true, true, true, true,
                4.9, 412,
                "{\"Author\":\"Rakesh Yadav\",\"Subject\":\"Advanced Mathematics\",\"Target Exams\":\"SSC CGL, CHSL, CPO, MTS, Railways\",\"Language\":\"Bilingual (Hindi & English)\",\"Publisher\":\"Rakesh Yadav Readers Publication\",\"Pages\":\"480 Pages\",\"Binding\":\"Paperback\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p16);

        // Product 17: Quantitative Aptitude by R.S. Aggarwal
        Product p17 = createProduct(
                "Quantitative Aptitude for Competitive Examinations by R.S. Aggarwal",
                "quantitative-aptitude-competitive-examinations-rs-aggarwal",
                "SSC aur banking exams ke basic concepts aur shortcut tricks clear karne ke liye sabse behtareen book.",
                "Quantitative Aptitude for Competitive Examinations by Dr. R.S. Aggarwal is India's most trusted comprehensive guide for SSC CGL, Bank PO, SBI, IBPS, RBI, CAT, and Civil Services aptitude tests. Covers more than 5500 practice questions with detailed step-by-step illustrations.\n\nWriter: R.S. Aggarwal\n\nHighlights:\n- 5500+ Fully solved questions with shortcut solutions\n- Comprehensive theory covering Arithmetic, Algebra, Number System & Geometry\n- Level-wise practice sets from basic to advanced\n- Updated syllabus pattern.",
                BigDecimal.valueOf(550),
                18,
                120,
                "BOOK-RS-APT-02",
                catBooks,
                brandSChand,
                true, true, true, false,
                4.8, 520,
                "{\"Author\":\"Dr. R.S. Aggarwal\",\"Subject\":\"Quantitative Aptitude & Mathematics\",\"Target Exams\":\"SSC, Banking (IBPS/SBI), Railways, CAT, CDS\",\"Language\":\"English / Hindi Available\",\"Publisher\":\"S. Chand Publishing\",\"Pages\":\"920 Pages\",\"Edition\":\"Revised & Updated\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p17);

        // Product 18: Reasoning by R.S. Aggarwal
        Product p18 = createProduct(
                "A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal",
                "modern-approach-verbal-non-verbal-reasoning-rs-aggarwal",
                "Reasoning ke sabhi chapters (Logical, Analytical, Verbal) ke practice questions ke liye best source.",
                "A Modern Approach to Verbal & Non-Verbal Reasoning by Dr. R.S. Aggarwal is the definitive benchmark book for mastering analytical ability, syllogisms, blood relations, series completion, coding-decoding, spatial reasoning, and non-verbal patterns for SSC, Banking, MBA, and UPSC CSAT.\n\nWriter: R.S. Aggarwal\n\nHighlights:\n- Complete coverage of Verbal, Analytical, and Non-Verbal reasoning\n- Thousands of model questions with illustrative explanations\n- Quick-solving shortcut tricks for high scoring\n- Previous year solved papers included.",
                BigDecimal.valueOf(590),
                20,
                95,
                "BOOK-RS-REAS-03",
                catBooks,
                brandSChand,
                false, true, true, true,
                4.8, 380,
                "{\"Author\":\"Dr. R.S. Aggarwal\",\"Subject\":\"Verbal & Non-Verbal Reasoning\",\"Target Exams\":\"SSC CGL/CHSL, Bank PO/Clerk, LIC, UPSC, Railways\",\"Language\":\"English\",\"Publisher\":\"S. Chand Publishing\",\"Pages\":\"1200 Pages\",\"Format\":\"Paperback\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p18);

        // Product 19: A4 Spiral Notebook & Planner
        Product p19 = createProduct(
                "Digital Creator Pro Hardbound Productivity Journal & Planner (A4 Spiral)",
                "digital-creator-pro-hardbound-productivity-journal-planner-a4-spiral",
                "Notes banane, rough work ya daily practice ke liye durable hardbound A4 spiral copy.",
                "Engineered for intense daily study, competitive exam practice, and project planning. Features twin-wire snag-free metal spiral binding, water-resistant hardbound covers, and ultra-thick 120 GSM bleed-proof ivory paper that handles fountain pens and gel ink effortlessly.\n\nType: A4 Spiral Notebook / Journal\n\nHighlights:\n- Twin-wire 360-degree lay-flat A4 spiral binding\n- 240 Pages of premium 120 GSM micro-perforated sheets\n- Includes daily goal planner, habit tracker, and index section\n- Heavy duty durable hardboard cover.",
                BigDecimal.valueOf(350),
                25,
                180,
                "STAT-A4-SPIRAL-01",
                catBooks,
                brandClassmate,
                true, false, true, true,
                4.9, 290,
                "{\"Type\":\"A4 Spiral Bound Notebook & Planner\",\"Paper Quality\":\"120 GSM Bleed-Proof Ivory Sheets\",\"Pages\":\"240 Pages (120 Sheets)\",\"Ruling\":\"Dotted / Grid Hybrid for Problem Solving\",\"Binding\":\"Twin-Loop Metal Wire-O Spiral\",\"Cover\":\"Laminated Hardbound\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p19);

        // Product 20: Classmate A4 Notebook
        Product p20 = createProduct(
                "Classmate A4 Notebook - Simple Soft Cover (Unruled/Ruled)",
                "classmate-a4-notebook-simple-soft-cover",
                "Regular college notes aur practice ke liye clean aur smooth pages wali simple notebook.",
                "Classmate A4 Notebooks feature ultra-smooth, elemental chlorine-free (Ozone treated) bright white paper that ensures frictionless fast handwriting. Designed with pin binding and attractive soft covers with informative trivia on the back.\n\nType: Simple Notebook\n\nHighlights:\n- Whiter, brighter, and smoother paper for effortless writing\n- High-strength pin binding with corner rounding to prevent dog-earing\n- Ideal for math rough work, coaching notes, and exam practice\n- Pack contains page marker and index page.",
                BigDecimal.valueOf(75),
                10,
                250,
                "STAT-CLASSMATE-A4-01",
                catBooks,
                brandClassmate,
                false, true, true, false,
                4.7, 160,
                "{\"Brand\":\"Classmate (ITC)\",\"Size\":\"A4 (29.7 cm x 21.0 cm)\",\"Pages\":\"172 Pages\",\"Paper Weight\":\"70 GSM Elemental Chlorine Free\",\"Ruling\":\"Single Ruled / Unruled Options\",\"Binding\":\"Center Stapled Soft Cover\"}",
                Arrays.asList(
                        "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
                )
        );
        products.add(p20);

        // 6. Seed Sample Reviews
        try {
            if (reviewRepository.count() == 0 && p1 != null && p2 != null && p5 != null) {
                reviewRepository.save(new Review(customer, p1, 5, "Unbelievable Camera and Build Quality!", "Upgraded from iPhone 12 and the titanium body feels so light yet solid. The 5x optical zoom camera is crisp and battery lasts more than a full day easily.", true));
                reviewRepository.save(new Review(customer, p2, 5, "Best Noise Cancelling in the Market", "Used this on an 8-hour flight and it completely silenced airplane engine noise. Sound signature is rich and call clarity is top notch.", true));
                reviewRepository.save(new Review(customer, p5, 4, "Extremely comfortable for daily runs", "Great cushion and heel support. Looks super stylish with jeans as well as running shorts. True to size.", true));
            }
        } catch (Exception ignored) {}

        // Seed Warehouse Locations and Multi-Warehouse Product Inventories
        seedLocationsAndInventories();

        // Ensure all products across database have 100% accurate, matched image URLs
        bulkProductService.repairAndAlignAllProductImages();

        System.out.println(">>> E-Commerce Platform Data Initialization Completed Successfully!");
        System.out.println(">>> Seed accounts configured via environment properties.");
    }

    private Product createProduct(
            String name,
            String slug,
            String shortDesc,
            String desc,
            BigDecimal price,
            int discountPercent,
            int stock,
            String sku,
            Category category,
            Brand brand,
            boolean featured,
            boolean newArrival,
            boolean bestSeller,
            boolean trending,
            double rating,
            int reviewCount,
            String specifications,
            List<String> imageUrls) {

        Optional<Product> existing = productRepository.findBySlug(slug);
        if (existing.isPresent()) {
            return existing.get();
        }

        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setShortDescription(shortDesc);
        product.setDescription(desc);
        product.setPrice(price);
        product.setDiscountPercent(discountPercent);
        product.setStockQuantity(stock);
        product.setSku(sku);
        product.setCategory(category);
        product.setBrand(brand);
        product.setFeatured(featured);
        product.setNewArrival(newArrival);
        product.setBestSeller(bestSeller);
        product.setTrending(trending);
        product.setAverageRating(rating);
        product.setReviewCount(reviewCount);
        product.setSpecifications(specifications);
        product.setActive(true);
        if (imageUrls != null && !imageUrls.isEmpty()) {
            product.setPrimaryImageUrl(imageUrls.get(0));
        }

        Product saved = productRepository.save(product);

        if (imageUrls != null && !imageUrls.isEmpty()) {
            List<ProductImage> imageEntities = new ArrayList<>();
            for (int i = 0; i < imageUrls.size(); i++) {
                ProductImage img = new ProductImage(imageUrls.get(i), i == 0, i, saved);
                imageEntities.add(img);
            }
            saved.setImages(imageEntities);
            saved = productRepository.save(saved);
        }

        System.out.println(">>> Seeded Product: " + saved.getName() + " (Slug: " + saved.getSlug() + ")");
        return saved;
    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void seedLocationsAndInventories() {
        try {
            if (locationRepository.count() == 0) {
                Location locBlr = new Location("ShopZone Central Mega Warehouse - Bengaluru", "WH-BLR-01", LocationType.CENTRAL_WAREHOUSE, "Plot 42, Electronic City Phase 1", "Bengaluru", "Karnataka", "560100", "Ravikant Singh", "+91 9696675081", "warehouse.blr@ecommerce.com");
                locBlr.setLatitude(12.8452);
                locBlr.setLongitude(77.6602);
                locationRepository.saveAndFlush(locBlr);

                Location locDel = new Location("ShopZone North Regional Hub - Delhi NCR", "WH-DEL-01", LocationType.REGIONAL_HUB, "Sector 62, Express Logistics Park", "Noida", "Uttar Pradesh", "201301", "Vikram Malhotra", "+91 9810012345", "warehouse.del@ecommerce.com");
                locDel.setLatitude(28.6139);
                locDel.setLongitude(77.3592);
                locationRepository.saveAndFlush(locDel);

                Location locBom = new Location("ShopZone West Regional Hub - Mumbai", "WH-BOM-01", LocationType.REGIONAL_HUB, "Bhiwandi Logistics Hub", "Thane", "Maharashtra", "421302", "Ananya Deshmukh", "+91 9820054321", "warehouse.bom@ecommerce.com");
                locBom.setLatitude(19.2969);
                locBom.setLongitude(73.0631);
                locationRepository.saveAndFlush(locBom);

                Location locGkp = new Location("Vendor Ravi Express Hub - Gorakhpur", "WH-GKP-01", LocationType.SELLER_WAREHOUSE, "Industrial Growth Center, GIDA", "Gorakhpur", "Uttar Pradesh", "273001", "Ravikant Singh", "+91 9696675081", "vendor.ravi@ecommerce.com");
                locGkp.setLatitude(26.7606);
                locGkp.setLongitude(83.3732);
                locationRepository.saveAndFlush(locGkp);

                Location locDropship = new Location("ShopZone Direct Seller Dropship Center", "WH-SELLER-01", LocationType.SELLER_WAREHOUSE, "Whitefield Export Zone", "Bengaluru", "Karnataka", "560066", "Sunil Joshi", "+91 9845011223", "dropship@ecommerce.com");
                locDropship.setLatitude(12.9698);
                locDropship.setLongitude(77.7500);
                locationRepository.saveAndFlush(locDropship);

                System.out.println(">>> Seeded 5 Active ShopZone & Seller Warehouse Locations!");
            }

            List<Location> locations = locationRepository.findAll();
            if (locations.isEmpty()) return;

            List<Product> products = productRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 50)).getContent();
            for (Product product : products) {
                int totalStock = product.getStockQuantity() > 0 ? product.getStockQuantity() : 50;
                int blrStock = (int) Math.round(totalStock * 0.50);
                int delStock = (int) Math.round(totalStock * 0.20);
                int bomStock = (int) Math.round(totalStock * 0.15);
                int gkpStock = (int) Math.round(totalStock * 0.10);
                int dropshipStock = Math.max(1, totalStock - (blrStock + delStock + bomStock + gkpStock));

                int[] stocks = {blrStock, delStock, bomStock, gkpStock, dropshipStock};

                for (int i = 0; i < locations.size() && i < stocks.length; i++) {
                    Location loc = locations.get(i);
                    int locStock = Math.max(1, stocks[i]);
                    if (inventoryRepository.findByProductAndLocation(product, loc).isEmpty()) {
                        String rack = "AISLE-0" + (1 + (i % 4)) + "/BAY-" + ((char)('A' + ((product.getId() != null ? product.getId() : 1L) % 6))) + "/BIN-" + (10 + ((product.getId() != null ? product.getId() : 1L) % 40));
                        Inventory inv = new Inventory(product, loc, locStock, 10, rack);
                        inventoryRepository.saveAndFlush(inv);
                    }
                }
            }
            System.out.println(">>> Multi-Warehouse Inventory Stock Matrix Synchronized with " + inventoryRepository.count() + " total records!");
        } catch (Exception e) {
            System.err.println(">>> Error during seedLocationsAndInventories: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
