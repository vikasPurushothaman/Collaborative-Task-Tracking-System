package com.tasktracker.mapper;

import com.tasktracker.dto.CreateProjectRequest;
import com.tasktracker.dto.ProjectDTO;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.entity.Project;
import com.tasktracker.entity.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-02T15:50:20+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.19 (Ubuntu)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public ProjectDTO toDto(Project project) {
        if ( project == null ) {
            return null;
        }

        ProjectDTO.ProjectDTOBuilder projectDTO = ProjectDTO.builder();

        projectDTO.id( project.getId() );
        projectDTO.name( project.getName() );
        projectDTO.description( project.getDescription() );
        projectDTO.createdBy( userMapper.toDto( project.getCreatedBy() ) );
        projectDTO.projectManager( userMapper.toDto( project.getProjectManager() ) );
        projectDTO.members( userSetToUserDTOSet( project.getMembers() ) );
        projectDTO.createdAt( project.getCreatedAt() );
        projectDTO.updatedAt( project.getUpdatedAt() );

        return projectDTO.build();
    }

    @Override
    public Project toEntity(CreateProjectRequest request) {
        if ( request == null ) {
            return null;
        }

        Project.ProjectBuilder project = Project.builder();

        project.name( request.getName() );
        project.description( request.getDescription() );

        return project.build();
    }

    protected Set<UserDTO> userSetToUserDTOSet(Set<User> set) {
        if ( set == null ) {
            return null;
        }

        Set<UserDTO> set1 = new LinkedHashSet<UserDTO>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( User user : set ) {
            set1.add( userMapper.toDto( user ) );
        }

        return set1;
    }
}
