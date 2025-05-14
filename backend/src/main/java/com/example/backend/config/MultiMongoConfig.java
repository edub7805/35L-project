package com.example.backend.config;

import com.mongodb.ConnectionString;                  // driver ConnectionString
import com.mongodb.client.MongoClient;                 // driver MongoClient
import com.mongodb.client.MongoClients;                // factory for MongoClient
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
public class MultiMongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    // ─── USER-DB ─────────────────────────────────────────────────────────────

    @Bean
    @Primary
    public MongoDatabaseFactory userDbFactory() {
        // Create a MongoClient from the URI
        ConnectionString connString = new ConnectionString(mongoUri);
        MongoClient client          = MongoClients.create(connString);
        // Point that client at the "users-db" database
        return new SimpleMongoClientDatabaseFactory(client, "users-db");
    }

    @Bean
    @Primary
    public MongoTemplate userMongoTemplate() {
        return new MongoTemplate(userDbFactory());
    }

    @Configuration
    @EnableMongoRepositories(
            basePackages     = "com.example.backend.user",
            mongoTemplateRef = "userMongoTemplate"
    )
    static class UserDbReposConfig {}

    // ─── POSTS-DB ───────────────────────────────────────────────────────────

    @Bean
    public MongoDatabaseFactory postDbFactory() {
        ConnectionString connString = new ConnectionString(mongoUri);
        MongoClient client          = MongoClients.create(connString);
        return new SimpleMongoClientDatabaseFactory(client, "posts-db");
    }

    @Bean
    public MongoTemplate postMongoTemplate() {
        return new MongoTemplate(postDbFactory());
    }

    @Configuration
    @EnableMongoRepositories(
            basePackages     = "com.example.backend.post",
            mongoTemplateRef = "postMongoTemplate"
    )
    static class PostDbReposConfig {}

    // ─── MESSAGES-DB ────────────────────────────────────────────────────────

    @Bean
    public MongoDatabaseFactory messageDbFactory() {
        ConnectionString connString = new ConnectionString(mongoUri);
        MongoClient client          = MongoClients.create(connString);
        return new SimpleMongoClientDatabaseFactory(client, "messages-db");
    }

    @Bean
    public MongoTemplate messageMongoTemplate() {
        return new MongoTemplate(messageDbFactory());
    }

    @Configuration
    @EnableMongoRepositories(
            basePackages     = "com.example.backend.message",
            mongoTemplateRef = "messageMongoTemplate"
    )
    static class MessageDbReposConfig {}
}
