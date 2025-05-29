package com.example.backend.review;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.review.ReviewRepository;
import com.example.backend.jobpost.JobPost;
import com.example.backend.jobpost.JobPostRepository;
import com.example.backend.jobpost.JobPostStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;
    private final JobPostRepository jobRepo;

    public ReviewService(ReviewRepository reviewRepo,
                         UserRepository userRepo,
                         JobPostRepository jobRepo) {
        this.reviewRepo = reviewRepo;
        this.userRepo   = userRepo;
        this.jobRepo    = jobRepo;
    }

    public List<Review> getReviewsForJob(String jobId) {
        return reviewRepo.findByJobId(jobId);
    }

    public List<Review> getReviewsByAuthor(String authorId) {
        return reviewRepo.findByAuthorId(authorId);
    }

    @Transactional
    public Review createReview(String jobId, String authorId, int rating, String text) {
        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Get and validate job
        JobPost job = jobRepo.findById(jobId)
            .orElseThrow(() -> new NoSuchElementException("Job not found"));

        // Validate job status
        if (job.getStatus() != JobPostStatus.COMPLETED) {
            throw new IllegalStateException("Can only review completed jobs");
        }

        // Validate author is involved in the job
        if (!authorId.equals(job.getUserId()) && !authorId.equals(job.getAssignedUserId())) {
            throw new IllegalStateException("Only job participants can leave reviews");
        }

        // Check if author has already reviewed
        List<Review> existingReviews = reviewRepo.findByJobId(jobId);
        boolean hasReviewed = existingReviews.stream()
            .anyMatch(review -> review.getAuthorId().equals(authorId));
        if (hasReviewed) {
            throw new IllegalStateException("User has already reviewed this job");
        }

        // Create and save review
        Review r = new Review(jobId, authorId, rating, text);
        Review saved = reviewRepo.save(r);

        // Get recipient (the other participant)
        String recipientId = authorId.equals(job.getUserId()) 
            ? job.getAssignedUserId() 
            : job.getUserId();

        // Update User metrics
        User recipient = userRepo.findById(recipientId)
            .orElseThrow(() -> new NoSuchElementException("Recipient user not found"));
        
        recipient.setReviewCount(recipient.getReviewCount() + 1);
        recipient.setRatingSum(recipient.getRatingSum() + rating);
        recipient.setAverageRating(
            recipient.getReviewCount() > 0 
                ? (double) recipient.getRatingSum() / recipient.getReviewCount()
                : 0.0
        );
        userRepo.save(recipient);

        // Update Job metrics
        job.setReviewCount(job.getReviewCount() + 1);
        job.setRatingSum(job.getRatingSum() + rating);
        job.setAverageRating(
            job.getReviewCount() > 0 
                ? (double) job.getRatingSum() / job.getReviewCount()
                : 0.0
        );
        jobRepo.save(job);

        return saved;
    }
}