package com.tasktracker.serviceImpl;

import com.tasktracker.dto.CommentDTO;
import com.tasktracker.dto.CreateCommentRequest;
import com.tasktracker.dto.UpdateCommentRequest;
import com.tasktracker.entity.Comment;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.User;
import com.tasktracker.enums.Role;
import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.exception.TaskNotFoundException;
import com.tasktracker.exception.UnauthorizedException;
import com.tasktracker.exception.UserNotFoundException;
import com.tasktracker.mapper.CommentMapper;
import com.tasktracker.repository.CommentRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.service.CommentService;
import com.tasktracker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public CommentDTO addComment(CreateCommentRequest request, String userEmail) {
        log.info("Adding comment to task id {} by user {}", request.getTaskId(), userEmail);
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new TaskNotFoundException(request.getTaskId()));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("email", userEmail));

        Comment comment = Comment.builder()
                .message(request.getMessage())
                .task(task)
                .user(user)
                .build();

        Comment savedComment = commentRepository.save(comment);
        notificationService.notifyCommentAdded(savedComment);

        return commentMapper.toDto(savedComment);
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long commentId, UpdateCommentRequest request, String userEmail) {
        log.info("Updating comment id {} by user {}", commentId, userEmail);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("email", userEmail));

        if (!comment.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setMessage(request.getMessage());
        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toDto(updatedComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String userEmail) {
        log.info("Deleting comment id {} by user {}", commentId, userEmail);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("email", userEmail));

        if (!comment.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new TaskNotFoundException(taskId);
        }

        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
        return comments.stream().map(commentMapper::toDto).toList();
    }
}
