package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.entity.InventoryTransactionType;
import com.ecommerce.entity.Order;
import com.ecommerce.service.FulfillmentService;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InventoryController {

    @Autowired
    private FulfillmentService fulfillmentService;

    @Autowired
    private OrderService orderService;

    /**
     * List all warehouse / fulfillment locations
     */
    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<LocationDto>>> getAllLocations() {
        List<LocationDto> locations = fulfillmentService.getAllLocations();
        return ResponseEntity.ok(ApiResponse.success("Fetched warehouse locations successfully", locations));
    }

    /**
     * List stock inventory across warehouses
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getInventories(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long locationId) {
        List<InventoryDto> inventories = fulfillmentService.getInventories(productId, locationId);
        return ResponseEntity.ok(ApiResponse.success("Fetched inventory levels successfully", inventories));
    }

    /**
     * List audit transactions log
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<PagedResponse<InventoryTransactionDto>>> getTransactions(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) InventoryTransactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<InventoryTransactionDto> res = fulfillmentService.getTransactions(productId, locationId, type, page, size);
        return ResponseEntity.ok(ApiResponse.success("Fetched inventory transactions audit successfully", res));
    }

    /**
     * Inter-warehouse Stock Transfer
     */
    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> transferStock(@Valid @RequestBody StockTransferRequest request) {
        fulfillmentService.transferStock(request);
        return ResponseEntity.ok(ApiResponse.success("Stock transferred successfully between warehouses", null));
    }

    /**
     * Manual Inventory Correction / Adjustment
     */
    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InventoryDto>> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        InventoryDto dto = fulfillmentService.adjustStock(request);
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted and product catalog synced successfully", dto));
    }

    /**
     * Warehouse PICK Action
     */
    @PostMapping("/orders/{orderId}/pick")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    public ResponseEntity<ApiResponse<OrderResponse>> pickOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) OrderFulfillmentActionRequest request) {
        String pickedBy = request != null ? request.getPickedBy() : "Ravikant Singh";
        String notes = request != null ? request.getPickerNotes() : null;
        Order order = fulfillmentService.pickOrder(orderId, pickedBy, notes);
        return ResponseEntity.ok(ApiResponse.success("Order marked as PICKED and bin items collected", orderService.mapToOrderResponse(order)));
    }

    /**
     * Warehouse PACK Action
     */
    @PostMapping("/orders/{orderId}/pack")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    public ResponseEntity<ApiResponse<OrderResponse>> packOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) OrderFulfillmentActionRequest request) {
        String packedBy = request != null ? request.getPackedBy() : "Ravikant Singh";
        Double weight = request != null ? request.getPackageWeightKg() : 0.45;
        String boxSize = request != null ? request.getPackageBoxSize() : "Medium (30x20x10 cm)";
        String barcode = request != null ? request.getPackageBarcode() : null;
        Order order = fulfillmentService.packOrder(orderId, packedBy, weight, boxSize, barcode);
        return ResponseEntity.ok(ApiResponse.success("Order marked as PACKED with box dimensions and barcode", orderService.mapToOrderResponse(order)));
    }

    /**
     * Warehouse READY TO SHIP Action
     */
    @PostMapping("/orders/{orderId}/ready-to-ship")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDOR')")
    public ResponseEntity<ApiResponse<OrderResponse>> readyToShipOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) OrderFulfillmentActionRequest request) {
        String manifestedBy = request != null ? request.getManifestedBy() : "Ravikant Singh";
        Long partnerId = request != null ? request.getDeliveryPartnerId() : null;
        String courierName = request != null ? request.getCourierName() : null;
        String trackingNumber = request != null ? request.getTrackingNumber() : null;
        Order order = fulfillmentService.readyToShipOrder(orderId, manifestedBy, partnerId, courierName, trackingNumber);
        return ResponseEntity.ok(ApiResponse.success("Order marked as READY TO SHIP and dispatched to fleet", orderService.mapToOrderResponse(order)));
    }
}
