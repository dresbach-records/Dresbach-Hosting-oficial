# Go Backend for Dresbach Hosting

This directory contains the Go source code for the backend API server. It handles user authentication, session management, and serves protected data.

## 1. Prerequisites

- [Go](https://go.dev/doc/install) (version 1.21 or later) installed on your machine.
- A Firebase project.

## 2. Configuration

### a. Environment Variables

The server is configured using environment variables. Create a `.env` file in the root of the project (one level above this `backend` directory) with the following content:

```
# A long, random, and secret string for encrypting session cookies.
# You can generate one using: openssl rand -base64 32
SESSION_KEY="a-very-secret-key-that-should-be-long-and-random"

# Path to your Firebase service account key file.
GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
```

### b. Firebase Service Account

You need a Firebase service account key to allow the Go server to act as an administrator for your Firebase project.

1.  Go to your Firebase project console.
2.  Click the gear icon next to "Project Overview" and select **Project settings**.
3.  Go to the **Service accounts** tab.
4.  Click **Generate new private key**.
5.  A JSON file will be downloaded. Rename this file to `serviceAccountKey.json` and place it in the **root** of your project folder (the same level as the `.env` file).

**IMPORTANT:** This `serviceAccountKey.json` file is highly sensitive. **DO NOT** commit it to version control. Ensure your `.gitignore` file includes `serviceAccountKey.json`.

## 3. Running the Server

1.  **Open a terminal** and navigate to this directory (`backend/go`).

2.  **Install dependencies:**
    The first time you run the server, Go will automatically download the necessary dependencies listed in `go.mod`.

    ```sh
    go mod tidy
    ```

3.  **Run the server:**

    ```sh
    go run server.go
    ```

4.  The server will start on `http://localhost:8080`. You should see the log message: `Server starting on port 8080`.

The server is now running and ready to accept requests from the frontend application.
