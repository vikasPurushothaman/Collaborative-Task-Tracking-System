package com.tasktracker.serviceImpl;

import com.tasktracker.entity.Comment;
import com.tasktracker.entity.Project;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.User;
import com.tasktracker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyTaskAssigned(Task task) {
        if (task.getAssignedUser() == null) return;

        log.info("Sending WS Notification: Task assigned to user {}", task.getAssignedUser().getEmail());
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "TASK_ASSIGNED");
        payload.put("taskId", task.getId());
        payload.put("title", task.getTitle());
        payload.put("message", "You have been assigned to task: " + task.getTitle());

        sendNotificationToUser(task.getAssignedUser().getEmail(), payload);
    }

    @Override
    public void notifyTaskUpdated(Task task) {
        log.info("Sending WS Notification: Task updated for task id {}", task.getId());
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "TASK_UPDATED");
        payload.put("taskId", task.getId());
        payload.put("title", task.getTitle());
        payload.put("status", task.getStatus());
        payload.put("priority", task.getPriority());
        payload.put("message", "Task updated: " + task.getTitle());

        if (task.getAssignedUser() != null) {
            sendNotificationToUser(task.getAssignedUser().getEmail(), payload);
        }
        sendNotificationToTopic("/topic/task-updates/" + task.getId(), payload);
    }

    @Override
    public void notifyCommentAdded(Comment comment) {
        log.info("Sending WS Notification: Comment added to task id {}", comment.getTask().getId());
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "COMMENT_ADDED");
        payload.put("taskId", comment.getTask().getId());
        payload.put("commentId", comment.getId());
        payload.put("author", comment.getUser().getFirstName() + " " + comment.getUser().getLastName());
        payload.put("message", "New comment on task: " + comment.getTask().getTitle());

        sendNotificationToTopic("/topic/task-comments/" + comment.getTask().getId(), payload);
    }

    @Override
    public void notifyDeadlineNear(Task task) {
        if (task.getAssignedUser() == null) return;

        log.info("Sending WS Notification: Deadline near for task id {}", task.getId());
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "DEADLINE_NEAR");
        payload.put("taskId", task.getId());
        payload.put("title", task.getTitle());
        payload.put("dueDate", task.getDueDate());
        payload.put("message", "Task due date is approaching: " + task.getTitle());

        sendNotificationToUser(task.getAssignedUser().getEmail(), payload);
    }

    @Override
    public void notifyProjectInvitation(Project project, User member) {
        log.info("Sending WS Notification: Project invitation to user {}", member.getEmail());
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "PROJECT_INVITATION");
        payload.put("projectId", project.getId());
        payload.put("projectName", project.getName());
        payload.put("message", "You have been added to project: " + project.getName());

        sendNotificationToUser(member.getEmail(), payload);
    }

    private void sendNotificationToUser(String userEmail, Map<String, Object> payload) {
        try {
            messagingTemplate.convertAndSendToUser(userEmail, "/queue/notifications", payload);
        } catch (Exception e) {
            log.error("Failed to send WebSocket user notification to {}: {}", userEmail, e.getMessage());
        }
    }

    private void sendNotificationToTopic(String topic, Map<String, Object> payload) {
        try {
            messagingTemplate.convertAndSend(topic, payload);
        } catch (Exception e) {
            log.error("Failed to send WebSocket topic notification to {}: {}", topic, e.getMessage());
        }
    }
}
