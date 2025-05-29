package com.example.backend.jobpost;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import jakarta.validation.Valid;

/**
 * Exposes endpoints for querying and mutating JobPost entities.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class JobPostController {

    private final JobPostService service;

    public JobPostController(JobPostService service) {
        this.service = service;
    }

    /**
     * List all jobs, optionally filtered by status.
     * GET /api/jobs?status=OPEN
     */
    @GetMapping("/jobs")
    public List<JobPost> listByStatus(
            @RequestParam(required = false) JobPostStatus status
    ) {
        if (status != null) {
            return service.findByStatus(status);
        }
        return service.findAll();
    }

    /**
     * List outgoing jobs (those you posted), optionally filtered by a list of statuses.
     * GET /api/users/{userId}/jobs?statuses=OPEN,IN_PROGRESS
     */
    @GetMapping("/users/{userId}/jobs")
    public List<JobPost> listOutgoing(
            @PathVariable String userId,
            @RequestParam(required = false) List<JobPostStatus> statuses
    ) {
        if (statuses != null && !statuses.isEmpty()) {
            return service.findByUserIdAndStatuses(userId, statuses);
        }
        // Default: return all non-archived
        return service.findByUserIdAndStatuses(userId, List.of(
            JobPostStatus.OPEN,
            JobPostStatus.IN_PROGRESS,
            JobPostStatus.COMPLETED
        ));
    }

    /**
     * List picked-up jobs (those assigned to you), optionally filtered by a list of statuses.
     * GET /api/users/{userId}/assigned-jobs?statuses=IN_PROGRESS
     */
    @GetMapping("/users/{userId}/assigned-jobs")
    public List<JobPost> listPickedUp(
            @PathVariable String userId,
            @RequestParam(required = false) List<JobPostStatus> statuses
    ) {
        if (statuses != null && !statuses.isEmpty()) {
            return service.findByAssignedUserIdAndStatuses(userId, statuses);
        }
        // Default: show in-progress and completed
        return service.findByAssignedUserIdAndStatuses(userId, List.of(
            JobPostStatus.IN_PROGRESS,
            JobPostStatus.COMPLETED
        ));
    }

    /**
     * Create a new job under a given user.
     * POST /api/users/{userId}/jobs
     */
    @PostMapping("/users/{userId}/jobs")
    @ResponseStatus(HttpStatus.CREATED)
    public JobPost create(
             @PathVariable String userId,
            @Valid @RequestBody CreateJobRequest dto
    ) {
        return service.create(userId, dto);
    }

    /**
     * Retrieve a single job by its ID.
     * GET /api/jobs/{jobId}
     */
    @GetMapping("/jobs/{jobId}")
    public JobPost getJob(@PathVariable String jobId) {
        return service.getById(jobId);
    }

    /**
     * Pick up a job: sets assignedUserId to the requesting user and flips status to IN_PROGRESS.
     * PUT /api/jobs/{jobId}/pickup?userId={userId}
     */
    @PutMapping("/jobs/{jobId}/pickup")
    @ResponseStatus(HttpStatus.OK)
    public void pickUpJob(
            @PathVariable String jobId,
            @RequestParam String userId
    ) {
        service.pickUpJob(jobId, userId);
    }

    @PutMapping("/jobs/{jobId}/complete")
    @ResponseStatus(HttpStatus.OK)
    public void complete(
            @PathVariable String jobId,
            @RequestParam String userId
    ) {
        service.complete(jobId);
    }

    // Additional endpoints (update status, delete, etc.) can go here
}
