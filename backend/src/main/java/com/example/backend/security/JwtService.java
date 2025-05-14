//package com.example.backend.security;
//
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.ExpiredJwtException;
//import io.jsonwebtoken.MalformedJwtException;
//import io.jsonwebtoken.UnsupportedJwtException;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.util.Date;
//
//@Service
//public class JwtService {
//
//    @Value("${jwt.secret}")
//    private String secretKey;
//
//    @Value("${jwt.expirationMs}")
//    private long expirationMs;
//
//    public String generateToken(String userId) {
//        Date now = new Date();
//        Date expiry = new Date(now.getTime() + expirationMs);
//
//        return Jwts.builder()
//                .setSubject(userId)
//                .setIssuedAt(now)
//                .setExpiration(expiry)
//                .signWith(SignatureAlgorithm.HS256, secretKey)
//                .compact();
//    }
//
//    public String extractUserId(String token) {
//        return getClaims(token).getSubject();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            getClaims(token);
//            return true;
//        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | IllegalArgumentException ex) {
//            return false;
//        }
//    }
//
//    private Claims getClaims(String token) {
//        return Jwts.parser()
//                .setSigningKey(secretKey)
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}