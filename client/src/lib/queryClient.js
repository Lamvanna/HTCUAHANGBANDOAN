import { QueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "./config.js";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || res.statusText;
    } catch {
      errorMessage = await res.text() || res.statusText;
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(method, url, data) {
  const token = localStorage.getItem('authToken');

  // Build full API URL if it's a relative URL
  const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);

  console.log('API Request:', method, fullUrl);
  console.log('Token from localStorage:', token ? 'Present' : 'Missing');

  const headers = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  console.log('Request headers:', headers);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);

  // Return JSON response for successful requests
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }

  return res;
}

export const getQueryFn = ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };

    // Build full API URL for query
    const endpoint = queryKey.join("/");
    const fullUrl = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);

    const res = await fetch(fullUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
