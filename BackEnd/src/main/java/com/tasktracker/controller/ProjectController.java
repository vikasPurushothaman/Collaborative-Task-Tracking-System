package com.tasktracker.controller;

import com.tasktracker.dto.*;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project Management APIs")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Create project")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectDTO project = projectService.createProject(request, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Project created successfully", project), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated project list")
    public ResponseEntity<ApiResponse<PagedResponse<ProjectDTO>>> getProjects(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<ProjectDTO> projects = projectService.getAllProjects(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved", project));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Update project details")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {
        ProjectDTO project = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project by ID")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }

    @PostMapping("/{id}/invite")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Invite member to project")
    public ResponseEntity<ApiResponse<ProjectDTO>> inviteMember(
            @PathVariable Long id,
            @Valid @RequestBody InviteMemberRequest request) {
        ProjectDTO project = projectService.inviteMember(id, request);
        return ResponseEntity.ok(ApiResponse.success("Member invited to project successfully", project));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Remove member from project")
    public ResponseEntity<ApiResponse<ProjectDTO>> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId) {
        ProjectDTO project = projectService.removeMember(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Member removed from project successfully", project));
    }

    @PatchMapping("/{id}/assign-manager")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign Project Manager to project")
    public ResponseEntity<ApiResponse<ProjectDTO>> assignProjectManager(
            @PathVariable Long id,
            @RequestParam("managerId") Long managerId) {
        ProjectDTO project = projectService.assignProjectManager(id, managerId);
        return ResponseEntity.ok(ApiResponse.success("Project Manager assigned successfully", project));
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "List project members")
    public ResponseEntity<ApiResponse<Set<UserDTO>>> getProjectMembers(@PathVariable Long id) {
        Set<UserDTO> members = projectService.getProjectMembers(id);
        return ResponseEntity.ok(ApiResponse.success("Project members retrieved", members));
    }
}
