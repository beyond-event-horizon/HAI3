/**
 * Accounts Domain - Mock Data
 * Mock data for accounts service (users, tenants, authentication)
 */

import { UserRole } from './api';
import type { ApiUser } from './api';

/**
 * Mock user - Demo user
 */
export const mockDemoUser: ApiUser = {
  id: 'mock-user-001',
  email: 'demo@hai3.org',
  firstName: 'Demo',
  lastName: 'User',
  role: UserRole.Admin,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
  createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date('2024-12-01T00:00:00Z').toISOString(),
};
