package com.hitu.flowstate_backend.repository;

import com.hitu.flowstate_backend.model.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByTaskId(Long taskId);
}
