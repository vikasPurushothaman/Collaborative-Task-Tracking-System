package com.tasktracker.serviceImpl;

import com.tasktracker.dto.*;
import com.tasktracker.entity.Project;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.User;
import com.tasktracker.enums.TaskPriority;
import com.tasktracker.enums.TaskStatus;
import com.tasktracker.exception.ProjectNotFoundException;
import com.tasktracker.exception.TaskNotFoundException;
import com.tasktracker.exception.UserNotFoundException;
import com.tasktracker.mapper.TaskMapper;
import com.tasktracker.repository.ProjectRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.TaskSpecification;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.NotificationService;
import com.tasktracker.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public TaskDTO createTask(CreateTaskRequest request, String creatorEmail) {
        log.info("Creating task '{}' by user {}", request.getTitle(), creatorEmail);
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new UserNotFoundException("email", creatorEmail));

        Task task = taskMapper.toEntity(request);
        task.setCreatedBy(creator);
        task.setStatus(TaskStatus.OPEN);
        task.setDeleted(false);

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new UserNotFoundException(request.getAssignedUserId()));
            task.setAssignedUser(assignedUser);
        }

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ProjectNotFoundException(request.getProjectId()));
            task.setProject(project);
        }

        Task savedTask = taskRepository.save(task);

        if (savedTask.getAssignedUser() != null) {
            notificationService.notifyTaskAssigned(savedTask);
        }

        return taskMapper.toDto(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return taskMapper.toDto(task);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TaskDTO> getAllTasks(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Task> tasksPage = taskRepository.findByIsDeletedFalse(pageable);
        List<TaskDTO> content = tasksPage.getContent().stream().map(taskMapper::toDto).toList();

        return PagedResponse.<TaskDTO>builder()
                .content(content)
                .page(tasksPage.getNumber())
                .size(tasksPage.getSize())
                .totalElements(tasksPage.getTotalElements())
                .totalPages(tasksPage.getTotalPages())
                .last(tasksPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public TaskDTO updateTask(Long id, UpdateTaskRequest request) {
        log.info("Updating task id {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new UserNotFoundException(request.getAssignedUserId()));
            boolean reassigned = task.getAssignedUser() == null || !task.getAssignedUser().getId().equals(assignedUser.getId());
            task.setAssignedUser(assignedUser);
            if (reassigned) {
                notificationService.notifyTaskAssigned(task);
            }
        }
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ProjectNotFoundException(request.getProjectId()));
            task.setProject(project);
        }

        Task updatedTask = taskRepository.save(task);
        notificationService.notifyTaskUpdated(updatedTask);

        return taskMapper.toDto(updatedTask);
    }

    @Override
    @Transactional
    public void softDeleteTask(Long id) {
        log.info("Soft deleting task id {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setDeleted(true);
        taskRepository.save(task);
    }

    @Override
    @Transactional
    public TaskDTO restoreTask(Long id) {
        log.info("Restoring task id {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setDeleted(false);
        Task restoredTask = taskRepository.save(task);
        return taskMapper.toDto(restoredTask);
    }

    @Override
    @Transactional
    public TaskDTO assignTask(Long taskId, Long assignedUserId) {
        log.info("Assigning task id {} to user id {}", taskId, assignedUserId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        User user = userRepository.findById(assignedUserId)
                .orElseThrow(() -> new UserNotFoundException(assignedUserId));

        task.setAssignedUser(user);
        Task updatedTask = taskRepository.save(task);

        notificationService.notifyTaskAssigned(updatedTask);
        return taskMapper.toDto(updatedTask);
    }

    @Override
    @Transactional
    public TaskDTO updateTaskStatus(Long taskId, TaskStatus status) {
        log.info("Updating task id {} status to {}", taskId, status);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);

        notificationService.notifyTaskUpdated(updatedTask);
        return taskMapper.toDto(updatedTask);
    }

    @Override
    @Transactional
    public TaskDTO updateTaskPriority(Long taskId, TaskPriority priority) {
        log.info("Updating task id {} priority to {}", taskId, priority);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        task.setPriority(priority);
        Task updatedTask = taskRepository.save(task);

        notificationService.notifyTaskUpdated(updatedTask);
        return taskMapper.toDto(updatedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TaskDTO> searchTasks(String search, int page, int size) {
        return filterTasks(search, null, null, null, null, null, null, false, page, size, "createdAt", "DESC");
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TaskDTO> filterTasks(
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
    ) {
        Specification<Task> spec = TaskSpecification.filterTasks(
                search, status, priority, assignedUserId, projectId, startDate, endDate, includeDeleted
        );

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Task> tasksPage = taskRepository.findAll(spec, pageable);
        List<TaskDTO> content = tasksPage.getContent().stream().map(taskMapper::toDto).toList();

        return PagedResponse.<TaskDTO>builder()
                .content(content)
                .page(tasksPage.getNumber())
                .size(tasksPage.getSize())
                .totalElements(tasksPage.getTotalElements())
                .totalPages(tasksPage.getTotalPages())
                .last(tasksPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TaskDTO> getAssignedTasks(Long userId, int page, int size) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        Page<Task> tasksPage = taskRepository.findByAssignedUserIdAndIsDeletedFalse(userId, pageable);
        List<TaskDTO> content = tasksPage.getContent().stream().map(taskMapper::toDto).toList();

        return PagedResponse.<TaskDTO>builder()
                .content(content)
                .page(tasksPage.getNumber())
                .size(tasksPage.getSize())
                .totalElements(tasksPage.getTotalElements())
                .totalPages(tasksPage.getTotalPages())
                .last(tasksPage.isLast())
                .build();
    }
}
