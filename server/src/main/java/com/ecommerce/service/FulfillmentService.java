package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FulfillmentService {

    private static final Logger log = LoggerFactory.getLogger(FulfillmentService.class);

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    private final Random random = new Random();

    /**
     * Automatic Stock Reservation & Smart Multi-Warehouse Routing Algorithm
     */
    @Transactional
    public void selectAndReserveInventory(Order order) {
        if (order == null || order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            return;
        }

        log.info("Running selectAndReserveInventory algorithm for Order #{}", order.getOrderNumber());

        String destState = order.getShippingState() != null ? order.getShippingState().trim().toLowerCase() : "";
        String destCity = order.getShippingCity() != null ? order.getShippingCity().trim().toLowerCase() : "";

        Location primaryLocation = null;

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product == null) continue;

            int requiredQty = item.getQuantity();

            // Find all available inventories with sufficient quantity
            List<Inventory> candidateInventories = inventoryRepository.findAvailableInventoryForProduct(product.getId(), requiredQty);

            Inventory selectedInventory = null;

            if (!candidateInventories.isEmpty()) {
                // 1. Try to find location matching state or city
                for (Inventory inv : candidateInventories) {
                    Location loc = inv.getLocation();
                    if (loc != null && loc.isActive()) {
                        String locState = loc.getState() != null ? loc.getState().trim().toLowerCase() : "";
                        String locCity = loc.getCity() != null ? loc.getCity().trim().toLowerCase() : "";
                        if ((!destState.isEmpty() && locState.contains(destState)) || (!destCity.isEmpty() && locCity.contains(destCity))) {
                            selectedInventory = inv;
                            break;
                        }
                    }
                }

                // 2. If no regional match, pick Central Warehouse or location with highest available stock
                if (selectedInventory == null) {
                    selectedInventory = candidateInventories.get(0);
                }
            } else {
                // If specific warehouse inventory not pre-seeded, fallback to first active location and allocate
                List<Location> activeLocations = locationRepository.findByActiveTrue();
                Location fallbackLoc = activeLocations.isEmpty() ? null : activeLocations.get(0);

                if (fallbackLoc != null) {
                    selectedInventory = inventoryRepository.findByProductAndLocation(product, fallbackLoc)
                            .orElseGet(() -> {
                                Inventory newInv = new Inventory(product, fallbackLoc, product.getStockQuantity(), 10, "AISLE-01/BAY-01");
                                return inventoryRepository.save(newInv);
                            });
                }
            }

            if (selectedInventory != null) {
                int prevOnHand = selectedInventory.getQuantityOnHand();
                int prevReserved = selectedInventory.getQuantityReserved();

                selectedInventory.setQuantityReserved(prevReserved + requiredQty);
                selectedInventory.setQuantityAvailable(Math.max(0, selectedInventory.getQuantityOnHand() - selectedInventory.getQuantityReserved()));
                inventoryRepository.save(selectedInventory);

                // Audit transaction log
                InventoryTransaction tx = new InventoryTransaction(
                        selectedInventory,
                        product,
                        selectedInventory.getLocation(),
                        order,
                        InventoryTransactionType.RESERVE,
                        requiredQty,
                        prevOnHand,
                        selectedInventory.getQuantityOnHand(),
                        prevReserved,
                        selectedInventory.getQuantityReserved(),
                        order.getOrderNumber(),
                        "System Routing Algorithm",
                        "Automatic Stock Reservation for Order " + order.getOrderNumber()
                );
                inventoryTransactionRepository.save(tx);

                // Update order item fulfillment fields
                item.setAllocatedLocationId(selectedInventory.getLocation().getId());
                item.setAllocatedLocationName(selectedInventory.getLocation().getName());
                item.setBinRackNumber(selectedInventory.getBinRackNumber() != null ? selectedInventory.getBinRackNumber() : "BAY-A1");
                item.setItemStatus("PENDING");
                orderItemRepository.save(item);

                if (primaryLocation == null) {
                    primaryLocation = selectedInventory.getLocation();
                }
            }
        }

        if (primaryLocation != null) {
            order.setFulfillmentLocationId(primaryLocation.getId());
            order.setFulfillmentLocationName(primaryLocation.getName());
            order.setFulfillmentLocationCode(primaryLocation.getCode());
            orderRepository.save(order);
        }
    }

    /**
     * Release Reserved Stock when Order is Cancelled
     */
    @Transactional
    public void releaseReservedInventory(Order order) {
        if (order == null || order.getOrderItems() == null) return;

        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct() != null && item.getAllocatedLocationId() != null) {
                inventoryRepository.findByProductIdAndLocationId(item.getProduct().getId(), item.getAllocatedLocationId())
                        .ifPresent(inv -> {
                            int prevOnHand = inv.getQuantityOnHand();
                            int prevReserved = inv.getQuantityReserved();
                            int newReserved = Math.max(0, prevReserved - item.getQuantity());

                            inv.setQuantityReserved(newReserved);
                            inv.setQuantityAvailable(Math.max(0, inv.getQuantityOnHand() - newReserved));
                            inventoryRepository.save(inv);

                            InventoryTransaction tx = new InventoryTransaction(
                                    inv,
                                    item.getProduct(),
                                    inv.getLocation(),
                                    order,
                                    InventoryTransactionType.RELEASE,
                                    item.getQuantity(),
                                    prevOnHand,
                                    inv.getQuantityOnHand(),
                                    prevReserved,
                                    newReserved,
                                    order.getOrderNumber(),
                                    "System Fulfillment Service",
                                    "Released stock due to Order cancellation"
                            );
                            inventoryTransactionRepository.save(tx);
                        });
            }
        }
    }

    /**
     * Fulfill & Deduct Physical Inventory upon Shipping
     */
    @Transactional
    public void fulfillAndDeductInventory(Order order) {
        if (order == null || order.getOrderItems() == null) return;

        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct() != null && item.getAllocatedLocationId() != null) {
                inventoryRepository.findByProductIdAndLocationId(item.getProduct().getId(), item.getAllocatedLocationId())
                        .ifPresent(inv -> {
                            int prevOnHand = inv.getQuantityOnHand();
                            int prevReserved = inv.getQuantityReserved();
                            int newOnHand = Math.max(0, prevOnHand - item.getQuantity());
                            int newReserved = Math.max(0, prevReserved - item.getQuantity());

                            inv.setQuantityOnHand(newOnHand);
                            inv.setQuantityReserved(newReserved);
                            inv.setQuantityAvailable(Math.max(0, newOnHand - newReserved));
                            inventoryRepository.save(inv);

                            InventoryTransaction tx = new InventoryTransaction(
                                    inv,
                                    item.getProduct(),
                                    inv.getLocation(),
                                    order,
                                    InventoryTransactionType.DEDUCT_FULFILLMENT,
                                    item.getQuantity(),
                                    prevOnHand,
                                    newOnHand,
                                    prevReserved,
                                    newReserved,
                                    order.getOrderNumber(),
                                    "Warehouse Dispatch",
                                    "Stock deducted for dispatched order " + order.getOrderNumber()
                            );
                            inventoryTransactionRepository.save(tx);
                        });
            }
        }
    }

    /**
     * PICK Action - Warehouse Picker collects items from racks/bins
     */
    @Transactional
    public Order pickOrder(Long orderId, String pickedBy, String pickerNotes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setOrderStatus(OrderStatus.PICKED);
        order.setPickedAt(LocalDateTime.now());
        order.setPickedBy(pickedBy != null && !pickedBy.isBlank() ? pickedBy : "Ravikant Singh (Manager)");
        order.setPickerNotes(pickerNotes != null ? pickerNotes : "All items picked from assigned racks and verified against manifest.");

        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setItemStatus("PICKED");
                orderItemRepository.save(item);
            }
        }

        return orderRepository.save(order);
    }

    /**
     * PACK Action - Warehouse Packer packs items into box, weighs, and seals
     */
    @Transactional
    public Order packOrder(Long orderId, String packedBy, Double weightKg, String boxSize, String barcode) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setOrderStatus(OrderStatus.PACKED);
        order.setPackedAt(LocalDateTime.now());
        order.setPackedBy(packedBy != null && !packedBy.isBlank() ? packedBy : "Ravikant Singh (Manager)");
        order.setPackageWeightKg(weightKg != null ? weightKg : 0.45);
        order.setPackageBoxSize(boxSize != null && !boxSize.isBlank() ? boxSize : "Medium (30x20x10 cm)");
        order.setPackageBarcode(barcode != null && !barcode.isBlank() ? barcode : ("BOX-PKG-" + (100000 + random.nextInt(900000))));

        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setItemStatus("PACKED");
                orderItemRepository.save(item);
            }
        }

        return orderRepository.save(order);
    }

    /**
     * READY TO SHIP Action - Generates AWB, assigns fleet courier, creates dispatch manifest
     */
    @Transactional
    public Order readyToShipOrder(Long orderId, String manifestedBy, Long deliveryPartnerId, String courierName, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setOrderStatus(OrderStatus.READY_TO_SHIP);
        order.setReadyToShipAt(LocalDateTime.now());
        order.setManifestBatchId("MANIFEST-" + LocalDateToString() + "-" + (1000 + random.nextInt(9000)));

        if (trackingNumber != null && !trackingNumber.isBlank()) {
            order.setTrackingNumber(trackingNumber);
        } else if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
            order.setTrackingNumber("AWB-SZ-" + (10000000 + random.nextInt(90000000)));
        }

        if (courierName != null && !courierName.isBlank()) {
            order.setCourierName(courierName);
        } else if (order.getCourierName() == null || order.getCourierName().isBlank()) {
            order.setCourierName("ShopZone Express Air Fleet");
        }

        if (deliveryPartnerId != null) {
            DeliveryPartner partner = deliveryPartnerRepository.findById(deliveryPartnerId)
                    .orElse(null);
            if (partner != null) {
                order.setDeliveryPartner(partner);
                order.setDeliveryAssignedAt(LocalDateTime.now());
                if (order.getDeliveryOtp() == null) {
                    order.setDeliveryOtp(String.format("%04d", random.nextInt(10000)));
                }
            }
        }

        fulfillAndDeductInventory(order);

        return orderRepository.save(order);
    }

    /**
     * Transfer Stock between Warehouses
     */
    @Transactional
    public void transferStock(StockTransferRequest req) {
        if (req.getFromLocationId().equals(req.getToLocationId())) {
            throw new BadRequestException("Source and destination warehouses cannot be the same");
        }

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", req.getProductId()));

        Location fromLoc = locationRepository.findById(req.getFromLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", req.getFromLocationId()));

        Location toLoc = locationRepository.findById(req.getToLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", req.getToLocationId()));

        Inventory fromInv = inventoryRepository.findByProductAndLocation(product, fromLoc)
                .orElseThrow(() -> new BadRequestException("No inventory found at source location for product: " + product.getName()));

        if (fromInv.getQuantityAvailable() < req.getQuantity()) {
            throw new BadRequestException("Insufficient available stock at source location. Available: " + fromInv.getQuantityAvailable());
        }

        Inventory toInv = inventoryRepository.findByProductAndLocation(product, toLoc)
                .orElseGet(() -> {
                    Inventory newInv = new Inventory(product, toLoc, 0, 10, "TRANSFER-BAY");
                    return inventoryRepository.save(newInv);
                });

        // 1. Deduct from source
        int fromPrevOnHand = fromInv.getQuantityOnHand();
        fromInv.setQuantityOnHand(fromPrevOnHand - req.getQuantity());
        inventoryRepository.save(fromInv);

        InventoryTransaction txOut = new InventoryTransaction(
                fromInv,
                product,
                fromLoc,
                null,
                InventoryTransactionType.TRANSFER_OUT,
                req.getQuantity(),
                fromPrevOnHand,
                fromInv.getQuantityOnHand(),
                fromInv.getQuantityReserved(),
                fromInv.getQuantityReserved(),
                "TRF-" + System.currentTimeMillis(),
                req.getPerformedBy() != null ? req.getPerformedBy() : "Admin",
                "Transferred " + req.getQuantity() + " units to " + toLoc.getName() + ". " + (req.getNotes() != null ? req.getNotes() : "")
        );
        inventoryTransactionRepository.save(txOut);

        // 2. Add to destination
        int toPrevOnHand = toInv.getQuantityOnHand();
        toInv.setQuantityOnHand(toPrevOnHand + req.getQuantity());
        inventoryRepository.save(toInv);

        InventoryTransaction txIn = new InventoryTransaction(
                toInv,
                product,
                toLoc,
                null,
                InventoryTransactionType.TRANSFER_IN,
                req.getQuantity(),
                toPrevOnHand,
                toInv.getQuantityOnHand(),
                toInv.getQuantityReserved(),
                toInv.getQuantityReserved(),
                "TRF-" + System.currentTimeMillis(),
                req.getPerformedBy() != null ? req.getPerformedBy() : "Admin",
                "Received " + req.getQuantity() + " units from " + fromLoc.getName() + ". " + (req.getNotes() != null ? req.getNotes() : "")
        );
        inventoryTransactionRepository.save(txIn);
    }

    /**
     * Manual Inventory Stock Adjustment
     */
    @Transactional
    public InventoryDto adjustStock(StockAdjustmentRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", req.getProductId()));

        Location loc = locationRepository.findById(req.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location", "id", req.getLocationId()));

        Inventory inv = inventoryRepository.findByProductAndLocation(product, loc)
                .orElseGet(() -> new Inventory(product, loc, 0, 10, req.getBinRackNumber() != null ? req.getBinRackNumber() : "BAY-01"));

        int prevOnHand = inv.getQuantityOnHand();
        int newOnHand = req.getNewQuantityOnHand();
        int delta = newOnHand - prevOnHand;

        inv.setQuantityOnHand(newOnHand);
        if (req.getBinRackNumber() != null && !req.getBinRackNumber().isBlank()) {
            inv.setBinRackNumber(req.getBinRackNumber());
        }
        Inventory saved = inventoryRepository.save(inv);

        // Sync Product total stock
        Integer totalStock = inventoryRepository.getTotalAvailableQuantityForProduct(product.getId());
        if (totalStock != null) {
            product.setStockQuantity(totalStock);
            productRepository.save(product);
        }

        InventoryTransaction tx = new InventoryTransaction(
                saved,
                product,
                loc,
                null,
                InventoryTransactionType.AUDIT_ADJUSTMENT,
                delta,
                prevOnHand,
                newOnHand,
                saved.getQuantityReserved(),
                saved.getQuantityReserved(),
                "ADJ-" + System.currentTimeMillis(),
                req.getPerformedBy() != null ? req.getPerformedBy() : "Admin",
                req.getNotes() != null ? req.getNotes() : "Manual inventory audit correction"
        );
        inventoryTransactionRepository.save(tx);

        return mapToInventoryDto(saved);
    }

    // Query Methods
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll().stream().map(this::mapToLocationDto).collect(Collectors.toList());
    }

    public List<InventoryDto> getInventories(Long productId, Long locationId) {
        List<Inventory> list;
        if (productId != null && locationId != null) {
            list = inventoryRepository.findByProductIdAndLocationId(productId, locationId)
                    .map(List::of).orElse(List.of());
        } else if (productId != null) {
            list = inventoryRepository.findByProductId(productId);
        } else if (locationId != null) {
            list = inventoryRepository.findByLocationId(locationId);
        } else {
            list = inventoryRepository.findAll();
        }
        return list.stream().map(this::mapToInventoryDto).collect(Collectors.toList());
    }

    public PagedResponse<InventoryTransactionDto> getTransactions(Long productId, Long locationId, InventoryTransactionType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<InventoryTransaction> txPage = inventoryTransactionRepository.searchTransactions(productId, locationId, type, pageable);

        List<InventoryTransactionDto> dtos = txPage.getContent().stream()
                .map(this::mapToTransactionDto).collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                txPage.getNumber(),
                txPage.getSize(),
                txPage.getTotalElements(),
                txPage.getTotalPages(),
                txPage.isLast()
        );
    }

    public LocationDto mapToLocationDto(Location loc) {
        LocationDto dto = new LocationDto();
        dto.setId(loc.getId());
        dto.setName(loc.getName());
        dto.setCode(loc.getCode());
        dto.setType(loc.getType());
        dto.setAddress(loc.getAddress());
        dto.setCity(loc.getCity());
        dto.setState(loc.getState());
        dto.setPostalCode(loc.getPostalCode());
        dto.setCountry(loc.getCountry());
        dto.setContactPerson(loc.getContactPerson());
        dto.setContactPhone(loc.getContactPhone());
        dto.setContactEmail(loc.getContactEmail());
        dto.setActive(loc.isActive());
        dto.setLatitude(loc.getLatitude());
        dto.setLongitude(loc.getLongitude());
        dto.setCreatedAt(loc.getCreatedAt());
        return dto;
    }

    public InventoryDto mapToInventoryDto(Inventory inv) {
        InventoryDto dto = new InventoryDto();
        dto.setId(inv.getId());
        if (inv.getProduct() != null) {
            dto.setProductId(inv.getProduct().getId());
            dto.setProductName(inv.getProduct().getName());
            dto.setProductSku(inv.getProduct().getSku());
            dto.setProductImage(inv.getProduct().getPrimaryImageUrl());
            dto.setUnitPrice(inv.getProduct().getPrice() != null ? inv.getProduct().getPrice().doubleValue() : 0.0);
        }
        if (inv.getLocation() != null) {
            dto.setLocationId(inv.getLocation().getId());
            dto.setLocationName(inv.getLocation().getName());
            dto.setLocationCode(inv.getLocation().getCode());
            dto.setLocationType(inv.getLocation().getType().name());
        }
        dto.setQuantityOnHand(inv.getQuantityOnHand());
        dto.setQuantityReserved(inv.getQuantityReserved());
        dto.setQuantityAvailable(inv.getQuantityAvailable());
        dto.setMinStockAlert(inv.getMinStockAlert());
        dto.setBinRackNumber(inv.getBinRackNumber());
        dto.setLowStock(inv.getQuantityAvailable() <= inv.getMinStockAlert());
        dto.setUpdatedAt(inv.getUpdatedAt());
        return dto;
    }

    public InventoryTransactionDto mapToTransactionDto(InventoryTransaction tx) {
        InventoryTransactionDto dto = new InventoryTransactionDto();
        dto.setId(tx.getId());
        if (tx.getProduct() != null) {
            dto.setProductId(tx.getProduct().getId());
            dto.setProductName(tx.getProduct().getName());
            dto.setProductSku(tx.getProduct().getSku());
        }
        if (tx.getLocation() != null) {
            dto.setLocationId(tx.getLocation().getId());
            dto.setLocationName(tx.getLocation().getName());
        }
        if (tx.getOrder() != null) {
            dto.setOrderId(tx.getOrder().getId());
            dto.setOrderNumber(tx.getOrder().getOrderNumber());
        }
        dto.setTransactionType(tx.getTransactionType());
        dto.setQuantity(tx.getQuantity());
        dto.setPreviousOnHand(tx.getPreviousOnHand());
        dto.setNewOnHand(tx.getNewOnHand());
        dto.setPreviousReserved(tx.getPreviousReserved());
        dto.setNewReserved(tx.getNewReserved());
        dto.setReferenceNumber(tx.getReferenceNumber());
        dto.setPerformedBy(tx.getPerformedBy());
        dto.setNotes(tx.getNotes());
        dto.setCreatedAt(tx.getCreatedAt());
        return dto;
    }

    private String LocalDateToString() {
        return LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
    }
}
