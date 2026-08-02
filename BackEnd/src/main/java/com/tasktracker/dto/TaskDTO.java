package com.tasktracker.dto;

import com.tasktracker.enums.TaskPriority;
import com.tasktracker.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private Long id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private boolean isDeleted;
    private UserDTO assignedUser;
    private UserDTO createdBy;
    private ProjectDTO project;
    private List<AttachmentDTO> attachments;
    private List<CommentDTO> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
