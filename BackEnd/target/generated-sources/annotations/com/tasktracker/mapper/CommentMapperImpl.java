package com.tasktracker.mapper;

import com.tasktracker.dto.CommentDTO;
import com.tasktracker.entity.Comment;
import com.tasktracker.entity.Task;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-02T15:50:20+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.19 (Ubuntu)"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public CommentDTO toDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentDTO.CommentDTOBuilder commentDTO = CommentDTO.builder();

        commentDTO.taskId( commentTaskId( comment ) );
        commentDTO.id( comment.getId() );
        commentDTO.message( comment.getMessage() );
        commentDTO.user( userMapper.toDto( comment.getUser() ) );
        commentDTO.createdAt( comment.getCreatedAt() );
        commentDTO.updatedAt( comment.getUpdatedAt() );

        return commentDTO.build();
    }

    private Long commentTaskId(Comment comment) {
        if ( comment == null ) {
            return null;
        }
        Task task = comment.getTask();
        if ( task == null ) {
            return null;
        }
        Long id = task.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
