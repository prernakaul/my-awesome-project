import { useTeamMembers } from './hooks/useTeamMembers';
import { Calendar } from './components/Calendar/Calendar';
import { TeamMemberList } from './components/TeamMembers/TeamMemberList';
import './styles/global.css';

export function App() {
  const { members, loading, error, createMember, updateMember, deleteMember } = useTeamMembers();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Office Chore Manager</h1>
      </header>
      <main className="app-main">
        <aside className="sidebar">
          <TeamMemberList
            members={members}
            onAdd={createMember}
            onUpdate={updateMember}
            onDelete={deleteMember}
          />
        </aside>
        <section className="calendar-section">
          <Calendar teamMembers={members} />
        </section>
      </main>
    </div>
  );
}
