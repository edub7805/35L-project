//Purpose: Extends MongoRepository to provide CRUD operations on the User collection.
//
//        Custom Method:
//
//        boolean existsByEmail(String email): Spring Data automatically implements this to check if a user with a given email exists.
//


        package com.example.backend;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByEmail(String email);
}



// interface for user storage