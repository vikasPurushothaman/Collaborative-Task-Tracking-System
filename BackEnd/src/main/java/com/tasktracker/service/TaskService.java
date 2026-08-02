package com.tasktracker.service;

import com.tasktracker.dto.*;
import com.tasktracker.enums.TaskPriority;
import com.tasktracker.enums.TaskStatus;
import com.tasktracker.response.PagedResponse;

import java.time.LocalDateTime;

public interface TaskService {

    TaskDTO createTask(CreateTaskRequest request, String creatorEmail);

    TaskDTO getTaskById(Long id);

    PagedResponse<TaskDTO> getAllTasks(int page, int size, String sortBy, String sortDir);

    TaskDTO updateTask(Long id, UpdateTaskRequest request);

    void softDeleteTask(Long id);

    TaskDTO restoreTask(Long id);

    TaskDTO assignTask(Long taskId, Long assignedUserId);

    TaskDTO updateTaskStatus(Long taskId, TaskStatus status);

    TaskDTO updateTaskPriority(Long taskId, TaskPriority priority);

    PagedResponse<TaskDTO> searchTasks(String search, int page, int size);

    PagedResponse<TaskDTO> filterTasks(
            String search,
            TaskStatus status,
            TaskPriority priority,
            Long assignedUserId,
            Long projectId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean includeDeleted,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    PagedResponse<TaskDTO> getAssignedTasks(Long userId, int page, int size);
}
