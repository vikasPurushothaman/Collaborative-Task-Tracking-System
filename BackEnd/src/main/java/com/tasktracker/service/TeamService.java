package com.tasktracker.service;

import com.tasktracker.dto.CreateTeamRequest;
import com.tasktracker.dto.InviteMemberRequest;
import com.tasktracker.dto.TeamDTO;
import com.tasktracker.dto.UpdateTeamRequest;
import com.tasktracker.response.PagedResponse;

public interface TeamService {

    TeamDTO createTeam(CreateTeamRequest request, String ownerEmail);

    TeamDTO getTeamById(Long id);

    PagedResponse<TeamDTO> getAllTeams(int page, int size);

    TeamDTO updateTeam(Long id, UpdateTeamRequest request);

    void deleteTeam(Long id);

    TeamDTO joinTeam(Long teamId, String userEmail);

    TeamDTO leaveTeam(Long teamId, String userEmail);

    TeamDTO inviteMember(Long teamId, InviteMemberRequest request);

    TeamDTO removeMember(Long teamId, Long userId);
}
