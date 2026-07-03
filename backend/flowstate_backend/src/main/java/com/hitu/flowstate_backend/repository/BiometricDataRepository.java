package com.hitu.flowstate_backend.repository;

import com.yourpackage.model.BiometricData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface BiometricDataRepository extends JpaRepository<BiometricData, Long> {
    // Get today's reading for a user -> for feeding into the AI scheduler
    Optional<BiometricData> findByUserIdAndLogDate(Long userId, LocalDate logDate);
}