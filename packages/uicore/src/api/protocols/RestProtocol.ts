/**
 * REST Protocol
 * Handles HTTP/REST communication using axios
 * Extracted from BaseApiService following Single Responsibility Principle
 */

import { assign, reverse } from 'lodash';
import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError } from '../services/accounts/api';
import { ApiProtocol, type MockMap, type JsonValue } from './ApiProtocol';
import type { ApiServiceConfig } from '../ApiServiceConfig';
import type { ApiPlugin, RequestConfig } from '../plugins/ApiPlugin';

/**
 * REST Protocol Configuration
 * Configuration specific to REST/HTTP protocol
 */
export interface RestProtocolConfig {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * REST Protocol Implementation
 * Manages HTTP communication using axios
 * Mocking handled by MockPlugin (composition), not embedded in protocol
 */
export class RestProtocol extends ApiProtocol {
  private baseConfig!: Readonly<ApiServiceConfig>;
  private client!: AxiosInstance;
  private readonly config: RestProtocolConfig;
  private getPlugins!: () => ReadonlyArray<ApiPlugin>;

  constructor(config: Readonly<RestProtocolConfig> = {}) {
    super();
    this.config = assign({}, config);
  }

  /**
   * Initialize protocol with base config, mock map accessor, and plugin accessor
   */
  initialize(
    baseConfig: Readonly<ApiServiceConfig>,
    _getMockMap: () => Readonly<MockMap>,
    getPlugins: () => ReadonlyArray<ApiPlugin>
  ): void {
    this.baseConfig = baseConfig;
    this.getPlugins = getPlugins;

    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseConfig.baseURL,
      timeout: this.config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Cleanup protocol resources
   */
  cleanup(): void {
    // Axios doesn't require explicit cleanup
    // But we clear the interceptors to prevent memory leaks
    if (this.client) {
      this.client.interceptors.request.clear();
      this.client.interceptors.response.clear();
    }
  }

  /**
   * Execute plugin chain onRequest hooks
   * Returns Response if any plugin short-circuits, otherwise returns modified config
   */
  private async executeOnRequest(requestConfig: RequestConfig): Promise<RequestConfig | Response> {
    let config = requestConfig;

    // Execute plugins in priority order (high to low)
    for (const plugin of this.getPlugins()) {
      if (plugin.onRequest) {
        const result = await plugin.onRequest(config);

        // If plugin returns Response, short-circuit
        if (result instanceof Response) {
          return result;
        }

        config = result;
      }
    }

    return config;
  }

  /**
   * Execute plugin chain onResponse hooks
   */
  private async executeOnResponse(response: Response): Promise<Response> {
    let currentResponse = response;

    // Execute plugins in reverse priority order (low to high) using lodash reverse
    const pluginsReversed = reverse([...this.getPlugins()]);

    for (const plugin of pluginsReversed) {
      if (plugin.onResponse) {
        currentResponse = await plugin.onResponse(currentResponse);
      }
    }

    return currentResponse;
  }

  /**
   * Execute plugin chain onError hooks
   */
  private async executeOnError(error: Error): Promise<Error | Response> {
    let currentError = error;

    // Execute plugins in reverse priority order using lodash reverse
    const pluginsReversed = reverse([...this.getPlugins()]);

    for (const plugin of pluginsReversed) {
      if (plugin.onError) {
        const result = await plugin.onError(currentError);

        // If plugin returns Response, short-circuit error handling
        if (result instanceof Response) {
          return result;
        }

        currentError = result;
      }
    }

    return currentError;
  }

  /**
   * Make GET request with plugin chain execution
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Execute onRequest plugin chain
    const requestConfig: RequestConfig = {
      url,
      method: 'GET',
      headers: config?.headers as Record<string, string> | undefined,
    };

    const result = await this.executeOnRequest(requestConfig);

    // If plugin short-circuited with Response, parse and return
    if (result instanceof Response) {
      const data = await result.json();
      return data as T;
    }

    // Make actual axios call
    try {
      const response = await this.client.get<T>(result.url, config);

      // Convert axios response to fetch Response for plugin chain
      const fetchResponse = new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as HeadersInit,
      });

      // Execute onResponse plugin chain
      const processedResponse = await this.executeOnResponse(fetchResponse);
      const processedData = await processedResponse.json();

      return processedData as T;
    } catch (error) {
      // Execute onError plugin chain
      const errorResult = await this.executeOnError(error as Error);

      // If plugin returned Response, use it
      if (errorResult instanceof Response) {
        const data = await errorResult.json();
        return data as T;
      }

      // Otherwise, throw the error
      throw errorResult;
    }
  }

  /**
   * Make POST request with plugin chain execution
   */
  async post<TResponse, TRequest = JsonValue>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    // Execute onRequest plugin chain
    const requestConfig: RequestConfig = {
      url,
      method: 'POST',
      data,
      headers: config?.headers as Record<string, string> | undefined,
    };

    const result = await this.executeOnRequest(requestConfig);

    // If plugin short-circuited with Response, parse and return
    if (result instanceof Response) {
      const responseData = await result.json();
      return responseData as TResponse;
    }

    // Make actual axios call
    try {
      const response = await this.client.post<TResponse>(result.url, result.data, config);

      // Convert axios response to fetch Response for plugin chain
      const fetchResponse = new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as HeadersInit,
      });

