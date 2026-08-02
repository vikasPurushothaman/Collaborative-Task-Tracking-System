package com.tasktracker.controller;

import com.tasktracker.dto.*;
import com.tasktracker.enums.TaskPriority;
import com.tasktracker.enums.TaskStatus;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task Management APIs")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create task")
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskDTO task = taskService.createTask(request, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", task), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated tasks list")
    public ResponseEntity<ApiResponse<PagedResponse<TaskDTO>>> getAllTasks(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<TaskDTO> tasks = taskService.getAllTasks(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskDTO>> getTaskById(@PathVariable Long id) {
        TaskDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task details retrieved", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task details")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request) {
        TaskDTO task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete task")
    public ResponseEntity<ApiResponse<Void>> softDeleteTask(@PathVariable Long id) {
        taskService.softDeleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task soft deleted successfully"));
    }

    @PostMapping("/{id}/restore")
    @Operation(summary = "Restore soft-deleted task")
    public ResponseEntity<ApiResponse<TaskDTO>> restoreTask(@PathVariable Long id) {
        TaskDTO task = taskService.restoreTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task restored successfully", task));
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign task to a user")
    public ResponseEntity<ApiResponse<TaskDTO>> assignTask(
            @PathVariable Long id,
            @Valid @RequestBody AssignTaskRequest request) {
        TaskDTO task = taskService.assignTask(id, request.getAssignedUserId());
        return ResponseEntity.ok(ApiResponse.success("Task assigned successfully", task));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        TaskDTO task = taskService.updateTaskStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", task));
    }

    @PatchMapping("/{id}/priority")
    @Operation(summary = "Update task priority")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTaskPriority(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskPriorityRequest request) {
        TaskDTO task = taskService.updateTaskPriority(id, request.getPriority());
        return ResponseEntity.ok(ApiResponse.success("Task priority updated successfully", task));
    }

    @GetMapping("/search")
    @Operation(summary = "Search tasks by title or description keyword")
    public ResponseEntity<ApiResponse<PagedResponse<TaskDTO>>> searchTasks(
            @RequestParam("query") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PagedResponse<TaskDTO> tasks = taskService.searchTasks(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Tasks search results", tasks));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter tasks with multi-criteria (Status, Priority, AssignedUser, Project, Date Range)")
    public ResponseEntity<ApiResponse<PagedResponse<TaskDTO>>> filterTasks(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) TaskStatus status,
            @RequestParam(value = "priority", required = false) TaskPriority priority,
            @RequestParam(value = "assignedUserId", required = false) Long assignedUserId,
            @RequestParam(value = "projectId", required = false) Long projectId,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(value = "includeDeleted", required = false, defaultValue = "false") Boolean includeDeleted,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<TaskDTO> tasks = taskService.filterTasks(
                search, status, priority, assignedUserId, projectId, startDate, endDate, includeDeleted, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Filtered tasks retrieved", tasks));
    }

    @GetMapping("/assigned/{userId}")
    @Operation(summary = "Get tasks assigned to specific user")
    public ResponseEntity<ApiResponse<PagedResponse<TaskDTO>>> getAssignedTasks(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PagedResponse<TaskDTO> tasks = taskService.getAssignedTasks(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Assigned tasks retrieved", tasks));
    }
}
