package com.tasktracker.mapper;

import com.tasktracker.dto.AttachmentDTO;
import com.tasktracker.entity.Attachment;
import com.tasktracker.entity.Task;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-02T21:25:22+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        attachmentDTO.fileName( attachment.getFileName() );
        attachmentDTO.filePath( attachment.getFilePath() );
        attachmentDTO.fileSize( attachment.getFileSize() );
        attachmentDTO.fileType( attachment.getFileType() );
        attachmentDTO.id( attachment.getId() );
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
