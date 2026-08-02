package com.tasktracker.exception;

public class UserNotFoundException extends ResourceNotFoundException {

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Long id) {
        super("User", "id", id);
    }

    public UserNotFoundException(String field, String value) {
        super("User", field, value);
    }
}
