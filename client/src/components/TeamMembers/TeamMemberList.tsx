import { useState } from 'react';
import { TeamMemberForm } from './TeamMemberForm';
import type { TeamMember, CreateTeamMemberInput } from '../../types';

interface TeamMemberListProps {
  members: TeamMember[];
  onAdd: (input: CreateTeamMemberInput) => Promise<TeamMember>;
  onUpdate: (id: string, input: Partial<CreateTeamMemberInput>) => Promise<TeamMember>;
  onDelete: (id: string) => Promise<void>;
}

export function TeamMemberList({ members, onAdd, onUpdate, onDelete }: TeamMemberListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>();

  const handleAdd = async (input: CreateTeamMemberInput) => {
    await onAdd(input);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleUpdate = async (input: CreateTeamMemberInput) => {
    if (editingMember) {
      await onUpdate(editingMember.id, input);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingMember(undefined);
  };

  return (
    <div className="team-member-list">
      <div className="section-header">
        <h3>Team Members</h3>
        <button className="add-btn" onClick={() => setIsFormOpen(true)}>
          + Add
        </button>
      </div>
      <div className="member-items">
        {members.length === 0 ? (
          <p className="empty-state">No team members yet</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="member-item">
              <span className="member-color" style={{ backgroundColor: member.color }} />
              <span className="member-name">{member.name}</span>
              <div className="member-actions">
                <button onClick={() => handleEdit(member)} title="Edit">
                  Edit
                </button>
                <button onClick={() => onDelete(member.id)} title="Delete" className="delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <TeamMemberForm
        isOpen={isFormOpen}
        onClose={handleClose}
        onSubmit={editingMember ? handleUpdate : handleAdd}
        initialData={editingMember}
      />
    </div>
  );
}
