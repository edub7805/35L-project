//Purpose: Handles incoming HTTP requests for user signup.
//Receives a JSON request body mapped to a UserSignupRequest object.
//
//        Checks if a user with the same email already exists using userRepository.existsByEmail(...).
//
//        If not, it creates a new User object, saves it to MongoDB, and returns a success message

package com.example.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.review.Review;
import com.example.backend.review.ReviewService;

import java.util.List;
import java.util.Objects;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class AuthController {
    
    private final UserRepository userRepository;
    private final ReviewService reviewService;
    
    @Autowired
    public AuthController(UserRepository userRepository,
                          ReviewService reviewService) { 
        this.userRepository = userRepository;
        this.reviewService  = reviewService;
    }

    @PostMapping("/signup")
    public UserResponse signup(@RequestBody UserSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        }

        User user = new User(
                request.getId(),
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody UserLoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        
        // Verify password (simple comparison for now, consider using proper encryption in production)
        if (!Objects.equals(user.getPassword(), request.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        
        // Return user details (without password)
        return new UserResponse(user);
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


    //Get user rating
    @GetMapping("/users/{id}/rating")
    public ResponseEntity<UserRatingResponse> getUserRating(@PathVariable String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
                )
            );

        UserRatingResponse resp = new UserRatingResponse(
            user.getReviewCount(),
            user.getRatingSum(),
            user.getAverageRating()
        );
        return ResponseEntity.ok(resp);
    }
    // get reviews from each user
    @GetMapping("/users/{id}/reviews")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable String id) {
        // Ensure user exists
        userRepository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
                )
            );

        List<Review> reviews = reviewService.getReviewsByAuthor(id);
        return ResponseEntity.ok(reviews);
    }


    // DTO for rating fields
    public static class UserRatingResponse {
        private final int    reviewCount;
        private final int    ratingSum;
        private final double averageRating;

        public UserRatingResponse(int reviewCount, int ratingSum, double averageRating) {
            this.reviewCount   = reviewCount;
            this.ratingSum     = ratingSum;
            this.averageRating = averageRating;
        }

        public int getReviewCount()    { return reviewCount; }
        public int getRatingSum()      { return ratingSum; }
        public double getAverageRating() { return averageRating; }
    }
}

