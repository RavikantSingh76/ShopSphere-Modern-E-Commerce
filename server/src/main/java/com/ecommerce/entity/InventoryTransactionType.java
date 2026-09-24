package com.ecommerce.entity;

public enum InventoryTransactionType {
    RECEIVE,
    RESERVE,
    RELEASE,
    DEDUCT_FULFILLMENT,
    TRANSFER_OUT,
    TRANSFER_IN,
    AUDIT_ADJUSTMENT,
    RETURN_RESTOCK
}
