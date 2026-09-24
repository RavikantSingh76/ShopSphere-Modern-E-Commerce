package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.service.AiAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiAnalyticsController {

    @Autowired
    private AiAnalyticsService aiAnalyticsService;

    // Public Customer AI Shopping Assistant
    @GetMapping("/ai/assistant")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiAssistant(@RequestParam(required = false, defaultValue = "") String prompt) {
        return ResponseEntity.ok(ApiResponse.success(aiAnalyticsService.getSmartAiAssistance(prompt)));
    }

    // Admin Real-time Cloud Metrics Pulse
    @GetMapping("/admin/ai/realtime-pulse")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRealTimePulse() {
        return ResponseEntity.ok(ApiResponse.success(aiAnalyticsService.getRealTimePulse()));
    }

    // Admin AI Predictive Demand & Restock Forecasting
    @GetMapping("/admin/ai/demand-forecast")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDemandForecast() {
        return ResponseEntity.ok(ApiResponse.success(aiAnalyticsService.getDemandForecast()));
    }

    // Admin AI Customer Review Sentiment Analysis
    @GetMapping("/admin/ai/sentiment-analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSentimentAnalysis() {
        return ResponseEntity.ok(ApiResponse.success(aiAnalyticsService.getReviewSentimentAnalysis()));
    }
}
