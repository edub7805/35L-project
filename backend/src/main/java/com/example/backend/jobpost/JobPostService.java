package com.example.backend.jobpost;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.example.backend.jobpost.JobPost;
import com.example.backend.jobpost.JobPostRepository;
import com.example.backend.jobpost.ResourceNotFoundException;


@Service
public class JobPostService {
    @Autowired private JobPostRepository repo;

    public JobPost create(JobPost post) {
        return repo.save(post);
    }

    public List<JobPost> findByUser(String userId) {
        return repo.findByUserId(userId);
    }

    public JobPost getById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
    }

    // optionally: update, delete…
}
