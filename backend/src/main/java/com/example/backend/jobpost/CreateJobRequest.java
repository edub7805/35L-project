package com.example.backend.jobpost;

import jakarta.validation.constraints.NotBlank;

public class CreateJobRequest {
    @NotBlank
    private String jobName;

    @NotBlank
    private String time;

    @NotBlank
    private String description;

    // No-arg constructor (required by Jackson)
    public CreateJobRequest() {}

    // All-args constructor (optional, but handy)
    public CreateJobRequest(String jobName, String time, String description) {
        this.jobName = jobName;
        this.time = time;
        this.description = description;
    }

    public String getJobName() {
        return jobName;
    }
    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getTime() {
        return time;
    }
    public void setTime(String time) {
        this.time = time;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
