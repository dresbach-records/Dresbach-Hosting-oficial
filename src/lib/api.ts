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
        const text = await res.text();
        throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
    }
    const errorMessage = errorBody.message || errorBody.error || `A API retornou um erro ${res.status}`;
    throw new Error(errorMessage);
  }
  
  if (res.status === 204 || res.headers.get('Content-Length') === '0') {
    return {} as T;
  }

  try {
    return await res.json();
  } catch (e) {
    // Handle cases where the response is not JSON, but the status is OK.
    return {} as T;
  }
}
