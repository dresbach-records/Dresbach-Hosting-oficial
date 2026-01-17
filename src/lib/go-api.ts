/**
 * @fileoverview This file contains utility functions for making API calls to your Go backend.
 * It provides a standardized way to handle API requests from the Next.js application.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL não configurado. Verifique seu arquivo .env.");
}

/**
 * A generic and reusable function to make API requests to your Go backend using an absolute URL.
 *
 * @template T The expected type of the data in the successful response.
 * @param path The specific API path to call (e.g., '/auth/login'). The base URL is prepended automatically.
 * @param options The standard options for the `fetch` request (e.g., method, body).
 * @returns A promise that resolves to the JSON data of type T from the backend.
 * @throws An error if the network request fails or if the API returns a non-ok status.
 */
export async function fetchFromGoBackend<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // Send cookies with requests
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    // Try to get a better error message from JSON
    try {
        const json = JSON.parse(text);
        if (json.error) {
            throw new Error(json.error);
        }
         if (json.message) {
            throw new Error(json.message);
        }
    } catch(e) {
        // Not a JSON error, fall through to throw the raw text
    }
    throw new Error(`Request failed with status ${res.status}: ${text || res.statusText}`);
  }
  
  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
