package com.example.backend;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import com.example.backend.user.UserRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

    @Autowired
    private UserRepository userRepository;

    @Test
    void signup_SavesToMongoCluster() {
        // clear out before we run
        userRepository.deleteAll();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"name\":\"Zed\",\"email\":\"zed@example.com\",\"password\":\"pw\"}";

        // fires a real HTTP POST at /api/signup (AuthController) :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
        ResponseEntity<String> resp = rest.postForEntity("/api/signup",
                new HttpEntity<>(body, headers),
                String.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).contains("User Zed signed up");

        // verify via repository that the user is in your usersdb.users collection
        assertThat(userRepository.existsByEmail("zed@example.com")).isTrue();
    }
}
