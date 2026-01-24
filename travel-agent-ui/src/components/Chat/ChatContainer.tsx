import React from 'react';
import { Message, Destination, UserPreferences } from '../../types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { DestinationGrid } from '../Destinations';

interface ChatContainerProps {
  messages: Message[];
  destinations: Destination[];
  isLoading: boolean;
  preferences: UserPreferences | null;
  onSendMessage: (message: string) => void;
  onSelectDestination: (destination: Destination) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  destinations,
  isLoading,
  preferences,
  onSendMessage,
  onSelectDestination
}) => {
  return (
    <div className="chat-container">
      <div className="chat-main">
        <MessageList messages={messages} isLoading={isLoading} onSendMessage={onSendMessage} />

        {destinations.length > 0 && (
          <div className="destinations-panel">
            <h3>Recommended Destinations</h3>
            <DestinationGrid
              destinations={destinations}
              onSelect={onSelectDestination}
              preferredMonth={preferences?.preferredMonth}
            />
          </div>
        )}
      </div>

      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
};
