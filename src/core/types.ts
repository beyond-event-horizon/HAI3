/**
 * Core types for HAI3 Redux store
 * Following the Flux pattern with shared and private state
 */

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}
