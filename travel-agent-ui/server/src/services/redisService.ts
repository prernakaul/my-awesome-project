import { createClient, RedisClientType } from 'redis';

export interface UserPreferences {
  name?: string;
  tripDuration?: string;
  travelTimeline?: string;
  preferredMonth?: string;
  travelerCount?: string;
  travelerAges?: string;
  travelerRelationships?: string;
  budgetMin?: string;
  budgetMax?: string;
  budgetCurrency?: string;
  travelStyle?: string;
  accommodationType?: string;
  citizenship?: string;
  passportExpiry?: string;
  visaRestrictions?: string;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  mobilityLevel?: string;
  preferredActivities?: string;
  avoidActivities?: string;
  lastUpdated?: string;
}

export interface TripHistory {
  destination: string;
  startDate: string;
  endDate: string;
  rating?: number;
  notes?: string;
}

class RedisService {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  async connect(): Promise<boolean> {
    try {
      const redisUrl = process.env.REDIS_URL ||
        `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

      this.client = createClient({
        url: redisUrl,
        socket: {
          tls: true,
          rejectUnauthorized: false
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Redis disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.isConnected = false;
      return false;
    }
  }

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  private getPreferencesKey(userId: string): string {
    return `travel:user:${userId}:preferences`;
  }

  private getHistoryKey(userId: string): string {
    return `travel:user:${userId}:history`;
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    if (!this.isReady() || !this.client) {
      console.warn('Redis not available, returning null preferences');
      return null;
    }

    try {
      const key = this.getPreferencesKey(userId);
      const data = await this.client.hGetAll(key);

      if (Object.keys(data).length === 0) {
        return null;
      }

      return data as UserPreferences;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    if (!this.isReady() || !this.client) {
      console.warn('Redis not available, cannot save preferences');
      return false;
    }

    try {
      const key = this.getPreferencesKey(userId);
      const dataToSave: Record<string, string> = {
        ...Object.fromEntries(
          Object.entries(preferences)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
        ),
        lastUpdated: new Date().toISOString()
      };

      await this.client.hSet(key, dataToSave);
      console.log(`Updated preferences for user ${userId}:`, Object.keys(dataToSave));
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  async getAllPreferences(): Promise<Array<{ userId: string; name?: string; preferences: UserPreferences }>> {
    if (!this.isReady() || !this.client) {
      console.warn('Redis not available, returning empty list');
      return [];
    }

    try {
      // Use KEYS to find all preference keys (fine for small datasets)
      const keys = await this.client.keys('travel:user:*:preferences');
      console.log('Found preference keys:', keys);

      const results: Array<{ userId: string; name?: string; preferences: UserPreferences }> = [];

      for (const key of keys) {
        const data = await this.client.hGetAll(key);
        if (Object.keys(data).length > 0) {
          // Extract userId from key: travel:user:{userId}:preferences
          const userId = key.split(':')[2];
          results.push({
            userId,
            name: data.name,
            preferences: data as UserPreferences
          });
        }
      }

      console.log('Total users found:', results.length);
      return results;
    } catch (error) {
      console.error('Error getting all preferences:', error);
      return [];
    }
  }

  async getHistory(userId: string): Promise<TripHistory[]> {
    if (!this.isReady() || !this.client) {
      console.warn('Redis not available, returning empty history');
      return [];
    }

    try {
      const key = this.getHistoryKey(userId);
      const data = await this.client.lRange(key, 0, -1);
      return data.map(item => JSON.parse(item) as TripHistory);
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  async addToHistory(userId: string, trip: TripHistory): Promise<boolean> {
    if (!this.isReady() || !this.client) {
      console.warn('Redis not available, cannot add to history');
      return false;
    }

    try {
      const key = this.getHistoryKey(userId);
      await this.client.lPush(key, JSON.stringify(trip));
      console.log(`Added trip to history for user ${userId}:`, trip.destination);
      return true;
    } catch (error) {
      console.error('Error adding to history:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

export const redisService = new RedisService();
