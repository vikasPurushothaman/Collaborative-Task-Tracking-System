package com.tasktracker;

import com.tasktracker.dto.CreateTaskRequest;
import com.tasktracker.dto.TaskDTO;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.User;
import com.tasktracker.enums.Role;
import com.tasktracker.enums.TaskPriority;
import com.tasktracker.enums.TaskStatus;
import com.tasktracker.exception.TaskNotFoundException;
import com.tasktracker.mapper.TaskMapper;
import com.tasktracker.repository.ProjectRepository;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.service.NotificationService;
import com.tasktracker.serviceImpl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskMapper taskMapper;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User sampleUser;
    private Task sampleTask;
    private TaskDTO sampleTaskDTO;
    private CreateTaskRequest createRequest;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("creator@example.com")
                .role(Role.ADMIN)
                .build();

        createRequest = CreateTaskRequest.builder()
                .title("Implement Authentication")
                .description("Build JWT Auth flow")
                .priority(TaskPriority.HIGH)
                .build();

        sampleTask = Task.builder()
                .id(10L)
                .title("Implement Authentication")
                .description("Build JWT Auth flow")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.OPEN)
                .createdBy(sampleUser)
                .isDeleted(false)
                .build();

        sampleTaskDTO = TaskDTO.builder()
                .id(10L)
                .title("Implement Authentication")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.OPEN)
                .build();
    }

    @Test
    void createTask_Success() {
        when(userRepository.findByEmail("creator@example.com")).thenReturn(Optional.of(sampleUser));
        when(taskMapper.toEntity(createRequest)).thenReturn(sampleTask);
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        when(taskMapper.toDto(sampleTask)).thenReturn(sampleTaskDTO);

        TaskDTO result = taskService.createTask(createRequest, "creator@example.com");

        assertNotNull(result);
        assertEquals("Implement Authentication", result.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void updateTaskStatus_Success() {
        when(taskRepository.findById(10L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        when(taskMapper.toDto(sampleTask)).thenReturn(sampleTaskDTO);

        TaskDTO result = taskService.updateTaskStatus(10L, TaskStatus.IN_PROGRESS);

        assertNotNull(result);
        assertEquals(TaskStatus.IN_PROGRESS, sampleTask.getStatus());
        verify(notificationService, times(1)).notifyTaskUpdated(sampleTask);
    }

    @Test
    void softDeleteTask_Success() {
        when(taskRepository.findById(10L)).thenReturn(Optional.of(sampleTask));

        taskService.softDeleteTask(10L);

        assertTrue(sampleTask.isDeleted());
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    void getTaskById_NotFound_ThrowsException() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getTaskById(99L));
    }
}
