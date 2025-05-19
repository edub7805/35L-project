package com.example.backend.jobpost;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import jakarta.validation.Valid;
import java.security.Principal;


@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/api")
public class JobPostController {
    private final JobPostService service;
    public JobPostController(JobPostService service) { this.service = service; }

    @GetMapping("/jobs")
    public List<JobPost> listByStatus(
            @RequestParam(required = false) JobPostStatus status
    ) {
        if (status != null) {
            return service.findByStatus(status);
        }
        return service.findAll();
    }
    
    @PostMapping("/users/{userId}/jobs")
    @ResponseStatus(HttpStatus.CREATED)
    public JobPost create(
            @PathVariable String userId,
            @Valid @RequestBody CreateJobRequest dto
    ) {
        // delegate creation to service which takes userId and DTO
        return service.create(userId, dto);
    }

    @GetMapping("/users/{userId}/jobs")
    public List<JobPost> listForUser(@PathVariable String userId) {
        return service.findByUser(userId);
    }

    @GetMapping("/jobs/{jobId}")
    public JobPost getJob(@PathVariable String jobId) {
        return service.getById(jobId);
    }

    // you could add PUT /jobs/{jobId}, DELETE /jobs/{jobId}, etc.
}
