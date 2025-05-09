//Purpose: Acts as a Data Transfer Object (DTO) for incoming signup requests.
//
//Fields: Matches the expected JSON payload with name, email, and password.
//


package com.example.backend.user;

public class UserSignupRequest {
    private String name;
    private String email;
    private String password;

    // Constructors
    public UserSignupRequest() {}

    public UserSignupRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
