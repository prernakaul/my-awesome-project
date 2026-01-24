import React, { useState, useEffect, useCallback } from 'react';
import { AppPhase, UserPreferences, Destination } from './types';
import { useChat } from './hooks/useChat';
import { redisApiService } from './services/redisApi';
import { PhaseIndicator, LoadingSpinner } from './components/common';
import { PreferenceFlow } from './components/Onboarding';
import { ChatContainer } from './components/Chat';
import './styles/index.css';

// Generate a simple user ID (in production, use proper auth)
const getUserId = (): string => {
  let userId = localStorage.getItem('travel_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('travel_user_id', userId);
  }
  return userId;
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('onboarding');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);
  const [redisStatus, setRedisStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  const userId = getUserId();

  const handlePreferencesUpdate = useCallback((updates: Record<string, string>) => {
    setPreferences(prev => prev ? { ...prev, ...updates } : updates);
  }, []);

  const {
    messages,
    isLoading,
    destinations,
    sendMessage,
    clearMessages
  } = useChat({
    userId,
    preferences,
    onPreferencesUpdate: handlePreferencesUpdate
  });

  // Check Redis status and load preferences on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPrefs(true);

      // Check health
      const health = await redisApiService.checkHealth();
      setRedisStatus(health.redis === 'connected' ? 'connected' : 'disconnected');

      // Try to load existing preferences
      const result = await redisApiService.getPreferences(userId);

      if (result.exists && result.data) {
        setPreferences(result.data);
        setPhase('chat'); // Skip onboarding if we have preferences
      }

      setIsLoadingPrefs(false);
    };

    loadData();
  }, [userId]);

  const handleOnboardingComplete = async (newPrefs: Partial<UserPreferences>) => {
    // Save to Redis
    const result = await redisApiService.updatePreferences(userId, newPrefs);

    if (result.success && result.data) {
      setPreferences(result.data);
    } else {
      // Even if Redis fails, use the preferences locally
      setPreferences(newPrefs as UserPreferences);
    }

    setPhase('chat');

    // Send initial message to Claude
    setTimeout(() => {
      sendMessage("Based on my preferences, suggest some great USA destinations for my trip!");
    }, 500);
  };

  const handleSelectDestination = (destination: Destination) => {
    console.log('handleSelectDestination called:', destination);
    setPhase('itinerary');
    sendMessage(`I'd like to plan a trip to ${destination.city}, ${destination.state}. Please create a detailed day-by-day itinerary for me.`);
  };

  const handleResetPreferences = async () => {
    // Clear local state
    setPreferences(null);
    clearMessages();
    setPhase('onboarding');
  };

  if (isLoadingPrefs) {
    return (
      <div className="app loading-state">
        <LoadingSpinner size="large" message="Loading your travel profile..." />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">\u2708\ufe0f</span>
            <h1>AI Travel Agent</h1>
          </div>
          <div className="header-actions">
            <div className={`redis-status ${redisStatus}`}>
              <span className="status-dot"></span>
              {redisStatus === 'connected' ? 'Profile synced' : 'Offline mode'}
            </div>
            {preferences && (
              <button className="reset-btn" onClick={handleResetPreferences}>
                Reset Preferences
              </button>
            )}
          </div>
        </div>
        {phase !== 'onboarding' && <PhaseIndicator currentPhase={phase} />}
      </header>

      <main className="app-main">
        {phase === 'onboarding' ? (
          <div className="onboarding-container">
            <div className="onboarding-intro">
              <h2>Let's plan your perfect trip!</h2>
              <p>Answer a few quick questions so I can personalize your travel recommendations.</p>
            </div>
            <PreferenceFlow
              onComplete={handleOnboardingComplete}
            />
          </div>
        ) : (
          <ChatContainer
            messages={messages}
            destinations={destinations}
            isLoading={isLoading}
            preferences={preferences}
            onSendMessage={sendMessage}
            onSelectDestination={handleSelectDestination}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>AI Travel Agent - Your personal USA travel planner</p>
        {preferences?.travelStyle && (
          <p className="footer-prefs">
            Travel style: {preferences.travelStyle} | Budget: ${preferences.budgetMin || '0'}-${preferences.budgetMax || 'flexible'}
          </p>
        )}
      </footer>
    </div>
  );
};

export default App;
