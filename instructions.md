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
*   **Frontend:**
    *   Vanilla HTML, CSS, and JavaScript
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

3.  **Running the Frontend:**
    *   Once the backend is running, start the frontend server:
        ```bash
        python3 serve_frontend.py
        ```
    *   Access the application in your browser at `http://localhost:3000/frontend.html`.

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

### Authentication

All API requests must be authenticated using an API key. The key should be included in the `Authorization` header as a Bearer token.

**Example:**
`Authorization: Bearer YOUR_API_KEY`

### General Information

#### Rate Limits

The API is limited to 60 requests per minute. Exceeding this limit will result in a `429 Too Many Requests` error.

#### Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

| Code | Meaning | Description |
| :--- | :--- | :--- |
| `400` | Bad Request | Your request is malformed. The response body will contain a `detail` field with more information. |
| `401` | Unauthorized | Your API key is missing or invalid. |
| `429` | Too Many Requests | You have exceeded the rate limit. |
| `500` | Internal Server Error | Something went wrong on our end. |

**Example `400 Bad Request` Response:**
```json
{
  "detail": "Invalid aspect_ratio provided. Must be one of ['16:9', '9:16', '1:1', '4:3', '3:4']"
}
```

## Chat Router (`/v1/chat`)

### `POST /`

*   **Description:** Handles a user's chat message, processes it through a chat agent, and returns a response. It can also initiate background jobs for generating images or videos.
*   **Request Body (`ChatRequest`):**
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
*   **Success Response (`ChatResponse`):**
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
    *   **`action_performed` possible values:** `generate_video`, `generate_image`, `no_action`

### `POST /stream`

*   **Description:** Handles a user's chat message and streams the response back using Server-Sent Events (SSE). This is useful for creating a more interactive, real-time "typing" effect in the UI.
*   **Request Body (`ChatRequest`):**
    ```json
    {
      "message": "Tell me a story about a brave knight.",
      "conversation_history": []
    }
    ```
*   **Response Body (`StreamingResponse`):** A stream of server-sent events. Each event has an `event` type of `message` and the `data` is a JSON object containing a chunk of the response.
    **Example Stream Chunk:**
    ```
    event: message
    data: {"chunk": "Once upon a time..."}
    ```

## Image-to-Video Router (`/v1/i2v`)

### `POST /kling25`

*   **Description:** Creates a video from an image using the `kling25` model. Known for generating high-quality, realistic motion.
*   **Request Body (`Kling25I2VRequest`):**
    *   `input_images`: An array containing a single object with a public URL to the image.
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.
    *   `camera_control`: Accepted values: `"zoom_in"`, `"zoom_out"`, `"pan_left"`, `"pan_right"`, `"pan_up"`, `"pan_down"`.

### `POST /minimax`

*   **Description:** Creates a video from an image using the `minimax` model. A versatile model for general-purpose animations.
*   **Request Body (`MinimaxI2VRequest`):**
    *   `input_images`: An array containing a single object with a public URL to the image.
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.

### `POST /seedance`

*   **Description:** Creates a video from an image using the `seedance` model. Often used for dynamic and fluid animations.
*   **Request Body (`I2VRequest`):**
    *   `input_images`: An array containing a single object with a public URL to the image.
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.

### `POST /veo3`

*   **Description:** Creates a video from an image using the `veo3` model. Specializes in creating realistic and detailed video outputs.
*   **Request Body (`Veo3I2VRequest`):**
    *   `input_images`: An array containing a single object with a public URL to the image.
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.

### `POST /wan25-fast`

*   **Description:** Creates a video from an image using the `wan25-fast` model. Optimized for faster generation times.
*   **Request Body (`Wan25FastI2VRequest`):**
    *   `input_images`: An array containing a single object with a public URL to the image.
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.
    *   `duration_sec`: An integer between 1 and 10.

## Text-to-Image Router (`/v1/t2i`)

### `POST /nano-banana`

*   **Description:** Creates an image from a text prompt using the `nano-banana` model.
*   **Request Body (`NanoBananaT2IRequest`):**
    *   `aspect_ratio`: Accepted values: `"1:1"`, `"16:9"`, `"9:16"`, `"4:3"`, `"3:4"`, `"2:3"`, `"3:2"`.

### `POST /seedream4`

