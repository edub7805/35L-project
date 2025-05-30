package com.example.backend.review;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByJobId(String jobId);
    List<Review> findByAuthorId(String authorId);
}