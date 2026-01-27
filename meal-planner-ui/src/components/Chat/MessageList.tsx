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
          <span className="empty-icon">🧠</span>
          <h3>Ready to boost your brain power!</h3>
          <p>Ask me to create a brain-healthy meal plan based on Dr. Lisa Mosconi's research.</p>
          <div className="suggestions">
            <button className="suggestion" onClick={() => onSuggestionClick?.('Create a weekly meal plan')}>
              <span className="suggestion-icon">📅</span>
              Create a weekly meal plan
            </button>
            <button className="suggestion" onClick={() => onSuggestionClick?.('Show me a brain-boosting breakfast recipe')}>
              <span className="suggestion-icon">🍳</span>
              Brain-boosting breakfast recipe
            </button>
            <button className="suggestion" onClick={() => onSuggestionClick?.('Give me snack ideas for better focus')}>
              <span className="suggestion-icon">🥜</span>
              Snacks for better focus
            </button>
            <button className="suggestion" onClick={() => onSuggestionClick?.('Create a grocery list for brain health')}>
              <span className="suggestion-icon">🛒</span>
              Brain-healthy grocery list
            </button>
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
