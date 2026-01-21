/**
 * ApiClient - Camada de Comunicação
 * Centraliza chamadas HTTP e gerencia interceptors, tokens e erros.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseUrl: string = process.env.REACT_APP_API_URL || 'mock';

  private async request<T>(method: string, path: string, body?: any): Promise<ApiResponse<T>> {
    console.log(`[API ${method}] ${path}`, body || '');

    // Se estiver em modo mock, simula resposta
    if (this.baseUrl === 'mock') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: body || ({} as T),
            status: 200,
            message: 'Success (Mock Mode)'
          });
        }, 300);
      });
    }

    // Aqui entraria a implementação real com fetch ou axios
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('ploutos_token')}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return {
      data,
      status: response.status,
      message: data.message
    };
  }

  public get<T>(path: string) { return this.request<T>('GET', path); }
  public post<T>(path: string, body: any) { return this.request<T>('POST', path, body); }
  public put<T>(path: string, body: any) { return this.request<T>('PUT', path, body); }
  public delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const apiClient = new ApiClient();
