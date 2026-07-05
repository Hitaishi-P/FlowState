package com.hitu.flowstate_backend.service;

import com.hitu.flowstate_backend.model.BiometricData;
import com.hitu.flowstate_backend.model.User;
import com.hitu.flowstate_backend.repository.BiometricDataRepository;
import com.hitu.flowstate_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class BiometricDataService {

    private final BiometricDataRepository biometricDataRepository;
    private final UserRepository userRepository;

    public BiometricDataService(BiometricDataRepository biometricDataRepository, UserRepository userRepository) {
        this.biometricDataRepository = biometricDataRepository;
        this.userRepository = userRepository;
    }

    // Logs today's (or any day's) biometric reading for a user.
    // If a reading already exists for that date, this updates it instead
    // of creating a duplicate row -- important since wearables can sync
    // multiple times a day.
    public BiometricData logBiometricData(Long userId, LocalDate logDate, Double sleepHours,
                                          Integer sleepScore, Double hrv, Integer restingHeartRate,
                                          Integer readinessScore, Integer stressLevel) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        BiometricData data = biometricDataRepository
                .findByUserIdAndLogDate(userId, logDate)
                .orElse(new BiometricData()); // reuse existing row, or start a fresh one

        data.setUser(user);
        data.setLogDate(logDate);
        data.setSleepHours(sleepHours);
        data.setSleepScore(sleepScore);
        data.setHrv(hrv);
        data.setRestingHeartRate(restingHeartRate);
        data.setReadinessScore(readinessScore);
        data.setStressLevel(stressLevel);

        return biometricDataRepository.save(data);
    }

    public Optional<BiometricData> getBiometricDataForDate(Long userId, LocalDate date) {
        return biometricDataRepository.findByUserIdAndLogDate(userId, date);
    }
}