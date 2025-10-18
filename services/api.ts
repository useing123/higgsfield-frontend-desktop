const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://platform.higgsfield.ai";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

class HttpClient {
  private baseURL: string;
  private baseHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.baseHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "hf-api-key": API_KEY || "",
      "hf-secret": API_SECRET || "",
    };
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.baseHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(errorData.message || "Request failed", response.status, errorData);
    }

    // Handle cases where the response body might be empty
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return undefined as T;
  }

  async get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  async post<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "POST", body: JSON.stringify(data) });
  }

  async put<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "PUT", body: JSON.stringify(data) });
  }

  async patch<T>(url: string, data?: any, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "PATCH", body: JSON.stringify(data) });
  }

  async delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export abstract class BaseApiService {
  protected http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  protected handleError(error: any): never {
    if (error.response) {
      throw new ApiError(
        error.response.data.message || "API Error",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      throw new ApiError("No response from server", 0);
    } else {
      throw new ApiError(error.message, 0);
    }
  }
}

export const httpClient = new HttpClient(API_BASE_URL);