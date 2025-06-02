package com.example.backend.message;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String jobId;
    private List<String> participants;
    private List<MessageContent> messages;

    // Nested class for message content
    public static class MessageContent {
        private String messageId;
        private String senderId;
        private String content;

        // Getters and setters
        public String getMessageId() { return messageId; }
        public void setMessageId(String messageId) { this.messageId = messageId; }
        public String getSenderId() { return senderId; }
        public void setSenderId(String senderId) { this.senderId = senderId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    // Getters and setters for main class
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public List<MessageContent> getMessages() { return messages; }
    public void setMessages(List<MessageContent> messages) { this.messages = messages; }
} 