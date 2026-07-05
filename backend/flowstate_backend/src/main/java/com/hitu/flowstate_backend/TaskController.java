package com.hitu.flowstate_backend.controller;

import com.hitu.flowstate_backend.dto.TaskRequest;
import com.hitu.flowstate_backend.dto.TaskResponse;
import com.hitu.flowstate_backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// @RestController = every method's return value gets auto-converted to JSON
// and sent as the HTTP response body. No manual serialization needed.
@RestController
@RequestMapping("/api/tasks") // every endpoint in this class starts with this path
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET http://localhost:8080/api/tasks?userId=1&date=2026-07-05
    @GetMapping
    public List<TaskResponse> getTasksForDay(
            @RequestParam Long userId,
            @RequestParam(required = false) LocalDate date) {

        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        return taskService.getTasksForDay(userId, targetDate);
    }

    // POST http://localhost:8080/api/tasks?userId=1
    // Body: JSON matching TaskRequest
    @PostMapping
    public TaskResponse createTask(
            @RequestParam Long userId,
            @Valid @RequestBody TaskRequest request) {

        return taskService.createTask(userId, request);
    }

    // PATCH http://localhost:8080/api/tasks/5/status?status=COMPLETED
    @PatchMapping("/{taskId}/status")
    public TaskResponse updateStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {

        return taskService.updateTaskStatus(taskId, status);
    }

    // DELETE http://localhost:8080/api/tasks/5
    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}