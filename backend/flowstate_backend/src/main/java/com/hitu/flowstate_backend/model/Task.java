package com.hitu.flowstate_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "cognitive_load", nullable = false)
    private String cognitiveLoad;

    // Constructors
    public Task() {}

    public Task(String timeSlot, String title, String description, Integer duration, String cognitiveLoad) {
        this.timeSlot = timeSlot;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.cognitiveLoad = cognitiveLoad;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getCognitiveLoad() { return cognitiveLoad; }
    public void setCognitiveLoad(String cognitiveLoad) { this.cognitiveLoad = cognitiveLoad; }
}