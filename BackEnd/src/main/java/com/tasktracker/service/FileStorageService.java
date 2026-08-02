package com.tasktracker.service;

import com.tasktracker.dto.AttachmentDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    AttachmentDTO storeFile(MultipartFile file, Long taskId);

    Resource loadFileAsResource(Long attachmentId);

    AttachmentDTO getAttachmentById(Long attachmentId);

    void deleteAttachment(Long attachmentId);
}
