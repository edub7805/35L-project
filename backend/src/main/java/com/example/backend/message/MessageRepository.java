package com.example.backend.message;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    
    // Find all conversations for a specific job
    List<Message> findByJobId(String jobId);
    
    // Find all conversations where a user is a participant
    @Query("{ 'participants': ?0 }")
    List<Message> findByParticipantId(String userId);
    
    // Find a specific conversation between two users for a job
    @Query("{ 'jobId': ?0, 'participants': { $all: [?1, ?2] } }")
    Message findByJobIdAndParticipants(String jobId, String user1Id, String user2Id);
} 