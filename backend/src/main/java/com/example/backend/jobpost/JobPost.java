package com.example.backend.jobpost;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection="jobpost")
public class JobPost {
    @Id
    private String id;
    private String userId;       // who posted it
    private String jobName;
    private String date;
    private String startTime;
    private String endTime;
    private String description;

    private String assignedUserId;  // buyer/customer
    private JobPostStatus status = JobPostStatus.OPEN;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private Instant completedAt;

    private String assignedTo;

    private int    reviewCount   = 0;
    private int    ratingSum     = 0;
    private double averageRating = 0.0;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssignedUserId() { return assignedUserId; }
    public void setAssignedUserId(String assignedUserId) { this.assignedUserId = assignedUserId; }

    public JobPostStatus getStatus() { return status; }
    public void setStatus(JobPostStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String userId) { this.assignedTo = userId; }

    public int    getReviewCount() { return reviewCount; }
    public void   setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public int    getRatingSum() { return ratingSum; }
    public void   setRatingSum(int ratingSum) { this.ratingSum = ratingSum; }
    public double getAverageRating() { return averageRating; }
    public void   setAverageRating(double averageRating) { this.averageRating = averageRating; }
    // constructors, getters/setters...
}
