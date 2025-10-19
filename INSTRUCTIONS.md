# Project Summary for LLM Instructions

### Project Purpose

This project is an AI-powered chat application that allows users to generate images and videos through a conversational interface. It leverages the Higgsfield API for multimedia generation and Google's Gemini for natural language understanding. The application is designed to be run in a containerized environment using Docker.

### High-Level Architecture

The application follows a client-server architecture:

*   **Backend:** A FastAPI server that exposes a RESTful API. It acts as a wrapper around the Higgsfield and Gemini APIs. The core logic is built with LangGraph to create a stateful, multi-step AI agent.
*   **Frontend:** A simple, single-page application built with vanilla HTML and JavaScript. It is served by a basic Python HTTP server and communicates with the backend API.
*   **External Services:**
    *   **Higgsfield API:** Used for text-to-image, text-to-video, and image-to-video generation.
    *   **Google Gemini API:** Powers the conversational AI agent.

### Key Technologies and Libraries

*   **Backend:**
    *   **Framework:** FastAPI
    *   **ASGI Server:** Uvicorn
    *   **AI/LLM:** LangGraph, LangChain, `langchain-google-genai`
    *   **HTTP Client:** HTTPX
    *   **Configuration:** Pydantic
    *   **Logging:** Structlog
*   **Containerization:**
    *   Docker
    *   Docker Compose
*   **Build & Automation:**
    *   Makefile

### Build and Run Instructions

To build and run the application, follow these steps:

1.  **Environment Setup:**
    *   Create a `.env` file by copying `.env.example`: `cp .env.example .env`
    *   Populate the `.env` file with your API keys for `HF_API_KEY`, `HF_SECRET`, and `GEMINI_API_KEY`.

2.  **Running with Docker (Recommended):**
    *   Build and start the Docker containers in detached mode:
        ```bash
        make docker-build
        make docker-up
        ```
    *   Alternatively, you can use `docker-compose`:
        ```bash
        docker-compose up --build -d
        ```

4.  **Stopping the Application:**
    *   To stop the Docker containers, run:
        ```bash
        make docker-down
        ```
        or
        ```bash
        docker-compose down
        ```

# API Documentation

This document provides a detailed overview of the API endpoints for the Higgsfield backend.

## Chat

### `POST /v1/chat`

Initiates a chat conversation with the AI agent. The agent can perform actions like generating images or videos based on the conversation.

**Request Body:**

```json
{
  "message": "Create a video of a cat playing a piano.",
  "conversation_history": [
    {
      "role": "user",
      "content": "Can you make videos?"
    },
    {
      "role": "assistant",
      "content": "Yes, I can generate videos from text or images. What would you like to create?"
    }
  ]
}
```

**Success Response:**

The response includes the assistant's message and, if a generation task was started, details about the job.

```json
{
  "message": "I've started creating your video of a cat playing a piano. It should be ready in about 2-5 minutes.",
  "job_details": {
    "job_set_id": "abc-123-def-456",
    "status": "queued",
    "job_type": "text-to-video",
    "model": "seedance-v1-lite",
    "parameters": {
      "prompt": "A cat playing a piano.",
      "aspect_ratio": "16:9"
    },
    "estimated_time": "2-5 minutes"
  },
  "action_performed": "generate_video"
}
```

## Image-to-Video (I2V)

These endpoints generate a video based on a source image and a text prompt.

### `POST /v1/i2v/kling25`

Creates a video using the `kling25` model.

**Request Body:**

