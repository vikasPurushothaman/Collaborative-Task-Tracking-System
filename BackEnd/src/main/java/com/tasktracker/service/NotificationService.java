package com.tasktracker.service;

import com.tasktracker.entity.Comment;
import com.tasktracker.entity.Project;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.User;

public interface NotificationService {

    void notifyTaskAssigned(Task task);

    void notifyTaskUpdated(Task task);

    void notifyCommentAdded(Comment comment);

    void notifyDeadlineNear(Task task);

    void notifyProjectInvitation(Project project, User member);
}
