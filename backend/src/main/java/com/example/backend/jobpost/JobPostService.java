package com.example.backend.jobpost;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.batch.BatchProperties.Job;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.List;

@Service
public class JobPostService {
    @Autowired
    private JobPostRepository repo;

    public JobPost create(String userId, CreateJobRequest dto) {
        JobPost post = new JobPost();
        post.setUserId(userId);
        post.setJobName(dto.getJobName());
        post.setTime(dto.getTime());
        post.setDescription(dto.getDescription());
        post.setStatus(JobPostStatus.OPEN);
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        return repo.save(post);
    }

    public List<JobPost> findAll() {
        return repo.findAll();
    }
    // pass in the object JobPostStatus defined in JobPostStatus.org
    public List<JobPost> findByStatus(JobPostStatus status) {
        return repo.findByStatus(status);
    }

    public List<JobPost> findByUser(String userId) {
        return repo.findByUserIdAndStatusIn(userId,
                List.of(JobPostStatus.DRAFT, JobPostStatus.OPEN, JobPostStatus.IN_PROGRESS, JobPostStatus.COMPLETED));
    }

    public JobPost getById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + id));
    }

    public List<JobPost> getPublic() {
        return repo.findByStatus(JobPostStatus.OPEN);
    }

    public JobPost assign(String id, String buyerId) {
        JobPost post = getById(id);
        post.setAssignedUserId(buyerId);
        post.setStatus(JobPostStatus.IN_PROGRESS);
        post.setUpdatedAt(Instant.now());
        return repo.save(post);
    }

    public JobPost complete(String id) {
        JobPost post = getById(id);
        post.setStatus(JobPostStatus.COMPLETED);
        post.setCompletedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        return repo.save(post);
    }

    public JobPost pickUpJob(String jobId, String userId) {
        JobPost job = repo.findById(jobId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        job.setStatus(JobPostStatus.IN_PROGRESS);
        job.setAssignedTo(userId);
        return repo.save(job);
        }
}
