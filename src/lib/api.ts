const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  // This is not an error in dev because we use a relative path for the proxy.
  // In production, this variable should be set.
  console.warn("NEXT_PUBLIC_API_BASE_URL não configurado. Usando caminhos relativos.");
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

  // Use API_BASE for production, but allow relative path for dev proxy
  const url = API_BASE ? `${API_BASE}${path}` : path;

  const res = await fetch(url, {
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
