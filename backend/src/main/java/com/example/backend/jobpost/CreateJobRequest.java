package com.example.backend.jobpost;

import jakarta.validation.constraints.NotBlank;

public class CreateJobRequest {
    @NotBlank
    private String jobName;

    @NotBlank
    private String date;

    @NotBlank
    private String startTime;

    @NotBlank
    private String endTime;

    @NotBlank
    private String description;

    // No-arg constructor (required by Jackson)
    public CreateJobRequest() {}

    // All-args constructor
    public CreateJobRequest(String jobName, String date, String startTime, String endTime, String description) {
        this.jobName = jobName;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.description = description;
    }

    public String getJobName() {
        return jobName;
    }
    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
