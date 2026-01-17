/**
 * @fileoverview This file contains utility functions for making API calls to your Go backend.
 * It provides a standardized way to handle API requests from the Next.js application.
 */

/**
 * A generic and reusable function to make API requests to your Go backend.
 * It always makes relative API calls (e.g., '/api/v1/...') which is the correct
 * approach for an application deployed to Firebase Hosting with rewrites to a backend function.
 *
 * @template T The expected type of the data in the successful response.
 * @param endpoint The specific API endpoint to call (e.g., '/api/v1/auth/login').
 * @param options The standard options for the `fetch` request (e.g., method, body).
 * @returns A promise that resolves to the JSON data of type T from the backend.
 * @throws An error if the network request fails or if the API returns a non-ok status.
 */
export async function fetchFromGoBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // The URL is always relative. This allows Firebase Hosting (both in production and local emulation)
  // to rewrite the request to the correct backend Go function based on firebase.json rules.
  const url = endpoint;

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
