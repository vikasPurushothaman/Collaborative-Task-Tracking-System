package com.tasktracker.serviceImpl;

import com.tasktracker.dto.AttachmentDTO;
import com.tasktracker.entity.Attachment;
import com.tasktracker.entity.Task;
import com.tasktracker.exception.FileStorageException;
import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.exception.TaskNotFoundException;
import com.tasktracker.mapper.AttachmentMapper;
import com.tasktracker.repository.AttachmentRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final AttachmentMapper attachmentMapper;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "docx", "png", "jpeg", "jpg", "zip");

    public FileStorageServiceImpl(@Value("${file.upload-dir:uploads/}") String uploadDir,
                                  AttachmentRepository attachmentRepository,
                                  TaskRepository taskRepository,
                                  AttachmentMapper attachmentMapper) {
        this.attachmentRepository = attachmentRepository;
        this.taskRepository = taskRepository;
        this.attachmentMapper = attachmentMapper;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    @Transactional
    public AttachmentDTO storeFile(MultipartFile file, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        log.info("Storing file {} for task id {}", originalFileName, taskId);

        String extension = getFileExtension(originalFileName);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new FileStorageException("Invalid file extension ." + extension + ". Allowed: PDF, DOCX, PNG, JPEG, ZIP");
        }

        String storedFileName = System.currentTimeMillis() + "_" + originalFileName;

        try {
            if (storedFileName.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + storedFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Attachment attachment = Attachment.builder()
                    .fileName(originalFileName)
                    .filePath(targetLocation.toString())
                    .fileType(file.getContentType() != null ? file.getContentType() : extension)
                    .fileSize(file.getSize())
                    .uploadedDate(LocalDateTime.now())
                    .task(task)
                    .build();

            Attachment savedAttachment = attachmentRepository.save(attachment);
            return attachmentMapper.toDto(savedAttachment);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadFileAsResource(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Attachment file not found at " + attachment.getFilePath());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Attachment file not found at " + attachment.getFilePath());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AttachmentDTO getAttachmentById(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));
        return attachmentMapper.toDto(attachment);
    }

    @Override
    @Transactional
    public void deleteAttachment(Long attachmentId) {
        log.info("Deleting attachment id {}", attachmentId);
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.error("Could not delete file on disk: {}", attachment.getFilePath(), ex);
        }

        attachmentRepository.delete(attachment);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
