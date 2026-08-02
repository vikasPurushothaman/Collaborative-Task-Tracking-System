package com.tasktracker.controller;

import com.tasktracker.dto.AttachmentDTO;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
@Tag(name = "Attachments", description = "File Upload and Download APIs")
public class AttachmentController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload attachment file for a task (PDF, DOCX, PNG, JPEG, ZIP)")
    public ResponseEntity<ApiResponse<AttachmentDTO>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("taskId") Long taskId) {
        AttachmentDTO attachment = fileStorageService.storeFile(file, taskId);
        return new ResponseEntity<>(ApiResponse.success("File uploaded successfully", attachment), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attachment metadata by ID")
    public ResponseEntity<ApiResponse<AttachmentDTO>> getAttachment(@PathVariable Long id) {
        AttachmentDTO attachment = fileStorageService.getAttachmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Attachment metadata retrieved", attachment));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download attachment file binary stream")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        AttachmentDTO attachment = fileStorageService.getAttachmentById(id);
        Resource resource = fileStorageService.loadFileAsResource(id);

        String contentType = attachment.getFileType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete attachment file by ID")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(@PathVariable Long id) {
        fileStorageService.deleteAttachment(id);
        return ResponseEntity.ok(ApiResponse.success("Attachment deleted successfully"));
    }
}
