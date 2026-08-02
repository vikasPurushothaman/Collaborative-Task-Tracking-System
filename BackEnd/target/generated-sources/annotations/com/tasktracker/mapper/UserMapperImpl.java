package com.tasktracker.mapper;

import com.tasktracker.dto.CreateUserRequest;
import com.tasktracker.dto.RegisterRequest;
import com.tasktracker.dto.UpdateUserRequest;
import com.tasktracker.dto.UserDTO;
import com.tasktracker.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-02T15:50:20+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.19 (Ubuntu)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.id( user.getId() );
        userDTO.firstName( user.getFirstName() );
        userDTO.lastName( user.getLastName() );
        userDTO.email( user.getEmail() );
        userDTO.phone( user.getPhone() );
        userDTO.profileImage( user.getProfileImage() );
        userDTO.role( user.getRole() );
        userDTO.status( user.getStatus() );
        userDTO.createdAt( user.getCreatedAt() );
        userDTO.updatedAt( user.getUpdatedAt() );

        return userDTO.build();
    }

    @Override
    public User toEntity(RegisterRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.email( request.getEmail() );
        user.phone( request.getPhone() );
        user.role( request.getRole() );

        return user.build();
    }

    @Override
    public User toEntity(CreateUserRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.email( request.getEmail() );
        user.phone( request.getPhone() );
        user.role( request.getRole() );

        return user.build();
    }

    @Override
    public void updateUserFromDto(UpdateUserRequest dto, User user) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getFirstName() != null ) {
            user.setFirstName( dto.getFirstName() );
        }
        if ( dto.getLastName() != null ) {
            user.setLastName( dto.getLastName() );
        }
        if ( dto.getPhone() != null ) {
            user.setPhone( dto.getPhone() );
        }
        if ( dto.getProfileImage() != null ) {
            user.setProfileImage( dto.getProfileImage() );
        }
        if ( dto.getRole() != null ) {
            user.setRole( dto.getRole() );
        }
    }
}
