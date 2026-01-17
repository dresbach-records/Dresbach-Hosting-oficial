/**
 * @fileoverview This file contains utility functions for making API calls to your Go backend.
 * It provides a standardized way to handle API requests from the Next.js application.
 */

// The base URL for your Go backend API.
// It's recommended to set this in your .env file for flexibility between environments.
const GO_BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL || 'http://localhost:8080';

/**
 * A generic and reusable function to make API requests to your Go backend.
 * It handles setting JSON headers, and basic success/error responses.
 *
 * @template T The expected type of the data in the successful response.
 * @param endpoint The specific API endpoint to call (e.g., '/auth/login' or '/user/profile').
 * @param options The standard options for the `fetch` request (e.g., method, body).
 * @returns A promise that resolves to the JSON data of type T from the backend.
 * @throws An error if the network request fails or if the API returns a non-ok status.
 */
export async function fetchFromGoBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${GO_BACKEND_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // You could add authorization headers here if needed, e.g.,
      // 'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Attempt to parse a more specific error message from the backend response body
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorBody.error || errorMessage;
    } catch (e) {
      // The error response was not JSON, use the status text
      errorMessage = `${errorMessage}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // If the request was successful and the response has content, parse and return it.
  // Otherwise, for responses like 200 OK with no body, return an empty object.
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
      return response.json();
  }
  return {} as T;
}

/**
 * --- HOW TO USE ---
 *
 * 1.  **Configure your backend URL:**
 *     In your `.env` file, add the following line with the correct URL for your Go backend:
 *     `NEXT_PUBLIC_GO_BACKEND_URL=http://localhost:8080`
 *
 * 2.  **Use in a component or Server Action:**
 *     Import the function and call it to interact with your backend.
 *
 *     Example (fetching a user profile in a React component):
 *
 *     ```jsx
 *     import { useEffect, useState } from 'react';
 *     import { fetchFromGoBackend } from '@/lib/go-api';
 *
 *     function UserProfile() {
 *       const [profile, setProfile] = useState(null);
 *
 *       useEffect(() => {
 *         const loadProfile = async () => {
 *           try {
 *             // Assuming your Go backend has a GET /user/profile endpoint
 *             const data = await fetchFromGoBackend('/user/profile');
 *             setProfile(data);
 *           } catch (error) {
 *             console.error("Failed to fetch profile:", error);
 *           }
 *         };
 *         loadProfile();
 *       }, []);
 *
 *       // ... render your profile
 *     }
 *     ```
 */
