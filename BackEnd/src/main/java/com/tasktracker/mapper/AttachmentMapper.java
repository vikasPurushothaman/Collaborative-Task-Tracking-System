package com.tasktracker.mapper;

import com.tasktracker.dto.AttachmentDTO;
import com.tasktracker.entity.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {

    @Mapping(source = "task.id", target = "taskId")
    AttachmentDTO toDto(Attachment attachment);
}
