package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.DeliveryPartnerDto;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.service.DeliveryPartnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/delivery-partners")
public class DeliveryPartnerController {

    @Autowired
    private DeliveryPartnerService deliveryPartnerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryPartnerDto>>> getAllPartners() {
        return ResponseEntity.ok(ApiResponse.success(deliveryPartnerService.getAllPartners()));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DeliveryPartnerDto>>> getAvailablePartners() {
        return ResponseEntity.ok(ApiResponse.success(deliveryPartnerService.getAvailablePartners()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeliveryPartnerDto>> createPartner(@Valid @RequestBody DeliveryPartnerDto dto) {
        return new ResponseEntity<>(ApiResponse.success("Delivery partner registered successfully", deliveryPartnerService.createPartner(dto)), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryPartnerDto>> updatePartner(@PathVariable Long id, @Valid @RequestBody DeliveryPartnerDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Delivery partner updated successfully", deliveryPartnerService.updatePartner(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePartner(@PathVariable Long id) {
        deliveryPartnerService.deletePartner(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery partner deactivated successfully", null));
    }

    @PostMapping("/assign/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> assignOrder(
            @PathVariable Long orderId,
            @RequestParam Long partnerId) {
        return ResponseEntity.ok(ApiResponse.success("Delivery partner assigned successfully", deliveryPartnerService.assignPartnerToOrder(orderId, partnerId)));
    }

    @PostMapping("/ai-auto-assign/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> aiAutoAssignOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success("AI matched and assigned optimal delivery rider", deliveryPartnerService.aiSmartAssignOrder(orderId)));
    }

    @PostMapping("/ai-auto-assign-all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> aiAutoAssignAll() {
        int count = deliveryPartnerService.aiSmartAssignAllPendingOrders();
        return ResponseEntity.ok(ApiResponse.success("AI smartly distributed " + count + " orders across local riders with dynamic load balancing", Map.of("assignedCount", count)));
    }

    @PostMapping("/seed-fleet")
    public ResponseEntity<ApiResponse<String>> seedFleet() {
        deliveryPartnerService.seedDeliveryFleetNetwork();
        return ResponseEntity.ok(ApiResponse.success("Delivery partner fleet network initialized successfully"));
    }

    @PostMapping("/complete/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> completeDelivery(
            @PathVariable Long orderId,
            @RequestBody(required = false) Map<String, String> payload) {
        String otp = payload != null ? payload.get("otp") : null;
        return ResponseEntity.ok(ApiResponse.success("Order marked as delivered", deliveryPartnerService.completeDelivery(orderId, otp)));
    }
}
