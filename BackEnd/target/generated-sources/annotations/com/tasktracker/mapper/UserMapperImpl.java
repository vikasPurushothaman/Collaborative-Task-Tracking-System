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
    date = "2026-08-02T21:25:22+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.createdAt( user.getCreatedAt() );
        userDTO.email( user.getEmail() );
        userDTO.firstName( user.getFirstName() );
        userDTO.id( user.getId() );
        userDTO.lastName( user.getLastName() );
        userDTO.phone( user.getPhone() );
        userDTO.profileImage( user.getProfileImage() );
        userDTO.role( user.getRole() );
        userDTO.status( user.getStatus() );
        userDTO.updatedAt( user.getUpdatedAt() );

        return userDTO.build();
    }

    @Override
    public User toEntity(RegisterRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( request.getEmail() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
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

        user.email( request.getEmail() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
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
