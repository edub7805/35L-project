package com.example.backend.jobpost;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobPostRepository extends MongoRepository<JobPost,String> {
    List<JobPost> findByUserId(String userId);
}