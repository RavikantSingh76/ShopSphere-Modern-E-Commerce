package com.ecommerce.dto;

import java.util.ArrayList;
import java.util.List;

public class WishlistResponse {
    private Long id;
    private List<WishlistItemDto> items = new ArrayList<>();
    private int totalCount;

    public WishlistResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<WishlistItemDto> getItems() { return items; }
    public void setItems(List<WishlistItemDto> items) { this.items = items; }

    public int getTotalCount() { return totalCount; }
    public void setTotalCount(int totalCount) { this.totalCount = totalCount; }
}
