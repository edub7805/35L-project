package com.example.backend.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/jobs/{jobId}/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Review>> listByJob(@PathVariable String jobId) {
        return ResponseEntity.ok(service.getReviewsForJob(jobId));
    }

    @PostMapping
    public ResponseEntity<Review> create(@PathVariable String jobId,
                                         @RequestBody ReviewInput input) {
        Review r = service.createReview(
                jobId,
                input.getAuthorId(),
                input.getRating(),
                input.getText()
        );
        return ResponseEntity.ok(r);
    }

    // DTO for incoming data
    public static class ReviewInput {
        private String authorId;
        private int    rating;
        private String text;

        // Getters and Setters
        public String getAuthorId() { return authorId; }
        public void setAuthorId(String authorId) { this.authorId = authorId; }
        
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
}
