package com.ecommerce.service;

import com.ecommerce.dto.DeliveryPartnerDto;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.entity.DeliveryPartner;
import com.ecommerce.entity.DeliveryPartner.DeliveryStatus;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.PaymentStatus;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.DeliveryPartnerRepository;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class DeliveryPartnerService {

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    public List<DeliveryPartnerDto> getAllPartners() {
        return deliveryPartnerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<DeliveryPartnerDto> getAvailablePartners() {
        return deliveryPartnerRepository.findByStatusAndActiveTrue(DeliveryStatus.AVAILABLE).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliveryPartnerDto createPartner(DeliveryPartnerDto dto) {
        if (deliveryPartnerRepository.findByPhone(dto.getPhone()).isPresent()) {
            throw new BadRequestException("A delivery partner with phone number " + dto.getPhone() + " already exists.");
        }

        DeliveryPartner partner = new DeliveryPartner();
        partner.setName(dto.getName());
        partner.setPhone(dto.getPhone());
        partner.setEmail(dto.getEmail());
        partner.setVehicleNumber(dto.getVehicleNumber());
        partner.setVehicleType(dto.getVehicleType() != null ? dto.getVehicleType() : "Two Wheeler (Bike)");
        partner.setStatus(dto.getStatus() != null ? dto.getStatus() : DeliveryStatus.AVAILABLE);
        partner.setCurrentArea(dto.getCurrentArea() != null ? dto.getCurrentArea() : "City Center");
        partner.setRating(dto.getRating() > 0 ? dto.getRating() : 4.8);
        partner.setTotalDeliveries(dto.getTotalDeliveries());
        partner.setActive(true);

        return mapToDto(deliveryPartnerRepository.save(partner));
    }

    @Transactional
    public DeliveryPartnerDto updatePartner(Long id, DeliveryPartnerDto dto) {
        DeliveryPartner partner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner", "id", id));

        partner.setName(dto.getName());
        partner.setPhone(dto.getPhone());
        partner.setEmail(dto.getEmail());
        partner.setVehicleNumber(dto.getVehicleNumber());
        if (dto.getVehicleType() != null) partner.setVehicleType(dto.getVehicleType());
        if (dto.getStatus() != null) partner.setStatus(dto.getStatus());
        if (dto.getCurrentArea() != null) partner.setCurrentArea(dto.getCurrentArea());
        if (dto.getRating() > 0) partner.setRating(dto.getRating());
        partner.setTotalDeliveries(dto.getTotalDeliveries());
        partner.setActive(dto.isActive());

        return mapToDto(deliveryPartnerRepository.save(partner));
    }

    @Transactional
    public void deletePartner(Long id) {
        DeliveryPartner partner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner", "id", id));
        partner.setActive(false);
        deliveryPartnerRepository.save(partner);
    }

    @Transactional
    public OrderResponse assignPartnerToOrder(Long orderId, Long partnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        DeliveryPartner partner = deliveryPartnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner", "id", partnerId));

        if (!partner.isActive()) {
            throw new BadRequestException("Selected delivery partner is inactive.");
        }

        // Generate 4-digit OTP for secure customer delivery handoff
        String otp = String.format("%04d", new Random().nextInt(9000) + 1000);

        order.setDeliveryPartner(partner);
        order.setDeliveryOtp(otp);
        order.setDeliveryAssignedAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);
        if (order.getCourierName() == null || order.getCourierName().isBlank()) {
            order.setCourierName("ShopSphere Express (" + partner.getName() + ")");
        }
        if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
            order.setTrackingNumber("SPH-EXP-" + System.currentTimeMillis() % 1000000);
        }

        long currentLoad = orderRepository.countActiveOrdersByPartnerId(partner.getId());
        if (currentLoad >= 3) {
            partner.setStatus(DeliveryStatus.ON_DELIVERY);
        } else {
            partner.setStatus(DeliveryStatus.AVAILABLE);
        }
        deliveryPartnerRepository.save(partner);

        Order savedOrder = orderRepository.save(order);
        return orderService.mapToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse aiSmartAssignOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        List<DeliveryPartner> allPartners = deliveryPartnerRepository.findByActiveTrue();
        if (allPartners.isEmpty()) {
            throw new BadRequestException("No active delivery partners found in the fleet to assign.");
        }

        String orderCity = order.getShippingCity() != null ? order.getShippingCity().trim() : "";
        String orderState = order.getShippingState() != null ? order.getShippingState().trim() : "";
        String orderAddress = ((order.getShippingStreetAddress() != null ? order.getShippingStreetAddress() : "") + " "
                + (order.getShippingApartment() != null ? order.getShippingApartment() : "")).toLowerCase();

        Map<Long, Long> partnerLoadMap = new java.util.HashMap<>();
        for (DeliveryPartner p : allPartners) {
            long load = orderRepository.countActiveOrdersByPartnerId(p.getId());
            partnerLoadMap.put(p.getId(), load);
        }

        DeliveryPartner optimalPartner = allPartners.stream()
                .max(Comparator.comparingDouble((DeliveryPartner p) -> {
                    double score = 0.0;
                    String area = p.getCurrentArea() != null ? p.getCurrentArea().toLowerCase() : "";
                    String cityLower = orderCity.toLowerCase();
                    String stateLower = orderState.toLowerCase();

                    // 1. Geographic Proximity & Locality Affinity (0 to 100 pts)
                    boolean matchedLocality = false;
                    if (!cityLower.isBlank()) {
                        if (area.contains(cityLower)) {
                            score += 70.0; // Direct city match (e.g. Lucknow, Delhi, Bengaluru, Mumbai)
                            matchedLocality = true;
                        } else if (cityLower.contains("bengaluru") || cityLower.contains("bangalore")) {
                            if (area.contains("bengaluru") || area.contains("bangalore") ||
                                area.contains("koramangala") || area.contains("whitefield") ||
                                area.contains("electronic city") || area.contains("malleshwaram") ||
                                area.contains("indiranagar") || area.contains("hsr") || area.contains("btm")) {
                                score += 55.0; // Bengaluru cluster rider
                                matchedLocality = true;
                            }
                        }
                    }

                    if (!stateLower.isBlank() && area.contains(stateLower)) {
                        score += 30.0; // State affinity (e.g. Uttar Pradesh, Karnataka, Maharashtra)
                    }

                    // Micro-area / landmark keyword match (e.g. "Koramangala", "Whitefield", "Gomti Nagar", "Outer Ring Road")
                    if (!orderAddress.isBlank()) {
                        String[] areaTokens = area.split("[/,\\-\\s]+");
                        for (String token : areaTokens) {
                            if (token.length() >= 4 && orderAddress.contains(token)) {
                                score += 35.0; // Precise neighborhood match!
                                matchedLocality = true;
                                break;
                            }
                        }
                    }

                    // Fallback to Pan-India Express Carriers for orders outside regional rider hubs
                    if (!matchedLocality && (area.contains("pan-india") || area.contains("national express") || area.contains("surface"))) {
                        score += 45.0;
                    }

                    // 2. Dynamic Workload Balancing (Huge Factor: Prevents dumping all orders on one rider!)
                    long activeLoad = partnerLoadMap.getOrDefault(p.getId(), 0L);
                    score -= (activeLoad * 25.0);

                    // 3. Status bonus
                    if (p.getStatus() == DeliveryStatus.AVAILABLE) {
                        score += 15.0;
                    }

                    // 4. Partner Rating
                    score += (p.getRating() > 0 ? (p.getRating() / 5.0) * 15.0 : 12.0);

                    // 5. Entropy / Jitter for fair rotation among equally matched riders
                    score += (java.util.concurrent.ThreadLocalRandom.current().nextDouble() * 2.0);

                    return score;
                }))
                .orElse(allPartners.get(0));

        return assignPartnerToOrder(orderId, optimalPartner.getId());
    }

    @Transactional
    public int aiSmartAssignAllPendingOrders() {
        List<Order> unassignedOrPending = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.READY_TO_SHIP ||
                             o.getOrderStatus() == OrderStatus.CONFIRMED ||
                             o.getOrderStatus() == OrderStatus.PENDING ||
                             o.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY)
                .collect(Collectors.toList());

        int count = 0;
        for (Order o : unassignedOrPending) {
            try {
                aiSmartAssignOrder(o.getId());
                count++;
            } catch (Exception ignored) {}
        }
        return count;
    }

    @Transactional
    public void seedDeliveryFleetNetwork() {
        // Update existing Bengaluru partners to have clear Bengaluru locality tags
        deliveryPartnerRepository.findByNameIgnoreCase("Ramesh Kumar").ifPresent(p -> {
            p.setCurrentArea("Bengaluru Central / MG Road / Indiranagar, Karnataka");
            p.setRating(4.9);
            p.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(p);
        });
        deliveryPartnerRepository.findByNameIgnoreCase("Amit Patel").ifPresent(p -> {
            p.setCurrentArea("Bengaluru South - Koramangala / HSR / BTM, Karnataka");
            p.setRating(4.8);
            p.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(p);
        });
        deliveryPartnerRepository.findByNameIgnoreCase("Suresh Verma").ifPresent(p -> {
            p.setCurrentArea("Bengaluru East - Whitefield / Marathahalli, Karnataka");
            p.setRating(4.8);
            p.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(p);
        });
        deliveryPartnerRepository.findByNameIgnoreCase("Vikram Singh").ifPresent(p -> {
            p.setCurrentArea("Bengaluru Tech Corridor - Electronic City / Outer Ring Road, Karnataka");
            p.setRating(4.9);
            p.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(p);
        });
        deliveryPartnerRepository.findByNameIgnoreCase("Priya Sharma").ifPresent(p -> {
            p.setCurrentArea("Bengaluru North - Malleshwaram / Rajajinagar / Hebbal, Karnataka");
            p.setRating(4.9);
            p.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(p);
        });

        // Add Lucknow Hub riders (for Uttar Pradesh orders)
        if (deliveryPartnerRepository.findByPhone("+91 9711223344").isEmpty()) {
            DeliveryPartner r1 = new DeliveryPartner("Mohd. Rizwan", "+91 9711223344", "rizwan.delivery@ecommerce.com", "UP-32-AB-1204", "TVS Raider 125 (Bike)", "Lucknow Central / Gomti Nagar / Hazratganj, Uttar Pradesh");
            r1.setRating(4.9);
            r1.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r1);
        }
        if (deliveryPartnerRepository.findByPhone("+91 9722334455").isEmpty()) {
            DeliveryPartner r2 = new DeliveryPartner("Ankit Shukla", "+91 9722334455", "ankit.delivery@ecommerce.com", "UP-32-CD-5612", "Hero Splendor Plus (Bike)", "Lucknow South / Alambagh / Kanpur Road, Uttar Pradesh");
            r2.setRating(4.8);
            r2.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r2);
        }

        // Add Delhi NCR Hub riders
        if (deliveryPartnerRepository.findByPhone("+91 9733445566").isEmpty()) {
            DeliveryPartner r3 = new DeliveryPartner("Rahul Verma", "+91 9733445566", "rahul.delivery@ecommerce.com", "DL-01-EQ-4589", "Ather 450X (EV Electric)", "Delhi NCR / Connaught Place / South Delhi");
            r3.setRating(4.9);
            r3.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r3);
        }
        if (deliveryPartnerRepository.findByPhone("+91 9744556677").isEmpty()) {
            DeliveryPartner r4 = new DeliveryPartner("Deepak Yadav", "+91 9744556677", "deepak.delivery@ecommerce.com", "UP-16-ZX-9012", "Honda Activa 6G (Scooter)", "Noida / Greater Noida / Ghaziabad, UP-NCR");
            r4.setRating(4.8);
            r4.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r4);
        }

        // Add Mumbai Hub rider
        if (deliveryPartnerRepository.findByPhone("+91 9755667788").isEmpty()) {
            DeliveryPartner r5 = new DeliveryPartner("Sachin Sawant", "+91 9755667788", "sachin.delivery@ecommerce.com", "MH-02-MB-7711", "Bajaj Chetak EV (Electric)", "Mumbai / Bandra / Andheri / BKC, Maharashtra");
            r5.setRating(4.9);
            r5.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r5);
        }

        // Add Pan-India National Carriers
        if (deliveryPartnerRepository.findByPhone("+91 9766778899").isEmpty()) {
            DeliveryPartner r6 = new DeliveryPartner("BlueDart Express Logistics", "+91 9766778899", "bluedart.fleet@ecommerce.com", "IN-LOG-001", "Express Air Cargo & Van", "Pan-India National Express / Inter-State");
            r6.setRating(4.9);
            r6.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r6);
        }
        if (deliveryPartnerRepository.findByPhone("+91 9777889900").isEmpty()) {
            DeliveryPartner r7 = new DeliveryPartner("Delhivery Surface Express", "+91 9777889900", "delhivery.fleet@ecommerce.com", "IN-LOG-002", "Commercial Surface Cargo", "Pan-India Surface & Regional Hubs");
            r7.setRating(4.8);
            r7.setStatus(DeliveryStatus.AVAILABLE);
            deliveryPartnerRepository.save(r7);
        }
    }

    @Transactional
    public OrderResponse completeDelivery(Long orderId, String otp) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (otp != null && !otp.isBlank() && order.getDeliveryOtp() != null && !order.getDeliveryOtp().equals(otp.trim())) {
            throw new BadRequestException("Invalid delivery verification OTP.");
        }

        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setDeliveredAt(LocalDateTime.now());

        if (order.getDeliveryPartner() != null) {
            DeliveryPartner partner = order.getDeliveryPartner();
            long remainingLoad = orderRepository.countActiveOrdersByPartnerId(partner.getId());
            if (remainingLoad <= 1) {
                partner.setStatus(DeliveryStatus.AVAILABLE);
            }
            partner.setTotalDeliveries(partner.getTotalDeliveries() + 1);
            deliveryPartnerRepository.save(partner);
        }

        Order saved = orderRepository.save(order);
        return orderService.mapToResponse(saved);
    }

    public DeliveryPartnerDto mapToDto(DeliveryPartner partner) {
        if (partner == null) return null;
        DeliveryPartnerDto dto = new DeliveryPartnerDto();
        dto.setId(partner.getId());
        dto.setName(partner.getName());
        dto.setPhone(partner.getPhone());
        dto.setEmail(partner.getEmail());
        dto.setVehicleNumber(partner.getVehicleNumber());
        dto.setVehicleType(partner.getVehicleType());
        dto.setStatus(partner.getStatus());
        dto.setCurrentArea(partner.getCurrentArea());
        dto.setRating(partner.getRating());
        dto.setTotalDeliveries(partner.getTotalDeliveries());
        dto.setActive(partner.isActive());
        dto.setActiveOrders(orderRepository.countActiveOrdersByPartnerId(partner.getId()));
        return dto;
    }
}
