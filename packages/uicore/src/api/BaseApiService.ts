/**
 * Base API Service
 * Abstract base class for service-specific API clients
 * Follows SOLID principles:
 * - Single Responsibility: HTTP communication and interceptor management
 * - Open/Closed: Open for extension via derived classes, closed for modification
 * - Liskov Substitution: Derived services are substitutable
 * - Dependency Inversion: Depends on abstract getMockMap(), not concrete implementations
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError } from './accounts/api';

/**
 * Base API Service Configuration
 */
export interface BaseApiServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  useMockApi?: boolean;
  mockDelay?: number;
  mockMap?: Readonly<Record<string, any>>;
}

/**
 * Abstract Base API Service
 * Template for creating service-specific API clients
 */
export abstract class BaseApiService {
  protected client: AxiosInstance;
  protected config: BaseApiServiceConfig;

  constructor(config: BaseApiServiceConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get mock response map
   * Returns mockMap from config if provided, otherwise empty
   * Apps provide mocks via config, not hardcoded in services
   */
  protected getMockMap(): Record<string, unknown> {
    return this.config.mockMap ?? {};
  }

  /**
   * Make GET request
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make POST request
   */
  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make PUT request
   */
  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make PATCH request
   */
  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make DELETE request
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<BaseApiServiceConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Setup axios interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor (for auth tokens, logging, mocks)
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Handle mock API
        if (this.config.useMockApi) {
          const mockResponse = this.getMockResponse(config.url, config.method);
          if (mockResponse) {
            await this.simulateDelay();
            // Return rejected promise that will be caught by response interceptor
            return Promise.reject({
              config,
              response: {
                data: mockResponse,
                status: 200,
                statusText: 'OK (MOCKED)',
                headers: {},
                config,
              },
              isAxiosError: false,
              _isMocked: true,
            });
          }
        }

        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (for error handling, logging)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError> & { _isMocked?: boolean }) => {
        // Handle mocked responses
        if (error._isMocked && error.response) {
          return Promise.resolve(error.response);
        }

        // Transform axios error to ApiError
        const apiError: ApiError = {
          code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.message || error.message || 'An unknown error occurred',
          details: error.response?.data?.details,
        };
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Get auth token from storage
   * Can be overridden by derived classes for custom token retrieval
   */
  protected getAuthToken(): string | null {
    // TODO: Implement token storage (localStorage, sessionStorage, cookie, etc.)
    return null;
  }

  /**
   * Get mock response for endpoint
   */
  private getMockResponse(url: string | undefined, method: string | undefined): unknown {
    if (!url || !method) return null;

    const key = `${method.toUpperCase()} ${url}`;
    const mockMap = this.getMockMap();
    return mockMap[key] || null;
  }

  /**
   * Simulate network delay for mocks
   */
  private async simulateDelay(): Promise<void> {
    const delay = this.config.mockDelay ?? 500;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
