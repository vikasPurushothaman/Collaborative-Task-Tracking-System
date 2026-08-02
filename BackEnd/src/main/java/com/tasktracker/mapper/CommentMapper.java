package com.tasktracker.mapper;

import com.tasktracker.dto.CommentDTO;
import com.tasktracker.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CommentMapper {

    @Mapping(source = "task.id", target = "taskId")
    CommentDTO toDto(Comment comment);
}
