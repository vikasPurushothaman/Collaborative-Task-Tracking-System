package com.tasktracker.mapper;

import com.tasktracker.dto.CreateTeamRequest;
import com.tasktracker.dto.TeamDTO;
import com.tasktracker.entity.Team;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface TeamMapper {

    TeamDTO toDto(Team team);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "members", ignore = true)
    Team toEntity(CreateTeamRequest request);
}
