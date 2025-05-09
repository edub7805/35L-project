//Purpose: Handles incoming HTTP requests for user signup.
//Receives a JSON request body mapped to a UserSignupRequest object.
//
//        Checks if a user with the same email already exists using userRepository.existsByEmail(...).
//
//        If not, it creates a new User object, saves it to MongoDB, and returns a success message

package com.example.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public String signup(@RequestBody UserSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered.";
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );

        userRepository.save(user);
        return "User " + request.getName() + " signed up and saved to MongoDB!";
    }
}