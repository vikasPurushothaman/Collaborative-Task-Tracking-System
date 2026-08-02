package com.tasktracker.serviceImpl;

import com.tasktracker.dto.CreateTeamRequest;
import com.tasktracker.dto.InviteMemberRequest;
import com.tasktracker.dto.TeamDTO;
import com.tasktracker.dto.UpdateTeamRequest;
import com.tasktracker.entity.Team;
import com.tasktracker.entity.User;
import com.tasktracker.exception.BadRequestException;
import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.exception.UserNotFoundException;
import com.tasktracker.mapper.TeamMapper;
import com.tasktracker.repository.TeamRepository;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.TeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamMapper teamMapper;

    @Override
    @Transactional
    public TeamDTO createTeam(CreateTeamRequest request, String ownerEmail) {
        log.info("Creating team '{}' for owner {}", request.getTeamName(), ownerEmail);
        if (teamRepository.existsByTeamName(request.getTeamName())) {
            throw new BadRequestException("Team name '" + request.getTeamName() + "' already exists");
        }

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new UserNotFoundException("email", ownerEmail));

        Team team = teamMapper.toEntity(request);
        team.setOwner(owner);
        team.getMembers().add(owner);

        Team savedTeam = teamRepository.save(team);
        return teamMapper.toDto(savedTeam);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        return teamMapper.toDto(team);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TeamDTO> getAllTeams(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Team> teamsPage = teamRepository.findAll(pageable);
        List<TeamDTO> content = teamsPage.getContent().stream().map(teamMapper::toDto).toList();

        return PagedResponse.<TeamDTO>builder()
                .content(content)
                .page(teamsPage.getNumber())
                .size(teamsPage.getSize())
                .totalElements(teamsPage.getTotalElements())
                .totalPages(teamsPage.getTotalPages())
                .last(teamsPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public TeamDTO updateTeam(Long id, UpdateTeamRequest request) {
        log.info("Updating team id {}", id);
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));

        if (request.getTeamName() != null && !request.getTeamName().isBlank()) {
            if (!team.getTeamName().equalsIgnoreCase(request.getTeamName()) && teamRepository.existsByTeamName(request.getTeamName())) {
                throw new BadRequestException("Team name '" + request.getTeamName() + "' already exists");
            }
            team.setTeamName(request.getTeamName());
        }

        if (request.getDescription() != null) {
            team.setDescription(request.getDescription());
        }

        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toDto(updatedTeam);
    }

    @Override
    @Transactional
    public void deleteTeam(Long id) {
        log.info("Deleting team id {}", id);
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
        teamRepository.delete(team);
    }

    @Override
    @Transactional
    public TeamDTO joinTeam(Long teamId, String userEmail) {
        log.info("User {} joining team id {}", userEmail, teamId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("email", userEmail));

        team.getMembers().add(user);
        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toDto(updatedTeam);
    }

    @Override
    @Transactional
    public TeamDTO leaveTeam(Long teamId, String userEmail) {
        log.info("User {} leaving team id {}", userEmail, teamId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("email", userEmail));

        team.getMembers().remove(user);
        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toDto(updatedTeam);
    }

    @Override
    @Transactional
    public TeamDTO inviteMember(Long teamId, InviteMemberRequest request) {
        log.info("Inviting user {} to team id {}", request.getEmail(), teamId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("email", request.getEmail()));

        team.getMembers().add(user);
        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toDto(updatedTeam);
    }

    @Override
    @Transactional
    public TeamDTO removeMember(Long teamId, Long userId) {
        log.info("Removing user id {} from team id {}", userId, teamId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        team.getMembers().remove(user);
        Team updatedTeam = teamRepository.save(team);
        return teamMapper.toDto(updatedTeam);
    }
}
