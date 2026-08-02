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
public class TeamDTO {

    private Long id;
    private String teamName;
    private String description;
    private UserDTO owner;
    private Set<UserDTO> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
