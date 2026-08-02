package com.tasktracker;

import com.tasktracker.dto.CreateUserRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.entity.User;
import com.tasktracker.enums.Role;
import com.tasktracker.enums.UserStatus;
import com.tasktracker.exception.DuplicateEmailException;
import com.tasktracker.exception.UserNotFoundException;
import com.tasktracker.mapper.UserMapper;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.serviceImpl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;
    private UserDTO sampleUserDTO;
    private CreateUserRequest createRequest;

    @BeforeEach
    void setUp() {
        createRequest = CreateUserRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .role(Role.TEAM_MEMBER)
                .build();

        sampleUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encoded_password")
                .role(Role.TEAM_MEMBER)
                .status(UserStatus.ACTIVE)
                .build();

        sampleUserDTO = UserDTO.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .role(Role.TEAM_MEMBER)
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Test
    void createUser_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.toEntity(any(CreateUserRequest.class))).thenReturn(sampleUser);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(userMapper.toDto(any(User.class))).thenReturn(sampleUserDTO);

        UserDTO result = userService.createUser(createRequest);

        assertNotNull(result);
        assertEquals("john.doe@example.com", result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> userService.createUser(createRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userMapper.toDto(sampleUser)).thenReturn(sampleUserDTO);

        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    void disableUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(userMapper.toDto(any(User.class))).thenReturn(sampleUserDTO);

        UserDTO result = userService.disableUser(1L);

        assertNotNull(result);
        assertEquals(UserStatus.INACTIVE, sampleUser.getStatus());
        verify(userRepository, times(1)).save(sampleUser);
    }
}
