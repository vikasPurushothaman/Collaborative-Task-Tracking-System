package com.tasktracker.service;

import com.tasktracker.dto.CommentDTO;
import com.tasktracker.dto.CreateCommentRequest;
import com.tasktracker.dto.UpdateCommentRequest;

import java.util.List;

public interface CommentService {

    CommentDTO addComment(CreateCommentRequest request, String userEmail);

    CommentDTO updateComment(Long commentId, UpdateCommentRequest request, String userEmail);

    void deleteComment(Long commentId, String userEmail);

    List<CommentDTO> getCommentsByTaskId(Long taskId);
}
