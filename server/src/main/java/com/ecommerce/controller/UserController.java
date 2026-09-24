package com.ecommerce.controller;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.ChangePasswordRequest;
import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfile(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody UserDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.updateUserProfile(user, dto)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        userService.changePassword(user, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(userService.getUserAddresses(user)));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(@Valid @RequestBody AddressDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        AddressDto created = userService.addAddress(user, dto);
        return new ResponseEntity<>(ApiResponse.success("Address added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", userService.updateAddress(user, id, dto)));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        userService.deleteAddress(user, id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }

    @PutMapping("/addresses/{id}/default")
    public ResponseEntity<ApiResponse<Void>> setDefaultAddress(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        userService.setDefaultAddress(user, id);
        return ResponseEntity.ok(ApiResponse.success("Default address updated", null));
    }
}
