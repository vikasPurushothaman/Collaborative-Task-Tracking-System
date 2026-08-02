package com.tasktracker.mapper;

import com.tasktracker.dto.CreateTaskRequest;
import com.tasktracker.dto.TaskDTO;
import com.tasktracker.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProjectMapper.class, CommentMapper.class, AttachmentMapper.class})
public interface TaskMapper {

    TaskDTO toDto(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "assignedUser", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "comments", ignore = true)
    Task toEntity(CreateTaskRequest request);
}
