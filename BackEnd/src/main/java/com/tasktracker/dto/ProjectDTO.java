package com.tasktracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private Long id;
    private String name;
    private String description;
    private UserDTO createdBy;
    private UserDTO projectManager;
    private Set<UserDTO> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
