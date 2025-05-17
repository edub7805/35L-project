package com.example.backend.jobpost;

/**
 * Thrown when a JobPost with a given ID does not exist.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}