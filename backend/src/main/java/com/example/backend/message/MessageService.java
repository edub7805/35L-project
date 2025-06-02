package com.example.backend.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getUserConversations(String userId) {
        return messageRepository.findByParticipantId(userId);
    }

    public Message getJobConversation(String jobId) {
        return messageRepository.findByJobId(jobId).stream()
            .findFirst()
            .orElse(null);
    }

    public Message sendMessage(String jobId, Message.MessageContent newMessage) {
        // Find existing conversation or create new one
        Message conversation = messageRepository.findByJobId(jobId).stream()
            .findFirst()
            .orElseGet(() -> {
                Message newConversation = new Message();
                newConversation.setJobId(jobId);
                newConversation.setMessages(new ArrayList<>());  // Initialize messages list
                return newConversation;
            });

        // Set message ID
        newMessage.setMessageId(UUID.randomUUID().toString());

        // Add message to conversation
        List<Message.MessageContent> messages = conversation.getMessages();
        messages.add(newMessage);
        conversation.setMessages(messages);

        return messageRepository.save(conversation);
    }
} 