```json
{
  "input_images": [
    {
      "type": "image_url",
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "prompt": "Make the person in the image wave.",
  "aspect_ratio": "16:9",
  "camera_control": "zoom_in"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-123",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

### `POST /v1/i2v/minimax`

Creates a video using the `minimax` model.

**Request Body:**

```json
{
  "input_images": [
    {
      "type": "image_url",
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "prompt": "Animate this painting.",
  "aspect_ratio": "1:1"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-456",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

### `POST /v1/i2v/seedance`

Creates a video using the `seedance` model.

**Request Body:**

```json
{
  "input_images": [
    {
      "type": "image_url",
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "prompt": "Make the clouds move.",
  "aspect_ratio": "9:16"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-789",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

### `POST /v1/i2v/veo3`

Creates a video using the `veo3` model.

**Request Body:**

```json
{
  "input_images": [
    {
      "type": "image_url",
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "prompt": "Make the water ripple.",
  "aspect_ratio": "16:9"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-101",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

### `POST /v1/i2v/wan25-fast`

Creates a video using the `wan25-fast` model.

**Request Body:**

```json
{
  "input_images": [
    {
      "type": "image_url",
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "prompt": "A gentle breeze.",
  "aspect_ratio": "16:9",
  "duration_sec": 5
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-112",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

## Text-to-Image (T2I)

These endpoints generate an image based on a text prompt.

### `POST /v1/t2i/nano-banana`

Creates an image using the `nano-banana` model.

**Request Body:**

```json
{
  "prompt": "A futuristic cityscape at dusk, neon lights.",
  "aspect_ratio": "16:9",
  "batch_size": 1,
  "negative_prompt": "blurry, ugly, deformed"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-131",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

### `POST /v1/t2i/seedream4`

Creates an image using the `seedream4` model.

**Request Body:**

```json
{
  "prompt": "An oil painting of a robot reading a book in a library.",
  "aspect_ratio": "1:1",
  "batch_size": 2
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-415",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

## Text-to-Video (T2V)

These endpoints generate a video based on a text prompt.

### `POST /v1/t2v/minimax-hailuo-02`

Creates a video using the `minimax-hailuo-02` model.

**Request Body:**

```json
{
  "prompt": "A cinematic shot of a spaceship flying through a nebula.",
  "aspect_ratio": "16:9",
  "duration": 8,
  "resolution": "1280"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-161",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

### `POST /v1/t2v/seedance-v1-lite`

Creates a video using the `seedance-v1-lite` model.

**Request Body:**

```json
{
  "prompt": "A time-lapse of a flower blooming.",
  "aspect_ratio": "9:16",
  "duration": 5,
  "resolution": "720"
}
```

**Success Response:**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "job_set_id": "higgs-job-set-id-718",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

## Jobs

### `GET /v1/jobs/{job_set_id}`

Retrieves the status of a specific job set, including the status of all individual jobs within the set.

**Success Response:**

```json
{
  "id": "higgs-job-set-id-123",
  "status": "completed",
  "jobs": [
    {
      "id": "higgs-job-id-456",
      "status": "completed",
      "progress": 100,
      "result": {
        "url": "https://example.com/result.mp4",
        "min_url": null,
        "raw_url": null,
        "duration": 5.0,
        "metadata": {}
      },
      "error": null,
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:05:00Z"
    }
  ],
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:05:00Z",
  "metadata": {}
}
```

### `POST /v1/jobs/{job_set_id}/refresh`

Forces a refresh of the job status from the underlying generation service.

**Success Response:**

Returns the same structure as the `GET /v1/jobs/{job_set_id}` endpoint with the updated status.

## Health

### `GET /health`

Provides a health check for the API service.

**Success Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "higgsfield-api"
}

# Frontend Development Guide

This guide provides an overview of the frontend JavaScript logic in `frontend.html` and explains how it interacts with the backend API to provide chat functionality, handle job polling, and display results.

## Frontend Workflow

The frontend workflow can be broken down into the following steps:

### 1. Form Submission

The user initiates a conversation by typing a message in the input field and clicking "Send" or pressing Enter. This triggers the `sendMessage()` function.

```javascript
async function sendMessage() {
    const input = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to UI
    addMessage('user', message);

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // ... (UI updates)
}
```

### 2. `POST /v1/chat` Request

The `sendMessage()` function constructs a `POST` request to the `/v1/chat` endpoint. The request body includes the user's message and the conversation history.

```javascript
try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            conversation_history: conversationHistory
        })
    });

    const data = await response.json();

    // ... (handle response)
} catch (error) {
    // ... (handle error)
}
```

### 3. Initial Response Processing

The frontend processes the initial JSON response from the chat endpoint. The assistant's message is displayed, and if the response includes `job_details`, a job card is created.

```javascript
// Add assistant message
addMessage('assistant', data.message, data.job_details);

// Add to conversation history
conversationHistory.push({
    role: 'assistant',
    content: data.message
});
```

### 4. Polling `GET /v1/jobs/{job_set_id}`

If a job is created, the frontend begins polling the `GET /v1/jobs/{job_set_id}` endpoint every 3 seconds to check the job status.

The `startPolling` function sets up the polling interval:

```javascript
function startPolling(jobId) {
    // Poll every 3 seconds
    const interval = setInterval(() => {
        if (!activeJobs.has(jobId)) {
            clearInterval(interval);
            return;
        }
        checkJobStatus(jobId);
    }, 3000);
}
```

The `checkJobStatus` function makes the `fetch` request and processes the response:

```javascript
async function checkJobStatus(jobId) {
    try {
        const response = await fetch(`http://localhost:8000/v1/jobs/${jobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        // ... (process job status)

        // If completed or failed, stop polling
        if (jobDetails.status === 'completed' || jobDetails.status === 'failed') {
            activeJobs.delete(jobId);
        }

    } catch (error) {
        console.error('Error checking status:', error);
    }
}
```

### 5. Displaying Final Media

Once the job status is "completed," the `updateJobCard` function is called. It dynamically creates an `<img>` or `<video>` element to display the final media, along with a download link.

```javascript
function updateJobCard(jobDetails) {
    const jobCard = document.getElementById(`job-${jobDetails.job_set_id}`);
    if (jobCard) {
        // ... (update status badge)

        // If completed, show the result image/video
        if (jobDetails.status === 'completed' && jobDetails.result_url) {
            const details = jobCard.querySelector('.job-details');
            if (details && !details.querySelector('.result-media')) {
                const mediaDiv = document.createElement('div');
                mediaDiv.className = 'result-media';
                mediaDiv.style.marginTop = '15px';

                // Check if it's a video or image
                const isVideo = jobDetails.result_url.includes('.mp4') || jobDetails.result_url.includes('video');

                if (isVideo) {
                    mediaDiv.innerHTML = `
                        <video controls style="max-width: 100%; border-radius: 8px; margin-bottom: 10px;">
                            <source src="${jobDetails.result_url}" type="video/mp4">
                        </video>
                        <div><a href="${jobDetails.result_url}" target="_blank" style="color: #4CAF50; text-decoration: none;">⬇️ Download Video</a></div>
                    `;
                } else {
                    mediaDiv.innerHTML = `
                        <img src="${jobDetails.result_url}" alt="Generated result" style="max-width: 100%; border-radius: 8px; margin-bottom: 10px;">
                        <div><a href="${jobDetails.result_url}" target="_blank" style="color: #4CAF50; text-decoration: none;">⬇️ Download Image</a></div>
                    `;
                }

                details.appendChild(mediaDiv);
            }
        }
    }
}
```

### 6. Error Handling

Errors during the `fetch` call to `/v1/chat` are caught in a `try...catch` block. An error message is displayed to the user in the chat interface.

```javascript
} catch (error) {
    hideTyping();
    addMessage('assistant', `Error: ${error.message}`);
}
```