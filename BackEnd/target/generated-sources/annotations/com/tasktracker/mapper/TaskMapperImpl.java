package com.tasktracker.mapper;

import com.tasktracker.dto.AttachmentDTO;
import com.tasktracker.dto.CommentDTO;
import com.tasktracker.dto.CreateTaskRequest;
import com.tasktracker.dto.TaskDTO;
import com.tasktracker.entity.Attachment;
import com.tasktracker.entity.Comment;
import com.tasktracker.entity.Task;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-02T15:50:20+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.19 (Ubuntu)"
)
@Component
public class TaskMapperImpl implements TaskMapper {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private AttachmentMapper attachmentMapper;

    @Override
    public TaskDTO toDto(Task task) {
        if ( task == null ) {
            return null;
        }

        TaskDTO.TaskDTOBuilder taskDTO = TaskDTO.builder();

        taskDTO.id( task.getId() );
        taskDTO.title( task.getTitle() );
        taskDTO.description( task.getDescription() );
        taskDTO.priority( task.getPriority() );
        taskDTO.status( task.getStatus() );
        taskDTO.dueDate( task.getDueDate() );
        taskDTO.assignedUser( userMapper.toDto( task.getAssignedUser() ) );
        taskDTO.createdBy( userMapper.toDto( task.getCreatedBy() ) );
        taskDTO.project( projectMapper.toDto( task.getProject() ) );
        taskDTO.attachments( attachmentListToAttachmentDTOList( task.getAttachments() ) );
        taskDTO.comments( commentListToCommentDTOList( task.getComments() ) );
        taskDTO.createdAt( task.getCreatedAt() );
        taskDTO.updatedAt( task.getUpdatedAt() );

        return taskDTO.build();
    }

    @Override
    public Task toEntity(CreateTaskRequest request) {
        if ( request == null ) {
            return null;
        }

        Task.TaskBuilder task = Task.builder();

        task.title( request.getTitle() );
        task.description( request.getDescription() );
        task.priority( request.getPriority() );
        task.dueDate( request.getDueDate() );

        return task.build();
    }

    protected List<AttachmentDTO> attachmentListToAttachmentDTOList(List<Attachment> list) {
        if ( list == null ) {
            return null;
        }

        List<AttachmentDTO> list1 = new ArrayList<AttachmentDTO>( list.size() );
        for ( Attachment attachment : list ) {
            list1.add( attachmentMapper.toDto( attachment ) );
        }

        return list1;
    }

    protected List<CommentDTO> commentListToCommentDTOList(List<Comment> list) {
        if ( list == null ) {
            return null;
        }

        List<CommentDTO> list1 = new ArrayList<CommentDTO>( list.size() );
        for ( Comment comment : list ) {
            list1.add( commentMapper.toDto( comment ) );
        }

        return list1;
    }
}
