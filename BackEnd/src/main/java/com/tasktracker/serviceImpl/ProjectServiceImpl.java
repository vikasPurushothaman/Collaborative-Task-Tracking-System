package com.tasktracker.serviceImpl;

import com.tasktracker.dto.CreateProjectRequest;
import com.tasktracker.dto.InviteMemberRequest;
import com.tasktracker.dto.ProjectDTO;
import com.tasktracker.dto.UpdateProjectRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.entity.Project;
import com.tasktracker.entity.User;
import com.tasktracker.exception.ProjectNotFoundException;
import com.tasktracker.exception.UserNotFoundException;
import com.tasktracker.mapper.ProjectMapper;
import com.tasktracker.mapper.UserMapper;
import com.tasktracker.repository.ProjectRepository;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.NotificationService;
import com.tasktracker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;
    private final UserMapper userMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ProjectDTO createProject(CreateProjectRequest request, String currentUserEmail) {
        log.info("Creating project '{}' by user {}", request.getName(), currentUserEmail);
        User creator = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UserNotFoundException("email", currentUserEmail));

        Project project = projectMapper.toEntity(request);
        project.setCreatedBy(creator);
        project.getMembers().add(creator);

        if (request.getProjectManagerId() != null) {
            User manager = userRepository.findById(request.getProjectManagerId())
                    .orElseThrow(() -> new UserNotFoundException(request.getProjectManagerId()));
            project.setProjectManager(manager);
            project.getMembers().add(manager);
        } else {
            project.setProjectManager(creator);
        }

        Project savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
        return projectMapper.toDto(project);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProjectDTO> getAllProjects(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Project> projectsPage = projectRepository.findAll(pageable);
        List<ProjectDTO> content = projectsPage.getContent().stream().map(projectMapper::toDto).toList();

        return PagedResponse.<ProjectDTO>builder()
                .content(content)
                .page(projectsPage.getNumber())
                .size(projectsPage.getSize())
                .totalElements(projectsPage.getTotalElements())
                .totalPages(projectsPage.getTotalPages())
                .last(projectsPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public ProjectDTO updateProject(Long id, UpdateProjectRequest request) {
        log.info("Updating project id {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        if (request.getName() != null && !request.getName().isBlank()) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getProjectManagerId() != null) {
            User manager = userRepository.findById(request.getProjectManagerId())
                    .orElseThrow(() -> new UserNotFoundException(request.getProjectManagerId()));
            project.setProjectManager(manager);
            project.getMembers().add(manager);
        }

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDto(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        log.info("Deleting project id {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
        projectRepository.delete(project);
    }

    @Override
    @Transactional
    public ProjectDTO inviteMember(Long projectId, InviteMemberRequest request) {
        log.info("Inviting member {} to project id {}", request.getEmail(), projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("email", request.getEmail()));

        project.getMembers().add(user);
        Project updatedProject = projectRepository.save(project);

        notificationService.notifyProjectInvitation(updatedProject, user);

        return projectMapper.toDto(updatedProject);
    }

    @Override
    @Transactional
    public ProjectDTO removeMember(Long projectId, Long userId) {
        log.info("Removing member id {} from project id {}", userId, projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        project.getMembers().remove(user);
        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDto(updatedProject);
    }

    @Override
    @Transactional
    public ProjectDTO assignProjectManager(Long projectId, Long managerId) {
        log.info("Assigning manager id {} to project id {}", managerId, projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new UserNotFoundException(managerId));

        project.setProjectManager(manager);
        project.getMembers().add(manager);

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDto(updatedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<UserDTO> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        return project.getMembers().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toSet());
    }
}
