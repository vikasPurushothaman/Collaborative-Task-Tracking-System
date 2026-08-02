package com.tasktracker.service;

import com.tasktracker.dto.CreateUserRequest;
import com.tasktracker.dto.UpdateUserRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.response.PagedResponse;

public interface UserService {

    UserDTO createUser(CreateUserRequest request);

    UserDTO updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);

    UserDTO disableUser(Long id);

    UserDTO enableUser(Long id);

    UserDTO getUserById(Long id);

    UserDTO getUserByEmail(String email);

    PagedResponse<UserDTO> getAllUsers(int page, int size, String sortBy, String sortDir);

    PagedResponse<UserDTO> searchUsers(String query, int page, int size, String sortBy, String sortDir);
}
