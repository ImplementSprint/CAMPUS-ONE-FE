const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'

type RequestConfig = RequestInit & {
  authToken?: string
}

export async function apiRequest<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { authToken, headers, ...restConfig } = config

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restConfig,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Request failed')
  }

  return response.json() as Promise<T>
}
