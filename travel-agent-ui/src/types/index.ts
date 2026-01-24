// User Preferences
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

// Trip History
export interface TripHistory {
  destination: string;
  startDate: string;
  endDate: string;
  rating?: number;
  notes?: string;
}

// Weather
export interface WeatherForecast {
  tempHigh: number;
  tempLow: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  precipitation: number;
  humidity: number;
  description: string;
}

export type WeatherRegion =
  | 'southwest'
  | 'pacific_northwest'
  | 'mountain'
  | 'midwest'
  | 'northeast'
  | 'southeast'
  | 'plains'
  | 'california';

// Destinations
export interface Destination {
  id: string;
  city: string;
  state: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  estimatedCost: {
    low: number;
    high: number;
  };
  weather?: WeatherForecast;
  imageUrl?: string;
}

// Itinerary
export interface Activity {
  time: string;
  name: string;
  description: string;
  duration: string;
  cost?: number;
  location?: string;
  tips?: string;
  accessibility?: string;
  imageUrl?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  title: string;
  weather?: WeatherForecast;
  activities: Activity[];
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  notes?: string;
}

export interface Itinerary {
  destination: Destination;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: {
    low: number;
    high: number;
  };
  days: DayPlan[];
  packingList?: string[];
  travelTips?: string[];
}

// Chat
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    phase?: AppPhase;
    destinations?: Destination[];
    itinerary?: Itinerary;
    preferencesUpdated?: string[];
  };
}

// App State
export type AppPhase =
  | 'onboarding'
  | 'destination_selection'
  | 'itinerary'
  | 'corrections'
  | 'chat';

export interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'date';
  options?: string[];
  placeholder?: string;
  preferenceKey: keyof UserPreferences;
  required?: boolean;
}

// API Responses
export interface RedisPreferencesResponse {
  exists: boolean;
  data: UserPreferences | null;
}

export interface RedisUpdateResponse {
  success: boolean;
  message: string;
  updatedFields?: string[];
  data?: UserPreferences;
  error?: string;
}

export interface RedisHistoryResponse {
  data: TripHistory[];
}

// Claude API
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeApiResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  stop_reason: string;
}
