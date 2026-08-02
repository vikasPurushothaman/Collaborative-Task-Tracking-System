package com.tasktracker.service;

import com.tasktracker.dto.AiGenerateDescriptionRequest;
import com.tasktracker.dto.AiGenerateDescriptionResponse;
import com.tasktracker.dto.AiTaskSummaryRequest;
import com.tasktracker.dto.AiTaskSummaryResponse;

public interface OpenAiService {

    AiGenerateDescriptionResponse generateDescription(AiGenerateDescriptionRequest request);

    AiTaskSummaryResponse summarizeTask(AiTaskSummaryRequest request);
}
