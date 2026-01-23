import { useState, FormEvent } from 'react';
import { Modal } from '../common/Modal';
import type { TeamMember, CreateTeamMemberInput } from '../../types';

const COLORS = [
  '#4A90D9', '#E74C3C', '#2ECC71', '#9B59B6', '#F39C12',
  '#1ABC9C', '#E91E63', '#00BCD4', '#FF5722', '#607D8B',
];

interface TeamMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTeamMemberInput) => Promise<void>;
  initialData?: TeamMember;
}

export function TeamMemberForm({ isOpen, onClose, onSubmit, initialData }: TeamMemberFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [color, setColor] = useState(initialData?.color || COLORS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim() || undefined, color });
      onClose();
      setName('');
      setEmail('');
      setColor(COLORS[0]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Team Member' : 'Add Team Member'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email (optional)"
          />
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-swatch ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting || !name.trim()}>
            {submitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
