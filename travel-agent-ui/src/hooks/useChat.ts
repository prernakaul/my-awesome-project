import { useState, useCallback, useRef } from 'react';
import { Message, ClaudeMessage, UserPreferences, Destination } from '../types';
import { claudeApiService } from '../services/claudeApi';
import { redisApiService } from '../services/redisApi';

interface UseChatOptions {
  userId: string;
  preferences: UserPreferences | null;
  onPreferencesUpdate?: (updates: Record<string, string>) => void;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  destinations: Destination[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

// Mapping of keywords to preference field names
const PREFERENCE_KEYWORDS: Record<string, keyof UserPreferences> = {
  'name': 'name',
  'my name': 'name',
  'trip duration': 'tripDuration',
  'duration': 'tripDuration',
  'how long': 'tripDuration',
  'travel timeline': 'travelTimeline',
  'timeline': 'travelTimeline',
  'when': 'travelTimeline',
  'month': 'preferredMonth',
  'preferred month': 'preferredMonth',
  'traveler count': 'travelerCount',
  'travelers': 'travelerCount',
  'how many people': 'travelerCount',
  'traveling with': 'travelerRelationships',
  'travel with': 'travelerRelationships',
  'who': 'travelerRelationships',
  'budget': 'budgetMax',
  'budget max': 'budgetMax',
  'budget min': 'budgetMin',
  'travel style': 'travelStyle',
  'style': 'travelStyle',
  'accommodation': 'accommodationType',
  'hotel': 'accommodationType',
  'stay': 'accommodationType',
  'dietary': 'dietaryRequirements',
  'diet': 'dietaryRequirements',
  'food restrictions': 'dietaryRequirements',
  'vegetarian': 'dietaryRequirements',
  'vegan': 'dietaryRequirements',
  'accessibility': 'accessibilityNeeds',
  'mobility': 'mobilityLevel',
  'activities': 'preferredActivities',
  'preferred activities': 'preferredActivities',
  'avoid': 'avoidActivities',
  'avoid activities': 'avoidActivities',
};

export function useChat({ userId, preferences, onPreferencesUpdate }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Use refs to avoid stale closure issues
  const messagesRef = useRef<Message[]>([]);
  const preferencesRef = useRef<UserPreferences | null>(null);

  // Keep refs in sync with state
  messagesRef.current = messages;
  preferencesRef.current = preferences;

  const formatPreferencesDebug = (prefs: UserPreferences | null, identifiedUserId: string): string => {
    if (!prefs || Object.keys(prefs).length === 0) {
      return `**No preferences found for user: ${identifiedUserId}**\n\nPlease complete the onboarding flow to set your preferences.`;
    }

    const lines = [
      `**Your Stored Preferences**`,
      ``,
      `| Key | Value |`,
      `|-----|-------|`
    ];

    const fieldLabels: Record<string, string> = {
      name: 'Name',
      tripDuration: 'Trip Duration',
      travelTimeline: 'Travel Timeline',
      preferredMonth: 'Preferred Month',
      travelerCount: 'Traveler Count',
      travelerAges: 'Traveler Ages',
      travelerRelationships: 'Traveling With',
      budgetMin: 'Budget Min ($)',
      budgetMax: 'Budget Max ($)',
      budgetCurrency: 'Currency',
      travelStyle: 'Travel Style',
      accommodationType: 'Accommodation',
      citizenship: 'Citizenship',
      passportExpiry: 'Passport Expiry',
      visaRestrictions: 'Visa Restrictions',
      dietaryRequirements: 'Dietary Requirements',
      accessibilityNeeds: 'Accessibility Needs',
      mobilityLevel: 'Mobility Level',
      preferredActivities: 'Preferred Activities',
      avoidActivities: 'Avoid Activities',
      lastUpdated: 'Last Updated'
    };

    Object.entries(prefs).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const label = fieldLabels[key] || key;
        lines.push(`| ${label} | ${value} |`);
      }
    });

    lines.push(``);
    lines.push(`**User ID:** \`${identifiedUserId}\``);
    lines.push(``);
    lines.push(`_This data is stored in Redis._`);

