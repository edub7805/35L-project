package com.example.backend.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

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
}



// interface for user storage