package com.tasktracker.mapper;

import com.tasktracker.dto.CreateTeamRequest;
import com.tasktracker.dto.TeamDTO;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.entity.Team;
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
public class TeamMapperImpl implements TeamMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public TeamDTO toDto(Team team) {
        if ( team == null ) {
            return null;
        }

        TeamDTO.TeamDTOBuilder teamDTO = TeamDTO.builder();

        teamDTO.id( team.getId() );
        teamDTO.teamName( team.getTeamName() );
        teamDTO.description( team.getDescription() );
        teamDTO.owner( userMapper.toDto( team.getOwner() ) );
        teamDTO.members( userSetToUserDTOSet( team.getMembers() ) );
        teamDTO.createdAt( team.getCreatedAt() );
        teamDTO.updatedAt( team.getUpdatedAt() );

        return teamDTO.build();
    }

    @Override
    public Team toEntity(CreateTeamRequest request) {
        if ( request == null ) {
            return null;
        }

        Team.TeamBuilder team = Team.builder();

        team.teamName( request.getTeamName() );
        team.description( request.getDescription() );

        return team.build();
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
