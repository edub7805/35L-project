package com.example.backend.review;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String jobId;        // FK → Job.id
    private String authorId;     // FK → User.id
    private int rating;          // 1–5
    private String text;         // optional feedback
    private Instant createdAt;
    private Instant updatedAt;

    public Review() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Review(String jobId, String authorId, int rating, String text) {
        this.jobId = jobId;
        this.authorId = authorId;
        this.rating = rating;
        this.text = text;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    
    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}