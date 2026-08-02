package com.tasktracker.repository;

import com.tasktracker.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    Page<Task> findByIsDeletedFalse(Pageable pageable);

    Page<Task> findByAssignedUserIdAndIsDeletedFalse(Long assignedUserId, Pageable pageable);

    List<Task> findByDueDateBetweenAndIsDeletedFalse(LocalDateTime start, LocalDateTime end);
}
