package com.ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean enabled;
    private String avatarUrl;
    private List<AddressDto> addresses;
    private String tags;
    private String adminNotes;
    private LocalDateTime lastLoginAt;
    private String lastLoginIp;
    private String lastLoginUserAgent;
    private LocalDateTime createdAt;

    public UserDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public List<AddressDto> getAddresses() { return addresses; }
    public void setAddresses(List<AddressDto> addresses) { this.addresses = addresses; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public String getLastLoginIp() { return lastLoginIp; }
    public void setLastLoginIp(String lastLoginIp) { this.lastLoginIp = lastLoginIp; }

    public String getLastLoginUserAgent() { return lastLoginUserAgent; }
    public void setLastLoginUserAgent(String lastLoginUserAgent) { this.lastLoginUserAgent = lastLoginUserAgent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    private java.math.BigDecimal lifetimeValue = java.math.BigDecimal.ZERO;
    private int totalOrders = 0;

    public java.math.BigDecimal getLifetimeValue() { return lifetimeValue; }
    public void setLifetimeValue(java.math.BigDecimal lifetimeValue) { this.lifetimeValue = lifetimeValue; }

    public int getTotalOrders() { return totalOrders; }
    public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }
}
