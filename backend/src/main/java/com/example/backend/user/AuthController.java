//Purpose: Handles incoming HTTP requests for user signup.
//Receives a JSON request body mapped to a UserSignupRequest object.
//
//        Checks if a user with the same email already exists using userRepository.existsByEmail(...).
//
//        If not, it creates a new User object, saves it to MongoDB, and returns a success message

package com.example.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public UserResponse signup(@RequestBody UserSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        }

        User user = new User(
                
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    // new: fetch user by DB id
    @GetMapping("/users/{id}")
    public UserResponse getUser(@PathVariable String id) {
        User u = userRepository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
            );
        return new UserResponse(u);
    }

    
}