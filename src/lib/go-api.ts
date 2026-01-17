/**
 * @fileoverview This file contains utility functions for making API calls to your Go backend.
 * It provides a standardized way to handle API requests from the Next.js application.
 */

// By default, use a relative path. This allows Firebase Hosting to handle rewriting
// the URL to the correct Go backend function, both in local emulation and in production.
const GO_BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL || '';

/**
 * A generic and reusable function to make API requests to your Go backend.
 * It handles setting JSON headers, and basic success/error responses.
 * It also includes credentials to ensure cookies are sent for session-based authentication.
 *
 * @template T The expected type of the data in the successful response.
 * @param endpoint The specific API endpoint to call (e.g., '/api/v1/auth/login').
 * @param options The standard options for the `fetch` request (e.g., method, body).
 * @returns A promise that resolves to the JSON data of type T from the backend.
 * @throws An error if the network request fails or if the API returns a non-ok status.
 */
export async function fetchFromGoBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If GO_BACKEND_URL is a full URL, it will be used. If it's an empty string,
  // the endpoint (e.g., /api/v1/...) will be treated as a relative path by fetch().
  const url = GO_BACKEND_URL ? `${GO_BACKEND_URL}${endpoint}` : endpoint;

  const response = await fetch(url, {
    credentials: 'include', // ESSENCIAL: Envia cookies em requisições
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Attempt to parse a more specific error message from the backend response body
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      // Tenta extrair a mensagem de erro do corpo da resposta JSON
      const errorBody = await response.json();
      if (errorBody.error) {
        errorMessage = errorBody.error;
      } else if (errorBody.message) {
        errorMessage = errorBody.message;
      }
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
 * This setup is designed for use with Firebase Hosting rewrites.
 *
 * 1.  **Firebase Configuration:**
 *     Ensure your `firebase.json` has a rewrite rule that directs API calls to your Go backend function.
 *     For example:
 *     "rewrites": [
 *       {
 *         "source": "/api/**",
 *         "function": "api"
 *       }
 *     ]
 *
 * 2.  **Use in a component or Server Action:**
 *     Import the function and call it with a relative path. Firebase Hosting will handle the rest.
 *
 *     ```jsx
 *     import { fetchFromGoBackend } from '@/lib/go-api';
 *
 *     async function someAction() {
 *       try {
 *         // The cookie will be sent automatically. The path is relative to the host.
 *         const data = await fetchFromGoBackend('/api/v1/user/profile');
 *         console.log(data);
 *       } catch (error) {
 *         console.error("Failed to fetch profile:", error);
 *       }
 *     }
 *     ```
 */