    return lines.join('\n');
  };

  const parseUpdateRequest = (content: string): { field: keyof UserPreferences; value: string } | null => {
    const lowerContent = content.toLowerCase();

    let matchedField: keyof UserPreferences | null = null;
    let matchedKeyword = '';

    for (const [keyword, field] of Object.entries(PREFERENCE_KEYWORDS)) {
      if (lowerContent.includes(keyword)) {
        if (keyword.length > matchedKeyword.length) {
          matchedField = field;
          matchedKeyword = keyword;
        }
      }
    }

    if (!matchedField) {
      return null;
    }

    let value = '';

    const toMatch = content.match(/(?:to|to be|should be|want|like|prefer)\s+["']?([^"'\n.]+)["']?/i);
    if (toMatch) {
      value = toMatch[1].trim();
    }

    const changeMatch = content.match(/(?:change|update|set)\s+.*?(?:to|as)\s+["']?([^"'\n.]+)["']?/i);
    if (changeMatch && changeMatch[1].length > value.length) {
      value = changeMatch[1].trim();
    }

    const insteadMatch = content.match(/["']?([^"'\n,]+)["']?\s+instead\s+of/i);
    if (insteadMatch && insteadMatch[1].length > value.length) {
      value = insteadMatch[1].trim();
    }

    const iAmMatch = content.match(/i(?:'m| am)\s+(?:a\s+)?["']?([^"'\n.]+)["']?/i);
    if (iAmMatch && !value) {
      value = iAmMatch[1].trim();
    }

    const myIsMatch = content.match(/my\s+\w+\s+(?:is|are)\s+["']?([^"'\n.]+)["']?/i);
    if (myIsMatch && !value) {
      value = myIsMatch[1].trim();
    }

    value = value
      .replace(/^(now|actually|really)\s+/i, '')
      .replace(/\s+please$/i, '')
      .replace(/\s+thanks?$/i, '')
      .trim();

    if (!value) {
      return null;
    }

    return { field: matchedField, value };
  };

  const sendMessage = useCallback(async (content: string) => {
    console.log('sendMessage called with:', content);
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const lowerContent = content.toLowerCase().trim();

    // Clear destinations when user selects a trip (to maintain conversation flow)
    if (lowerContent.includes("i'd like to plan a trip") || lowerContent.includes('itinerary')) {
      setDestinations([]);
    }

    // Check for show ALL stored preferences command (must check before individual preferences)
    const isShowAllPreferencesCommand =
        lowerContent.includes('all stored') ||
        lowerContent.includes('all redis preferences') ||
        lowerContent.includes('all users') ||
        lowerContent.includes('all preferences stored') ||
        lowerContent.includes('show all preferences');

    if (isShowAllPreferencesCommand) {
      const allPrefs = await redisApiService.getAllPreferences();
      let responseContent: string;

      if (allPrefs.count === 0) {
        responseContent = `**No preferences stored in Redis**\n\nThe Redis cache is empty or unavailable.`;
      } else {
        const lines = [
          `**All Stored Redis Preferences**`,
          ``,
          `Found **${allPrefs.count}** user(s) with stored preferences:`,
          ``
        ];

        allPrefs.data.forEach((user) => {
          lines.push(`---`);
          lines.push(`### ${user.name || 'Unknown'} (${user.userId})`);
          lines.push(``);
          lines.push(`| Field | Value |`);
          lines.push(`|-------|-------|`);

          const fieldLabels: Record<string, string> = {
            name: 'Name',
            tripDuration: 'Trip Duration',
            travelTimeline: 'Travel Timeline',
            preferredMonth: 'Preferred Month',
            travelerCount: 'Traveler Count',
            travelerAges: 'Traveler Ages',
            travelerRelationships: 'Traveling With',
            budgetMin: 'Budget Min ($)',
            budgetMax: 'Budget Max ($)',
            budgetCurrency: 'Currency',
            travelStyle: 'Travel Style',
            accommodationType: 'Accommodation',
            dietaryRequirements: 'Dietary Requirements',
            accessibilityNeeds: 'Accessibility Needs',
            mobilityLevel: 'Mobility Level',
            preferredActivities: 'Preferred Activities',
            avoidActivities: 'Avoid Activities',
            lastUpdated: 'Last Updated'
          };

          Object.entries(user.preferences).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              const label = fieldLabels[key] || key;
              lines.push(`| ${label} | ${value} |`);
            }
          });

          lines.push(``);
        });

        responseContent = lines.join('\n');
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    // Check for show MY preferences command
    const isShowPreferencesCommand =
        lowerContent.includes('tell me my preferences') ||
        lowerContent.includes('show my preferences') ||
        lowerContent.includes('show preferences') ||
        lowerContent.includes('show me my preferences') ||
        lowerContent.includes('view my preferences') ||
        lowerContent.includes('list my preferences') ||
        lowerContent.includes('what are my preferences') ||
        lowerContent.includes('redis preferences') ||
        lowerContent.includes('my redis') ||
        lowerContent.includes('debug preferences') ||
        lowerContent === 'preferences' ||
        lowerContent === 'my preferences';

    if (isShowPreferencesCommand) {
      const freshPrefs = await redisApiService.getPreferences(userId);
      console.log('Fresh prefs from Redis:', freshPrefs);
      const prefsToShow = freshPrefs.exists && freshPrefs.data ? freshPrefs.data : preferencesRef.current;
      const debugResponse = formatPreferencesDebug(prefsToShow, userId);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: debugResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    // Check for update preferences command
    if (lowerContent.includes('update') ||
        lowerContent.includes('change my') ||
        lowerContent.includes('set my') ||
        lowerContent.includes('i am ') ||
        lowerContent.includes("i'm ") ||
        lowerContent.includes('instead of') ||
        lowerContent.includes('actually')) {

      const updateRequest = parseUpdateRequest(content);

      if (updateRequest) {
        const { field, value } = updateRequest;
        const updates = { [field]: value };
        const result = await redisApiService.updatePreferences(userId, updates);

        let responseContent: string;
        if (result.success) {
          if (onPreferencesUpdate) {
            onPreferencesUpdate(updates);
          }

          const fieldLabels: Record<string, string> = {
            name: 'Name',
            tripDuration: 'Trip Duration',
            travelTimeline: 'Travel Timeline',
            preferredMonth: 'Preferred Month',
            travelerCount: 'Traveler Count',
            travelerRelationships: 'Traveling With',
            budgetMin: 'Budget Min',
            budgetMax: 'Budget Max',
            travelStyle: 'Travel Style',
            accommodationType: 'Accommodation',
            dietaryRequirements: 'Dietary Requirements',
            accessibilityNeeds: 'Accessibility Needs',
            mobilityLevel: 'Mobility Level',
            preferredActivities: 'Preferred Activities',
            avoidActivities: 'Avoid Activities',
          };

          const fieldLabel = fieldLabels[field] || field;
          responseContent = `**Preference Updated!**

| Field | New Value |
|-------|-----------|
| ${fieldLabel} | ${value} |

Your profile has been updated in Redis.`;
        } else {
          responseContent = `**Update Failed**

I couldn't save your preference update. ${result.error || 'Please try again.'}`;
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          metadata: result.success ? { preferencesUpdated: [field] } : undefined
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Use ref to get latest messages
      const currentMessages = messagesRef.current;
      const claudeMessages: ClaudeMessage[] = [...currentMessages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      console.log('Sending to Claude API...');
      const response = await claudeApiService.sendMessage(claudeMessages, preferencesRef.current);
      console.log('Claude response received');

      const parsedDestinations = claudeApiService.parseDestinations(response);
      if (parsedDestinations.length > 0) {
        setDestinations(parsedDestinations);
      }

      const preferenceUpdates = claudeApiService.parsePreferenceUpdates(response);
      if (Object.keys(preferenceUpdates).length > 0) {
        const result = await redisApiService.updatePreferences(userId, preferenceUpdates);
        if (result.success && onPreferencesUpdate) {
          onPreferencesUpdate(preferenceUpdates);
        }
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          destinations: parsedDestinations.length > 0 ? parsedDestinations : undefined,
          preferencesUpdated: Object.keys(preferenceUpdates).length > 0 ? Object.keys(preferenceUpdates) : undefined
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onPreferencesUpdate]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setDestinations([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    destinations,
    sendMessage,
    clearMessages
  };
}
