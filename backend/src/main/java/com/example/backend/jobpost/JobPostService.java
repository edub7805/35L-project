package com.example.backend.jobpost;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.Instant;
import java.util.List;

@Service
public class JobPostService {

    @Autowired
    private JobPostRepository repo;

    /**
     * Create a new job post for the given user.
     */
    public JobPost create(String userId, CreateJobRequest dto) {
        JobPost post = new JobPost();
        post.setUserId(userId);
        post.setJobName(dto.getJobName());
        post.setDate(dto.getDate());
        post.setStartTime(dto.getStartTime());
        post.setEndTime(dto.getEndTime());
        post.setDescription(dto.getDescription());
        post.setStatus(JobPostStatus.OPEN);
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        return repo.save(post);
    }

    /**
     * Retrieve all job posts.
     */
    public List<JobPost> findAll() {
        return repo.findAll();
    }

    /**
     * Retrieve jobs by status.
     */
    public List<JobPost> findByStatus(JobPostStatus status) {
        return repo.findByStatus(status);
    }

    /**
     * Retrieve jobs posted by a specific user, filtered by given statuses.
     */
    public List<JobPost> findByUserIdAndStatuses(String userId, List<JobPostStatus> statuses) {
        return repo.findByUserIdAndStatusIn(userId, statuses);
    }

    /**
     * Retrieve jobs assigned to a specific user, filtered by given statuses.
     */
    public List<JobPost> findByAssignedUserIdAndStatuses(String assignedUserId, List<JobPostStatus> statuses) {
        return repo.findByAssignedUserIdAndStatusIn(assignedUserId, statuses);
    }

    /**
     * Get a job post by ID, or throw 404 if not found.
     */
    public JobPost getById(String id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Job not found: " + id
            ));
    }

    /**
     * Pick up a job: set assignedUserId, mark in-progress, update timestamp.
     */
    public JobPost pickUpJob(String jobId, String userId) {
        JobPost job = getById(jobId);
        job.setAssignedUserId(userId);
        job.setStatus(JobPostStatus.IN_PROGRESS);
        job.setUpdatedAt(Instant.now());
        return repo.save(job);
    }

    /**
     * Mark a job as completed.
     */
    public JobPost complete(String jobId) {
        JobPost post = getById(jobId);
        post.setStatus(JobPostStatus.COMPLETED);
        post.setCompletedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        return repo.save(post);
    }
}
