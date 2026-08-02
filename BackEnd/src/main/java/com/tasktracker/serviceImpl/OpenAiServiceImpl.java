package com.tasktracker.serviceImpl;

import com.tasktracker.dto.AiGenerateDescriptionRequest;
import com.tasktracker.dto.AiGenerateDescriptionResponse;
import com.tasktracker.dto.AiTaskSummaryRequest;
import com.tasktracker.dto.AiTaskSummaryResponse;
import com.tasktracker.entity.Task;
import com.tasktracker.exception.TaskNotFoundException;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiServiceImpl implements OpenAiService {

    private final TaskRepository taskRepository;

    @Value("${openai.api.key:demo_key}")
    private String openAiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openAiApiUrl;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String openAiModel;

    @Override
    public AiGenerateDescriptionResponse generateDescription(AiGenerateDescriptionRequest request) {
        log.info("Generating AI description for task title: {}", request.getTitle());
        String prompt = "Generate a clear, professional, step-by-step task description for a task titled: '" + request.getTitle() + "'. Include objectives and acceptance criteria.";

        String generatedContent = callOpenAiApi(prompt);
        if (generatedContent == null || generatedContent.isBlank()) {
            generatedContent = "AI Generated Description for '" + request.getTitle() + "':\n" +
                    "1. Define requirements and goals.\n" +
                    "2. Execute core implementation following project architecture.\n" +
                    "3. Perform thorough testing and code review.";
        }

        return AiGenerateDescriptionResponse.builder()
                .generatedDescription(generatedContent)
                .build();
    }

    @Override
    public AiTaskSummaryResponse summarizeTask(AiTaskSummaryRequest request) {
        String textToSummarize;
        if (request.getTaskId() != null) {
            Task task = taskRepository.findById(request.getTaskId())
                    .orElseThrow(() -> new TaskNotFoundException(request.getTaskId()));
            textToSummarize = "Title: " + task.getTitle() + "\nDescription: " + task.getDescription() + "\nStatus: " + task.getStatus() + "\nPriority: " + task.getPriority();
        } else if (request.getText() != null && !request.getText().isBlank()) {
            textToSummarize = request.getText();
        } else {
            textToSummarize = "No content provided to summarize.";
        }

        log.info("Summarizing task content with AI");
        String prompt = "Provide a concise 2-sentence summary of the following task details:\n" + textToSummarize;
        String summary = callOpenAiApi(prompt);

        if (summary == null || summary.isBlank()) {
            summary = "Summary: " + textToSummarize.substring(0, Math.min(textToSummarize.length(), 150)) + "...";
        }

        return AiTaskSummaryResponse.builder()
                .summary(summary)
                .build();
    }

    private String callOpenAiApi(String prompt) {
        if ("demo_key".equalsIgnoreCase(openAiApiKey) || openAiApiKey == null || openAiApiKey.isBlank()) {
            log.warn("OpenAI API key not configured or using default demo key. Returning fallback response.");
            return null;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", openAiModel);

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);

            body.put("messages", messages);
            body.put("max_tokens", 500);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(openAiApiUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map firstChoice = (Map) choices.get(0);
                    Map message = (Map) firstChoice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception ex) {
            log.error("Failed to connect to OpenAI API: {}", ex.getMessage());
        }
        return null;
    }
}
