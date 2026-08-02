package com.tasktracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

    private Long id;
    private String message;
    private UserDTO user;
    private Long taskId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
