package com.ecommerce.repository;

import com.ecommerce.entity.DeliveryPartner;
import com.ecommerce.entity.DeliveryPartner.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    List<DeliveryPartner> findByActiveTrue();
    List<DeliveryPartner> findByStatusAndActiveTrue(DeliveryStatus status);
    Optional<DeliveryPartner> findByPhone(String phone);
    Optional<DeliveryPartner> findByNameIgnoreCase(String name);
    List<DeliveryPartner> findByCurrentAreaIgnoreCaseAndStatusAndActiveTrue(String area, DeliveryStatus status);
}
