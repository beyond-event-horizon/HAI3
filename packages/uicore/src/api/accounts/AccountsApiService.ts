/**
 * Accounts Domain - API Service
 * Service for accounts domain (users, tenants, authentication, permissions)
 * Reflects backend microservice/bounded context architecture
 * 
 * Vertical Slice: This folder contains everything for the accounts domain:
 * - AccountsApiService.ts (this file)
 * - api.ts (types)
 */

import { BaseApiService, type BaseApiServiceConfig } from '../BaseApiService';
import type { GetCurrentUserResponse } from './api';

/**
 * Accounts domain identifier
 * Per GUIDELINES.md: Define constants where used, not in central file
 */
export const ACCOUNTS_DOMAIN = 'accounts' as const;

/**
 * Accounts API Service
 * Manages accounts domain endpoints:
 * - User management (current user, profile, preferences)
 * - Tenant management (current tenant, switching)
 * - Authentication (login, logout, tokens)
 * - Permissions and roles
 */
export class AccountsApiService extends BaseApiService {
  constructor(config: Omit<BaseApiServiceConfig, 'baseURL'>) {
    super({
      ...config,
      baseURL: '/api/accounts',
    });
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    return this.get<GetCurrentUserResponse>('/user/current');
  }

  // Future methods for accounts domain:
  // async getCurrentTenant(): Promise<GetCurrentTenantResponse>
  // async updateUserProfile(data: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse>
  // async switchTenant(tenantId: string): Promise<SwitchTenantResponse>
  // async inviteUser(email: string): Promise<InviteUserResponse>
}

// Register service type in ApiServicesMap via module augmentation
declare module '../apiRegistry' {
  interface ApiServicesMap {
    [ACCOUNTS_DOMAIN]: AccountsApiService;
  }
}

// Self-register with API registry
import { apiRegistry } from '../apiRegistry';
apiRegistry.register(ACCOUNTS_DOMAIN, AccountsApiService);
