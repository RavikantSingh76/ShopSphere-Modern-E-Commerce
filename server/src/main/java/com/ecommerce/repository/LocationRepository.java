package com.ecommerce.repository;

import com.ecommerce.entity.Location;
import com.ecommerce.entity.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByCode(String code);
    List<Location> findByActiveTrue();
    List<Location> findByTypeAndActiveTrue(LocationType type);
    List<Location> findByCityIgnoreCase(String city);
    List<Location> findByStateIgnoreCase(String state);
}
