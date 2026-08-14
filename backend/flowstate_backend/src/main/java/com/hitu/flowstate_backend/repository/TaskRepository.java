package com.hitu.flowstate_backend.repository;

import com.hitu.flowstate_backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Get all of a user's tasks for one day, e.g. to render the Timeline
    List<Task> findByUserIdAndScheduledDateOrderByScheduledTimeAsc(Long userId, LocalDate scheduledDate);
}