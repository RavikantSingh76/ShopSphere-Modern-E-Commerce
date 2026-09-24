package com.ecommerce.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe, in-memory rate limiter designed for brute-force login attack mitigation.
 * Implements bounded sliding-window tracking with automated eviction to prevent unbounded memory growth.
 */
@Service
public class LoginRateLimiterService {

    private static final Logger log = LoggerFactory.getLogger(LoginRateLimiterService.class);

    @Value("${app.security.rate-limit.login.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.security.rate-limit.login.window-minutes:5}")
    private int windowMinutes;

    @Value("${app.security.rate-limit.login.lockout-minutes:15}")
    private int lockoutMinutes;

    private static final int MAX_TRACKED_ENTRIES = 10000;

    private final ConcurrentHashMap<String, AttemptTracker> attemptsMap = new ConcurrentHashMap<>();

    private static class AttemptTracker {
        int failedAttempts;
        long windowStart;
        long lockedUntil;

        AttemptTracker(long now) {
            this.failedAttempts = 1;
            this.windowStart = now;
            this.lockedUntil = 0;
        }
    }

    /**
     * Checks if the given identifier (IP or username) is temporarily locked out.
     */
    public boolean isBlocked(String key) {
        if (key == null || key.isBlank()) return false;
        String normalizedKey = key.trim().toLowerCase();
        AttemptTracker tracker = attemptsMap.get(normalizedKey);
        if (tracker == null) return false;

        long now = System.currentTimeMillis();
        if (tracker.lockedUntil > now) {
            return true;
        }

        // If lockout expired, reset tracker
        if (tracker.lockedUntil > 0 && tracker.lockedUntil <= now) {
            attemptsMap.remove(normalizedKey);
            return false;
        }

        // If window expired, reset tracker
        long windowDurationMs = windowMinutes * 60L * 1000L;
        if (now - tracker.windowStart > windowDurationMs) {
            attemptsMap.remove(normalizedKey);
            return false;
        }

        return false;
    }

    /**
     * Records a failed login attempt. Locks out when max attempts exceeded.
     */
    public void recordFailure(String key) {
        if (key == null || key.isBlank()) return;
        String normalizedKey = key.trim().toLowerCase();
        long now = System.currentTimeMillis();
        long windowDurationMs = windowMinutes * 60L * 1000L;
        long lockoutDurationMs = lockoutMinutes * 60L * 1000L;

        // Prevent memory exhaustion: if map exceeds max entries, clear half
        if (attemptsMap.size() > MAX_TRACKED_ENTRIES) {
            evictExpiredEntries();
        }

        attemptsMap.compute(normalizedKey, (k, tracker) -> {
            if (tracker == null || (now - tracker.windowStart > windowDurationMs)) {
                return new AttemptTracker(now);
            }
            tracker.failedAttempts++;
            if (tracker.failedAttempts >= maxAttempts) {
                tracker.lockedUntil = now + lockoutDurationMs;
                log.warn("Rate limiter triggered: Key '{}' locked out for {} minutes after {} failed attempts.",
                        normalizedKey, lockoutMinutes, tracker.failedAttempts);
            }
            return tracker;
        });
    }

    /**
     * Records a successful login. Clears any accumulated failed attempts for this key.
     */
    public void recordSuccess(String key) {
        if (key == null || key.isBlank()) return;
        attemptsMap.remove(key.trim().toLowerCase());
    }

    /**
     * Returns remaining lockout seconds if blocked, or 0 if not blocked.
     */
    public int getRemainingLockoutSeconds(String key) {
        if (key == null || key.isBlank()) return 0;
        AttemptTracker tracker = attemptsMap.get(key.trim().toLowerCase());
        if (tracker == null || tracker.lockedUntil <= 0) return 0;
        long remainingMs = tracker.lockedUntil - System.currentTimeMillis();
        return remainingMs > 0 ? (int) (remainingMs / 1000L) : 0;
    }

    /**
     * Periodic cleanup of expired trackers every 5 minutes to guarantee bounded memory.
     */
    @Scheduled(fixedRate = 300000)
    public void evictExpiredEntries() {
        long now = System.currentTimeMillis();
        long windowDurationMs = windowMinutes * 60L * 1000L;
        attemptsMap.entrySet().removeIf(entry -> {
            AttemptTracker tracker = entry.getValue();
            return (tracker.lockedUntil > 0 && tracker.lockedUntil <= now)
                    || (tracker.lockedUntil == 0 && (now - tracker.windowStart > windowDurationMs));
        });
    }
}
