/**
 * Accounts Domain - API Types
 * Type definitions for accounts service endpoints
 * (users, tenants, authentication, permissions)
 * 
 * NOTE: These types are used for backend generation
 * Keep them clean, typed, and well-documented
 */

/**
 * User entity from API
 */
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User roles
 */
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

/**
 * Get current user response
 */
export interface GetCurrentUserResponse {
  user: ApiUser;
}

/**
 * API error response (shared across all domains)
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
