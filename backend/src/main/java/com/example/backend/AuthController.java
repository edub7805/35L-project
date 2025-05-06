package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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