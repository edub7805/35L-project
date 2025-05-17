package com.example.backend.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Spring Data repository for {@link User} entities.
 * <p>
 * Provides CRUD operations out of the box and a custom method
 * to check for email uniqueness.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Determine whether a user with the given email address exists.
     *
     * @param email the email to check for
     * @return {@code true} if a matching user exists, {@code false} otherwise
     */
    boolean existsByEmail(String email);
    
    /**
     * Find a user by their email address.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found, or empty if not found
     */
    Optional<User> findByEmail(String email);
}



// interface for user storage