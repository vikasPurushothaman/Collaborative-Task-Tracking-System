package com.tasktracker.exception;

public class ProjectNotFoundException extends ResourceNotFoundException {

    public ProjectNotFoundException(String message) {
        super(message);
    }

    public ProjectNotFoundException(Long id) {
        super("Project", "id", id);
    }
}
