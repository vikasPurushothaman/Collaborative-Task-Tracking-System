package com.tasktracker.controller;

import com.tasktracker.dto.AiGenerateDescriptionRequest;
import com.tasktracker.dto.AiGenerateDescriptionResponse;
import com.tasktracker.dto.AiTaskSummaryRequest;
import com.tasktracker.dto.AiTaskSummaryResponse;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.service.OpenAiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Module", description = "OpenAI Assistance Endpoints")
public class AiController {

    private final OpenAiService openAiService;

    @PostMapping("/generate-description")
    @Operation(summary = "Generate AI task description from task title")
    public ResponseEntity<ApiResponse<AiGenerateDescriptionResponse>> generateDescription(
            @Valid @RequestBody AiGenerateDescriptionRequest request) {
        AiGenerateDescriptionResponse response = openAiService.generateDescription(request);
        return ResponseEntity.ok(ApiResponse.success("AI description generated successfully", response));
    }

    @PostMapping("/summarize-task")
    @Operation(summary = "Summarize task content using AI")
    public ResponseEntity<ApiResponse<AiTaskSummaryResponse>> summarizeTask(
            @RequestBody AiTaskSummaryRequest request) {
        AiTaskSummaryResponse response = openAiService.summarizeTask(request);
        return ResponseEntity.ok(ApiResponse.success("AI task summary generated successfully", response));
    }
}
