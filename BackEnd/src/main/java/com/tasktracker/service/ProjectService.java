package com.tasktracker.service;

import com.tasktracker.dto.CreateProjectRequest;
import com.tasktracker.dto.InviteMemberRequest;
import com.tasktracker.dto.ProjectDTO;
import com.tasktracker.dto.UpdateProjectRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.response.PagedResponse;

import java.util.Set;

public interface ProjectService {

    ProjectDTO createProject(CreateProjectRequest request, String currentUserEmail);

    ProjectDTO getProjectById(Long id);

    PagedResponse<ProjectDTO> getAllProjects(int page, int size, String sortBy, String sortDir);

    ProjectDTO updateProject(Long id, UpdateProjectRequest request);

    void deleteProject(Long id);

    ProjectDTO inviteMember(Long projectId, InviteMemberRequest request);

    ProjectDTO removeMember(Long projectId, Long userId);

    ProjectDTO assignProjectManager(Long projectId, Long managerId);

    Set<UserDTO> getProjectMembers(Long projectId);
}
