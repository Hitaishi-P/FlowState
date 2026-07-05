package com.hitu.flowstate_backend.service;

import com.hitu.flowstate_backend.dto.TaskRequest;
import com.hitu.flowstate_backend.dto.TaskResponse;
import com.hitu.flowstate_backend.model.Task;
import com.hitu.flowstate_backend.model.User;
import com.hitu.flowstate_backend.repository.TaskRepository;
import com.hitu.flowstate_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

// @Service marks this as a "business logic" bean -- Spring creates one
// instance of this class automatically and lets you @Autowired it
// wherever you need it (mainly in controllers).
@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // Constructor injection: Spring sees this constructor and automatically
    // passes in the TaskRepository/UserRepository beans it already manages.
    // You never call "new TaskService(...)" yourself -- Spring does it.
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponse> getTasksForDay(Long userId, LocalDate date) {
        List<Task> tasks = taskRepository.findByUserIdAndScheduledDateOrderByScheduledTimeAsc(userId, date);
        return tasks.stream()
                .map(TaskResponse::fromEntity) // convert each entity -> safe DTO
                .toList();
    }

    public TaskResponse createTask(Long userId, TaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Task task = new Task();
        task.setUser(user);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCognitiveLoad(Task.CognitiveLoad.valueOf(request.getCognitiveLoad().toUpperCase()));
        task.setScheduledDate(request.getScheduledDate());
        task.setScheduledTime(request.getScheduledTime());
        task.setDurationMinutes(request.getDurationMinutes());

        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public TaskResponse updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus(Task.TaskStatus.valueOf(status.toUpperCase()));
        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}