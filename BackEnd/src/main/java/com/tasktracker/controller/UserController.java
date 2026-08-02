package com.tasktracker.controller;

import com.tasktracker.dto.CreateUserRequest;
import com.tasktracker.dto.UpdateUserRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.UserService;
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

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User Management APIs")
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create user (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        return new ResponseEntity<>(ApiResponse.success("User created successfully", user), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Get paginated user list or search users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDTO>>> getUsers(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<UserDTO> users;
        if (query != null && !query.isBlank()) {
            users = userService.searchUsers(query, page, size, sortBy, sortDir);
        } else {
            users = userService.getAllUsers(page, size, sortBy, sortDir);
        }
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/me")
    @Operation(summary = "View current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDTO>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDTO user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", user));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDTO currentUser = userService.getUserByEmail(userDetails.getUsername());
        UserDTO updatedUser = userService.updateUser(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user details by ID")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user by ID (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDTO updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user by ID (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @PatchMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Disable user account (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO>> disableUser(@PathVariable Long id) {
        UserDTO user = userService.disableUser(id);
        return ResponseEntity.ok(ApiResponse.success("User disabled successfully", user));
    }

    @PatchMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enable user account (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO>> enableUser(@PathVariable Long id) {
        UserDTO user = userService.enableUser(id);
        return ResponseEntity.ok(ApiResponse.success("User enabled successfully", user));
    }
}
