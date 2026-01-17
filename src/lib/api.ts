const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL não configurado. Verifique seu arquivo .env.local");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorBody;
    try {
        errorBody = await res.json();
    } catch (e) {
        errorBody = { message: await res.text() };
    }
    const errorMessage = errorBody.message || `A API retornou um erro ${res.status}`;
    throw new Error(errorMessage);
  }
  
  // Handle empty responses for methods like POST/DELETE that might return 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
