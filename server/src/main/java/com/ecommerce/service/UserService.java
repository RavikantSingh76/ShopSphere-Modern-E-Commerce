package com.ecommerce.service;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.dto.ChangePasswordRequest;
import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.Address;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto getUserProfile(User user) {
        return mapToUserDto(user);
    }

    @Transactional
    public UserDto updateUserProfile(User user, UserDto dto) {
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }
        User saved = userRepository.save(user);
        return mapToUserDto(saved);
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public List<AddressDto> getUserAddresses(User user) {
        return addressRepository.findByUser(user).stream()
                .map(this::mapToAddressDto).collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(User user, AddressDto dto) {
        Address address = new Address();
        address.setUser(user);
        address.setFullName(dto.getFullName());
        address.setPhone(dto.getPhone());
        address.setStreetAddress(dto.getStreetAddress());
        address.setApartment(dto.getApartment());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");

        List<Address> existing = addressRepository.findByUser(user);
        if (existing.isEmpty() || dto.isDefault()) {
            existing.forEach(a -> { a.setDefault(false); addressRepository.save(a); });
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }

        Address saved = addressRepository.save(address);
        return mapToAddressDto(saved);
    }

    @Transactional
    public AddressDto updateAddress(User user, Long id, AddressDto dto) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));

        address.setFullName(dto.getFullName());
        address.setPhone(dto.getPhone());
        address.setStreetAddress(dto.getStreetAddress());
        address.setApartment(dto.getApartment());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());

        if (dto.isDefault()) {
            addressRepository.findByUser(user).forEach(a -> {
                if (!a.getId().equals(id)) {
                    a.setDefault(false);
                    addressRepository.save(a);
                }
            });
            address.setDefault(true);
        }

        Address saved = addressRepository.save(address);
        return mapToAddressDto(saved);
    }

    @Transactional
    public void deleteAddress(User user, Long id) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));
        addressRepository.delete(address);
    }

    @Transactional
    public void setDefaultAddress(User user, Long id) {
        List<Address> addresses = addressRepository.findByUser(user);
        for (Address addr : addresses) {
            addr.setDefault(addr.getId().equals(id));
            addressRepository.save(addr);
        }
    }

    public UserDto mapToUserDto(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name());
        dto.setEnabled(user.isEnabled());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setTags(user.getTags());
        dto.setAdminNotes(user.getAdminNotes());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setLastLoginIp(user.getLastLoginIp());
        dto.setLastLoginUserAgent(user.getLastLoginUserAgent());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getAddresses() != null) {
            dto.setAddresses(user.getAddresses().stream().map(this::mapToAddressDto).collect(Collectors.toList()));
        }
        return dto;
    }

    public AddressDto mapToAddressDto(Address address) {
        if (address == null) return null;
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setFullName(address.getFullName());
        dto.setPhone(address.getPhone());
        dto.setStreetAddress(address.getStreetAddress());
        dto.setApartment(address.getApartment());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        dto.setDefault(address.isDefault());
        return dto;
    }
}
