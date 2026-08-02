package com.tasktracker.controller;

import com.tasktracker.dto.CommentDTO;
import com.tasktracker.dto.CreateCommentRequest;
import com.tasktracker.dto.UpdateCommentRequest;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Task Comment Management APIs")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "Add comment to a task")
    public ResponseEntity<ApiResponse<CommentDTO>> addComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentDTO comment = commentService.addComment(request, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Comment added successfully", comment), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit comment")
    public ResponseEntity<ApiResponse<CommentDTO>> updateComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateCommentRequest request) {
        CommentDTO comment = commentService.updateComment(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", comment));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete comment")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully"));
    }

    @GetMapping("/task/{taskId}")
    @Operation(summary = "List comments for a specific task")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getCommentsByTaskId(@PathVariable Long taskId) {
        List<CommentDTO> comments = commentService.getCommentsByTaskId(taskId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }
}
