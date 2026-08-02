package com.tasktracker.scheduler;

import com.tasktracker.entity.Task;
import com.tasktracker.repository.RefreshTokenRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskSchedulerService {

    private final TaskRepository taskRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final NotificationService notificationService;

    /**
     * Check tasks approaching due date within 24 hours every hour
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional(readOnly = true)
    public void checkUpcomingTaskDeadlines() {
        log.info("Running scheduled check for upcoming task deadlines...");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24Hours = now.plusHours(24);

        List<Task> upcomingTasks = taskRepository.findByDueDateBetweenAndIsDeletedFalse(now, next24Hours);
        log.info("Found {} tasks approaching deadline in the next 24 hours.", upcomingTasks.size());

        for (Task task : upcomingTasks) {
            notificationService.notifyDeadlineNear(task);
        }
    }

    /**
     * Clean up expired refresh tokens once daily at midnight
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Running scheduled cleanup for expired refresh tokens...");
        refreshTokenRepository.findAll().stream()
                .filter(token -> token.getExpiryDate().isBefore(Instant.now()))
                .forEach(refreshTokenRepository::delete);
    }
}
