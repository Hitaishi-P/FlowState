package com.hitu.flowstate_backend.repository;

import com.yourpackage.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring reads this method NAME and writes the SQL for you.
    // "findByEmail" -> SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}