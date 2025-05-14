package com.example.backend.user;

/**
 * Data Transfer Object for user login requests.
 * Contains the email and password fields needed for authentication.
 */
public class UserLoginRequest {
    private String email;
    private String password;

    // Default constructor required for JSON deserialization
    public UserLoginRequest() {}

    public UserLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 