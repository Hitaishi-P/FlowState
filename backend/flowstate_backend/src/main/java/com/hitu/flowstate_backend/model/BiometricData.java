package com.hitu.flowstate_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "biometric_data", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "log_date"})
})
@Getter
@Setter
@NoArgsConstructor
public class BiometricData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    private Double sleepHours;
    private Integer sleepScore;
    private Double hrv;
    private Integer restingHeartRate;
    private Integer readinessScore;
    private Integer stressLevel;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