*   **Description:** Creates an image from a text prompt using the `seedream4` model.
*   **Request Body (`Seedream4T2IRequest`):**
    *   `aspect_ratio`: Accepted values: `"1:1"`, `"16:9"`, `"9:16"`, `"4:3"`, `"3:4"`, `"2:3"`, `"3:2"`.

## Text-to-Video Router (`/v1/t2v`)

### `POST /minimax-hailuo-02`

*   **Description:** Creates a video from a text prompt using the `minimax-hailuo-02` model. Suitable for a wide range of cinematic styles.
*   **Request Body (`MinimaxT2VRequest`):**
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.
    *   `duration`: An integer between 1 and 10.

### `POST /seedance-v1-lite`

*   **Description:** Creates a video from a text prompt using the `seedance-v1-lite` model. A lightweight model for quick video generation.
*   **Request Body (`SeedanceT2VRequest`):**
    *   `aspect_ratio`: Accepted values: `"16:9"`, `"9:16"`, `"1:1"`, `"4:3"`, `"3:4"`.
    *   `duration`: An integer between 1 and 10.

## Jobs Router (`/v1/jobs`)

### `GET /{job_set_id}`

*   **Description:** Retrieves the status of a specific job set.
*   **Request Body:** None
*   **Success Response (`JobSetStatus`):**
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
            "min_url": "https://example.com/result_min.mp4",
            "raw_url": "https://example.com/result_raw.mp4",
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

### `POST /{job_set_id}/refresh`

*   **Description:** Refreshes the status of a specific job set. Use this endpoint if you suspect the job status is stale or to force an immediate check, but regular polling of the GET endpoint is preferred.
*   **Request Body:** None
*   **Success Response (`JobSetStatus`):** Returns the same structure as the `GET` endpoint with the updated status.

## Job Handling Guide for Frontend

This guide explains the lifecycle of a media generation job from a frontend perspective, from initiation to completion.

### Step 1: Initiating a Job

When you send a `POST` request to any image or video generation endpoint, the API immediately responds with a confirmation that the job has been submitted. The key piece of information in this response is the `job_set_id`. You must store this `job_set_id` to track the job's progress.

### Step 2: Polling for Status

Since video and image generation can take time, you need to periodically check the job's status by polling the `GET /v1/jobs/{job_set_id}` endpoint. A recommended polling interval is every 3-5 seconds.

### Step 3: Interpreting Job Status

The response from the jobs endpoint contains a `status` field that tells you the current state of the job. The key statuses are:

*   `queued`: The job has been received and is waiting in line to be processed.
*   `processing`: The job is actively being worked on.
*   `completed`: The job has finished successfully.
*   `failed`: The job could not be completed due to an error.

### Step 4: Handling a Completed Job

When the `status` is `completed`, the response will contain the URL to the final media.

*   **`jobs` Array:** The `jobs` array can sometimes contain multiple jobs, especially for batch operations. Your UI should be prepared to loop through and display all of them.
*   **Result URLs:**
    *   `url`: The primary URL for the final, high-quality media.
    *   `min_url`: May provide a link to a lower-resolution preview.
    *   `raw_url`: May provide a link to an unprocessed output.

### Step 5: Handling a Failed Job

If the `status` is `failed`, the response may contain an `error` field with details about what went wrong. Your UI should inform the user that the generation failed and display an appropriate error message.

### Edge Cases and Error Recovery

*   **Polling Request Fails:** If a polling request to `GET /v1/jobs/{job_set_id}` fails due to a network error or server hiccup, you should implement a retry mechanism. It is recommended to use an exponential backoff strategy to avoid overwhelming the server.
*   **`result.url` is `null` on Success:** In rare cases, a job might complete with a `status` of `completed` but the `result.url` is `null`. This could indicate a transient issue with file storage. In this scenario, you can try calling the `POST /{job_set_id}/refresh` endpoint to see if the URL becomes available. If it remains `null`, treat the job as failed.

## Health Router

### `GET /health`

*   **Description:** Performs a health check of the API.
*   **Request Body:** None
*   **Success Response (`HealthResponse`):**
    ```json
    {
      "status": "healthy",
      "version": "1.0.0",
      "service": "higgsfield-api"
    }
    ```

### `GET /`

*   **Description:** Root endpoint, also performs a health check.
*   **Request Body:** None
*   **Success Response (`HealthResponse`):**
    ```json
    {
      "status": "healthy",
      "version": "1.0.0",
      "service": "higgsfield-api"
    }