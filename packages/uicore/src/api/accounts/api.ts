/**
 * Accounts Domain - API Types
 * Type definitions for accounts service endpoints
 * (users, tenants, authentication, permissions)
 * 
 * NOTE: These types are used for backend generation
 * Keep them clean, typed, and well-documented
 */

/**
 * User Extra Properties
 * Applications extend this via module augmentation for platform-specific fields
 */
export interface UserExtra {
  // Applications add their types via module augmentation
  // Empty by default
}

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
  extra?: UserExtra;
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
