//Purpose: The main entry point for the Spring Boot application.
//
//		Behavior: Runs the application with SpringApplication.run(...).

package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.*;            // <— import these
import org.springframework.boot.autoconfigure.data.mongo.*;

@SpringBootApplication(
		exclude = {
				MongoAutoConfiguration.class,
				MongoDataAutoConfiguration.class
		}
)
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}