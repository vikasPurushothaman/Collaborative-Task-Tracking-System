package com.tasktracker.exception;

public class TaskNotFoundException extends ResourceNotFoundException {

    public TaskNotFoundException(String message) {
        super(message);
    }

    public TaskNotFoundException(Long id) {
        super("Task", "id", id);
    }
}
