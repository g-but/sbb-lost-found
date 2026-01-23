/**
 * API Client for SBB Lost & Found Backend
 */

import { config } from './config';
import type {
  ApiResponse,
  LostItem,
  LostItemFormData,
  Trip,
  Notification,
} from './types';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        return { success: false, error: error.error || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error occurred' };
    }
  }

  // ============================================================================
  // Lost Items
  // ============================================================================

  async reportLostItem(data: LostItemFormData): Promise<ApiResponse<LostItem>> {
    return this.request<LostItem>('/api/lost-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLostItem(id: string): Promise<ApiResponse<LostItem>> {
    return this.request<LostItem>(`/api/lost-items/${id}`);
  }

  async getUserLostItems(userId: string): Promise<ApiResponse<LostItem[]>> {
    return this.request<LostItem[]>(`/api/lost-items?userId=${userId}`);
  }

  async updateLostItemStatus(
    id: string,
    status: string,
    message?: string
  ): Promise<ApiResponse<LostItem>> {
    return this.request<LostItem>(`/api/lost-items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, message }),
    });
  }

  // ============================================================================
  // Trips
  // ============================================================================

  async getRecentTrips(userId: string): Promise<ApiResponse<Trip[]>> {
    return this.request<Trip[]>(`/api/trips?userId=${userId}&status=completed&limit=10`);
  }

  async getCurrentTrip(userId: string): Promise<ApiResponse<Trip | null>> {
    return this.request<Trip | null>(`/api/trips/current?userId=${userId}`);
  }

  // ============================================================================
  // Notifications
  // ============================================================================

  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    return this.request<Notification[]>(`/api/notifications?userId=${userId}`);
  }

  async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // ============================================================================
  // Health Check
  // ============================================================================

  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }
}

export const api = new ApiClient();
