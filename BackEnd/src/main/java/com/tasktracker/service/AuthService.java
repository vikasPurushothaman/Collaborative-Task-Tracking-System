package com.tasktracker.service;

import com.tasktracker.dto.*;

public interface AuthService {

    JwtResponse register(RegisterRequest request);

    JwtResponse login(LoginRequest request);

    void logout(String refreshToken);

    JwtResponse refreshToken(RefreshTokenRequest request);

    String forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void changePassword(String email, ChangePasswordRequest request);
}
