package com.tasktracker.controller;

import com.tasktracker.dto.CreateTeamRequest;
import com.tasktracker.dto.InviteMemberRequest;
import com.tasktracker.dto.TeamDTO;
import com.tasktracker.dto.UpdateTeamRequest;
import com.tasktracker.response.ApiResponse;
import com.tasktracker.response.PagedResponse;
import com.tasktracker.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Tag(name = "Teams", description = "Team Management APIs")
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @Operation(summary = "Create team")
    public ResponseEntity<ApiResponse<TeamDTO>> createTeam(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateTeamRequest request) {
        TeamDTO team = teamService.createTeam(request, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Team created successfully", team), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated team list")
    public ResponseEntity<ApiResponse<PagedResponse<TeamDTO>>> getTeams(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PagedResponse<TeamDTO> teams = teamService.getAllTeams(page, size);
        return ResponseEntity.ok(ApiResponse.success("Teams retrieved successfully", teams));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get team details by ID")
    public ResponseEntity<ApiResponse<TeamDTO>> getTeamById(@PathVariable Long id) {
        TeamDTO team = teamService.getTeamById(id);
        return ResponseEntity.ok(ApiResponse.success("Team details retrieved", team));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update team details")
    public ResponseEntity<ApiResponse<TeamDTO>> updateTeam(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTeamRequest request) {
        TeamDTO team = teamService.updateTeam(id, request);
        return ResponseEntity.ok(ApiResponse.success("Team updated successfully", team));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete team by ID")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok(ApiResponse.success("Team deleted successfully"));
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Join team")
    public ResponseEntity<ApiResponse<TeamDTO>> joinTeam(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        TeamDTO team = teamService.joinTeam(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Joined team successfully", team));
    }

    @PostMapping("/{id}/leave")
    @Operation(summary = "Leave team")
    public ResponseEntity<ApiResponse<TeamDTO>> leaveTeam(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        TeamDTO team = teamService.leaveTeam(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Left team successfully", team));
    }

    @PostMapping("/{id}/invite")
    @Operation(summary = "Invite member to team")
    public ResponseEntity<ApiResponse<TeamDTO>> inviteMember(
            @PathVariable Long id,
            @Valid @RequestBody InviteMemberRequest request) {
        TeamDTO team = teamService.inviteMember(id, request);
        return ResponseEntity.ok(ApiResponse.success("Member invited to team successfully", team));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @Operation(summary = "Remove member from team")
    public ResponseEntity<ApiResponse<TeamDTO>> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId) {
        TeamDTO team = teamService.removeMember(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Member removed from team successfully", team));
    }
}
