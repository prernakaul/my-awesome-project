import {
  UserPreferences,
  TripHistory,
  RedisPreferencesResponse,
  RedisUpdateResponse,
  RedisHistoryResponse
} from '../types';

// Use environment variable for production, fallback to local proxy for development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_BASE_URL = `${BACKEND_URL}/api/redis`;

class RedisApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  async getPreferences(userId: string): Promise<{ exists: boolean; data: UserPreferences | null }> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/preferences/${userId}`);

      if (!response.ok) {
        console.warn('Failed to fetch preferences:', response.status);
        return { exists: false, data: null };
      }

      const result: RedisPreferencesResponse = await response.json();
      return result;
    } catch (error) {
      console.warn('Error fetching preferences (Redis may be unavailable):', error);
      return { exists: false, data: null };
    }
  }

  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<RedisUpdateResponse> {
    try {
      console.log('Saving preferences for user:', userId, preferences);
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/preferences/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      const result: RedisUpdateResponse = await response.json();
      console.log('Save result:', result);
      return result;
    } catch (error) {
      console.warn('Error updating preferences:', error);
      return {
        success: false,
        message: 'Failed to update preferences - network error',
        error: String(error)
      };
    }
  }

  async getHistory(userId: string): Promise<TripHistory[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/history/${userId}`);

      if (!response.ok) {
        console.warn('Failed to fetch history:', response.status);
        return [];
      }

      const result: RedisHistoryResponse = await response.json();
      return result.data;
    } catch (error) {
      console.warn('Error fetching history:', error);
      return [];
    }
  }

  async addToHistory(userId: string, trip: TripHistory): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/history/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trip)
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.warn('Error adding to history:', error);
      return false;
    }
  }

  async getAllPreferences(): Promise<{ count: number; data: Array<{ userId: string; name?: string; preferences: UserPreferences }> }> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/preferences`);

      if (!response.ok) {
        console.warn('Failed to fetch all preferences:', response.status);
        return { count: 0, data: [] };
      }

      return await response.json();
    } catch (error) {
      console.warn('Error fetching all preferences:', error);
      return { count: 0, data: [] };
    }
  }

  async checkHealth(): Promise<{ status: string; redis: string }> {
    try {
      const response = await this.fetchWithTimeout(`${BACKEND_URL}/api/health`, {}, 3000);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'error', redis: 'unknown' };
    } catch (error) {
      return { status: 'unreachable', redis: 'unknown' };
    }
  }
}

export const redisApiService = new RedisApiService();
