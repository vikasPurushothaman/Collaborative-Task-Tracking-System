package com.tasktracker.mapper;

import com.tasktracker.dto.CreateProjectRequest;
import com.tasktracker.dto.ProjectDTO;
import com.tasktracker.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ProjectMapper {

    ProjectDTO toDto(Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "projectManager", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Project toEntity(CreateProjectRequest request);
}