      // Execute onResponse plugin chain
      const processedResponse = await this.executeOnResponse(fetchResponse);
      const processedData = await processedResponse.json();

      return processedData as TResponse;
    } catch (error) {
      // Execute onError plugin chain
      const errorResult = await this.executeOnError(error as Error);

      // If plugin returned Response, use it
      if (errorResult instanceof Response) {
        const responseData = await errorResult.json();
        return responseData as TResponse;
      }

      // Otherwise, throw the error
      throw errorResult;
    }
  }

  /**
   * Make PUT request with plugin chain execution
   */
  async put<TResponse, TRequest = JsonValue>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const requestConfig: RequestConfig = {
      url,
      method: 'PUT',
      data,
      headers: config?.headers as Record<string, string> | undefined,
    };

    const result = await this.executeOnRequest(requestConfig);

    if (result instanceof Response) {
      const responseData = await result.json();
      return responseData as TResponse;
    }

    try {
      const response = await this.client.put<TResponse>(result.url, result.data, config);
      const fetchResponse = new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as HeadersInit,
      });

      const processedResponse = await this.executeOnResponse(fetchResponse);
      const processedData = await processedResponse.json();
      return processedData as TResponse;
    } catch (error) {
      const errorResult = await this.executeOnError(error as Error);

      if (errorResult instanceof Response) {
        const responseData = await errorResult.json();
        return responseData as TResponse;
      }

      throw errorResult;
    }
  }

  /**
   * Make PATCH request with plugin chain execution
   */
  async patch<TResponse, TRequest = JsonValue>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const requestConfig: RequestConfig = {
      url,
      method: 'PATCH',
      data,
      headers: config?.headers as Record<string, string> | undefined,
    };

    const result = await this.executeOnRequest(requestConfig);

    if (result instanceof Response) {
      const responseData = await result.json();
      return responseData as TResponse;
    }

    try {
      const response = await this.client.patch<TResponse>(result.url, result.data, config);
      const fetchResponse = new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as HeadersInit,
      });

      const processedResponse = await this.executeOnResponse(fetchResponse);
      const processedData = await processedResponse.json();
      return processedData as TResponse;
    } catch (error) {
      const errorResult = await this.executeOnError(error as Error);

      if (errorResult instanceof Response) {
        const responseData = await errorResult.json();
        return responseData as TResponse;
      }

      throw errorResult;
    }
  }

  /**
   * Make DELETE request with plugin chain execution
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const requestConfig: RequestConfig = {
      url,
      method: 'DELETE',
      headers: config?.headers as Record<string, string> | undefined,
    };

    const result = await this.executeOnRequest(requestConfig);

    if (result instanceof Response) {
      const data = await result.json();
      return data as T;
    }

    try {
      const response = await this.client.delete<T>(result.url, config);
      const fetchResponse = new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as HeadersInit,
      });

      const processedResponse = await this.executeOnResponse(fetchResponse);
      const processedData = await processedResponse.json();
      return processedData as T;
    } catch (error) {
      const errorResult = await this.executeOnError(error as Error);

      if (errorResult instanceof Response) {
        const data = await errorResult.json();
        return data as T;
      }

      throw errorResult;
    }
  }

  /**
   * Setup axios interceptors for auth and error handling
   * Mocking handled by MockPlugin, not here
   */
  private setupInterceptors(): void {
    // Request interceptor (for auth tokens)
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (for error handling)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
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
   * Can be customized by passing token via headers config
   */
  private getAuthToken(): string | null {
    // TODO: Implement token storage (localStorage, sessionStorage, cookie, etc.)
    return null;
  }
}
