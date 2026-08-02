package com.tasktracker.dto;

import com.tasktracker.enums.TaskPriority;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskPriorityRequest {

    @NotNull(message = "Task priority is required")
    private TaskPriority priority;
}
