import { useState } from 'react'
import { QuestionFlow } from './components/Questions/QuestionFlow'
import { ChatContainer } from './components/Chat/ChatContainer'
import { UserProfile } from './types'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meal Planner</h1>
        <p>Your personal AI nutrition assistant</p>
      </header>
      <main className="app-main">
        {!userProfile ? (
          <QuestionFlow onComplete={handleOnboardingComplete} />
        ) : (
          <ChatContainer userProfile={userProfile} />
        )}
      </main>
    </div>
  )
}

export default App
