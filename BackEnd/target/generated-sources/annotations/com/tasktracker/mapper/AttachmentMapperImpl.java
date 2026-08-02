package com.tasktracker.mapper;

import com.tasktracker.dto.AttachmentDTO;
import com.tasktracker.entity.Attachment;
import com.tasktracker.entity.Task;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-02T15:50:20+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.19 (Ubuntu)"
)
@Component
public class AttachmentMapperImpl implements AttachmentMapper {

    @Override
    public AttachmentDTO toDto(Attachment attachment) {
        if ( attachment == null ) {
            return null;
        }

        AttachmentDTO.AttachmentDTOBuilder attachmentDTO = AttachmentDTO.builder();

        attachmentDTO.taskId( attachmentTaskId( attachment ) );
        attachmentDTO.id( attachment.getId() );
        attachmentDTO.fileName( attachment.getFileName() );
        attachmentDTO.filePath( attachment.getFilePath() );
        attachmentDTO.fileType( attachment.getFileType() );
        attachmentDTO.fileSize( attachment.getFileSize() );
        attachmentDTO.uploadedDate( attachment.getUploadedDate() );

        return attachmentDTO.build();
    }

    private Long attachmentTaskId(Attachment attachment) {
        if ( attachment == null ) {
            return null;
        }
        Task task = attachment.getTask();
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
