// ============================================
// 1. BASE HTTP CLIENT
// ============================================
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpClient {
  private client: AxiosInstance;
  private requestInterceptors: number[] = [];
  private responseInterceptors: number[] = [];

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.requestInterceptors.push(
      this.client.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      )
    );

    // Response interceptor
    this.responseInterceptors.push(
      this.client.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401) {
            // Handle token refresh or redirect to login
            await this.handleUnauthorized();
          }
          return Promise.reject(error);
        }
      )
    );
  }

  private async handleUnauthorized() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// ============================================
// 2. API SERVICE BASE CLASS
// ============================================
abstract class BaseApiService {
  protected http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  protected handleError(error: any): never {
    if (error.response) {
      throw new ApiError(
        error.response.data.message || 'API Error',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      throw new ApiError('No response from server', 0);
    } else {
      throw new ApiError(error.message, 0);
    }
  }
}

// ============================================
// 3. CUSTOM ERROR CLASS
// ============================================
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// 4. TYPE DEFINITIONS
// ============================================
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
}

// ============================================
// 5. SPECIFIC API SERVICES
// ============================================
class UserService extends BaseApiService {
  private readonly basePath = '/users';

  async getUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    try {
      return await this.http.get<PaginatedResponse<User>>(
        `${this.basePath}?page=${page}&pageSize=${pageSize}`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return await this.http.get<User>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await this.http.post<User>(this.basePath, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await this.http.patch<User>(`${this.basePath}/${id}`, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      return await this.http.delete<void>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class AuthService extends BaseApiService {
  private readonly basePath = '/auth';

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await this.http.post<{ token: string; user: User }>(
        `${this.basePath}/login`,
        { email, password }
      );
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.http.post<void>(`${this.basePath}/logout`);
      localStorage.removeItem('authToken');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await this.http.post<{ token: string }>(`${this.basePath}/refresh`);
      localStorage.setItem('authToken', response.token);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// ============================================
// 6. API CLIENT FACTORY
// ============================================
class ApiClient {
  private http: HttpClient;
  public users: UserService;
  public auth: AuthService;

  constructor(baseURL: string) {
    this.http = new HttpClient(baseURL);
    this.users = new UserService(this.http);
    this.auth = new AuthService(this.http);
  }

  // Add more services as needed
}

// ============================================
// 7. SINGLETON INSTANCE
// ============================================
const apiClient = new ApiClient(process.env.REACT_APP_API_BASE_URL || 'https://api.example.com');

export default apiClient;

// ============================================
// 8. USAGE EXAMPLES
// ============================================

// In your React component or service:
/*
import apiClient from './api/client';

// Get users
const users = await apiClient.users.getUsers(1, 20);

// Get specific user
const user = await apiClient.users.getUserById('123');

// Create user
const newUser = await apiClient.users.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure123'
});

// Login
const { token, user } = await apiClient.auth.login('john@example.com', 'secure123');

// Error handling
try {
  const user = await apiClient.users.getUserById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message} (${error.statusCode})`);
  }
}
*/