package com.example.backend.jobpost;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobPostRepository extends MongoRepository<JobPost, String> {
    List<JobPost> findByStatus(JobPostStatus status);
    List<JobPost> findByUserIdAndStatusIn(String userId, List<JobPostStatus> statuses);
    List<JobPost> findByAssignedUserIdAndStatusIn(String assignedUserId, List<JobPostStatus> statuses);
}
