package com.hitu.flowstate_backend.dto;

import com.hitu.flowstate_backend.model.Task;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String cognitiveLoad;   // "DEEP" / "REST" / "LOW" as a plain string
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private Integer durationMinutes;
    private String status;

    // A "mapper" method: converts a DB entity into this safe outward-facing shape
    public static TaskResponse fromEntity(Task task) {
        TaskResponse dto = new TaskResponse();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCognitiveLoad(task.getCognitiveLoad().name());
        dto.setScheduledDate(task.getScheduledDate());
        dto.setScheduledTime(task.getScheduledTime());
        dto.setDurationMinutes(task.getDurationMinutes());
        dto.setStatus(task.getStatus().name());
        return dto;
    }
}