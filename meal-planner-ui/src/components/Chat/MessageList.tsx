import { useEffect, useRef } from 'react'
import { Message } from '../../types'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: Message[]
  onSuggestionClick?: (suggestion: string) => void
}

export function MessageList({ messages, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <h3>Ready to plan your meals!</h3>
          <p>Ask me to create a meal plan, suggest recipes, or help with your grocery list.</p>
          <div className="suggestions">
            <button className="suggestion" onClick={() => onSuggestionClick?.('Create a weekly meal plan')}>Create a weekly meal plan</button>
            <button className="suggestion" onClick={() => onSuggestionClick?.('Suggest healthy breakfast ideas')}>Suggest healthy breakfast ideas</button>
            <button className="suggestion" onClick={() => onSuggestionClick?.('Help me with a grocery list')}>Help me with a grocery list</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
