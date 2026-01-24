import React, { useRef, useEffect } from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from '../common';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onSendMessage }) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="message-list-empty">
        <div className="empty-state">
          <span className="empty-icon">✈️</span>
          <h3>Start Planning Your Trip</h3>
          <p>Ask me about destinations, itineraries, or travel tips!</p>
          <div className="suggestion-chips">
            <button className="chip" onClick={() => onSendMessage?.('Suggest destinations for me')}>
              Suggest destinations for me
            </button>
            <button className="chip" onClick={() => onSendMessage?.('Plan a weekend getaway')}>
              Plan a weekend getaway
            </button>
            <button className="chip" onClick={() => onSendMessage?.('Beach vacation ideas')}>
              Beach vacation ideas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list" ref={listRef}>
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="message-bubble assistant">
          <div className="message-avatar">✈️</div>
          <div className="message-content typing">
            <LoadingSpinner size="small" />
            <span>Planning your perfect trip...</span>
          </div>
        </div>
      )}
    </div>
  );
};
