package com.example.backend.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Get all conversations for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Message>> getUserConversations(@PathVariable String userId) {
        List<Message> conversations = messageService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }

    // Get conversation for a specific job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<Message> getJobConversation(@PathVariable String jobId) {
        Message conversation = messageService.getJobConversation(jobId);
        return conversation != null ? ResponseEntity.ok(conversation) : ResponseEntity.notFound().build();
    }

    // Send a new message
    @PostMapping("/job/{jobId}")
    public ResponseEntity<Message> sendMessage(
            @PathVariable String jobId,
            @RequestBody Message.MessageContent newMessage) {
        Message savedConversation = messageService.sendMessage(jobId, newMessage);
        return ResponseEntity.ok(savedConversation);
    }
} 