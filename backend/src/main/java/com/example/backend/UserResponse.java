package com.example.backend;

public class UserResponse {
    private String id;
    private String name;
    private String email;

    public UserResponse(User user) {
        this.id    = user.getId();
        this.name  = user.getName();
        this.email = user.getEmail();
    }
    // getters only
    public String getId()    { return id; }
    public String getName()  { return name; }
    public String getEmail() { return email; }
}
