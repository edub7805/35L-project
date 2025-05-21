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
    private String time;
    private String description;

    private String assignedUserId;  // buyer/customer
    private JobPostStatus status = JobPostStatus.OPEN;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private Instant completedAt;

    private String assignedTo;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

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

    
    public void setAssignedTo(String userId) { this.assignedTo = userId; }
    // constructors, getters/setters...
}
