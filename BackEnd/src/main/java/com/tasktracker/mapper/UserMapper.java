package com.tasktracker.mapper;

import com.tasktracker.dto.CreateUserRequest;
import com.tasktracker.dto.RegisterRequest;
import com.tasktracker.dto.UpdateUserRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    UserDTO toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "assignedTasks", ignore = true)
    @Mapping(target = "createdTasks", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "teams", ignore = true)
    @Mapping(target = "projects", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "assignedTasks", ignore = true)
    @Mapping(target = "createdTasks", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "teams", ignore = true)
    @Mapping(target = "projects", ignore = true)
    User toEntity(CreateUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "assignedTasks", ignore = true)
    @Mapping(target = "createdTasks", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "teams", ignore = true)
    @Mapping(target = "projects", ignore = true)
    void updateUserFromDto(UpdateUserRequest dto, @MappingTarget User user);
}
