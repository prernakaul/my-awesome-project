import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { useChat } from '../../hooks/useChat'
import { UserProfile } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface ChatContainerProps {
  userProfile: UserProfile
}

export function ChatContainer({ userProfile }: ChatContainerProps) {
  const { messages, isLoading, sendMessage } = useChat(userProfile)

  const goalLabels: Record<string, string> = {
    focus: 'Better Focus',
    memory: 'Memory Support',
    energy: 'Mental Energy',
    mood: 'Mood Balance',
    longevity: 'Brain Longevity'
  }

  return (
    <div className="chat-container">
      <div className="chat-section">
        <div className="chat-header">
          <div className="chat-header-main">
            <h2>Your Brain Food Assistant</h2>
            <p className="profile-summary">
              Hi {userProfile.name}! Cooking for {userProfile.servings} | {userProfile.skillLevel} cook | {userProfile.cookingTime} time
            </p>
          </div>
          <div className="profile-goals">
            {userProfile.goals.map(goal => (
              <span key={goal} className="goal-tag">{goalLabels[goal] || goal}</span>
            ))}
          </div>
        </div>
        <MessageList messages={messages} onSuggestionClick={sendMessage} />
        {isLoading && (
          <div className="loading-indicator">
            <LoadingSpinner />
            <span>Preparing your brain-boosting recommendations...</span>
          </div>
        )}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
