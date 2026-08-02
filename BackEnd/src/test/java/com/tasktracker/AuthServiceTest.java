package com.tasktracker;

import com.tasktracker.dto.JwtResponse;
import com.tasktracker.dto.LoginRequest;
import com.tasktracker.dto.RegisterRequest;
import com.tasktracker.entity.RefreshToken;
import com.tasktracker.entity.User;
import com.tasktracker.enums.Role;
import com.tasktracker.enums.UserStatus;
import com.tasktracker.jwt.JwtTokenProvider;
import com.tasktracker.mapper.UserMapper;
import com.tasktracker.repository.RefreshTokenRepository;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.serviceImpl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserMapper userMapper;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenDurationMs", 604800000L);

        registerRequest = RegisterRequest.builder()
                .firstName("Alice")
                .lastName("Smith")
                .email("alice@example.com")
                .password("secret")
                .role(Role.PROJECT_MANAGER)
                .build();

        loginRequest = LoginRequest.builder()
                .email("alice@example.com")
                .password("secret")
                .build();

        user = User.builder()
                .id(2L)
                .firstName("Alice")
                .lastName("Smith")
                .email("alice@example.com")
                .password("encoded_secret")
                .role(Role.PROJECT_MANAGER)
                .status(UserStatus.ACTIVE)
                .build();

        refreshToken = RefreshToken.builder()
                .id(100L)
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userMapper.toEntity(registerRequest)).thenReturn(user);
        when(passwordEncoder.encode("secret")).thenReturn("encoded_secret");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("jwt_access_token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        JwtResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("jwt_access_token", response.getAccessToken());
        assertEquals("alice@example.com", response.getEmail());
    }

    @Test
    void login_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("jwt_access_token");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        JwtResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt_access_token", response.getAccessToken());
        assertEquals(2L, response.getUserId());
    }
}
