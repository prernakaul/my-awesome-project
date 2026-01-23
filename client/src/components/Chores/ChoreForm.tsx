import { useState, FormEvent } from 'react';
import { Modal } from '../common/Modal';
import type { TeamMember, CreateChoreInput, RecurrenceType, CalendarEvent } from '../../types';

interface ChoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateChoreInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  teamMembers: TeamMember[];
  defaultDate?: Date;
  initialData?: CalendarEvent;
}

export function ChoreForm({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  teamMembers,
  defaultDate,
  initialData,
}: ChoreFormProps) {
  const getDefaultDate = () => {
    const d = defaultDate || new Date();
    return d.toISOString().slice(0, 16);
  };

  const getDefaultEndDate = () => {
    const d = defaultDate || new Date();
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>(initialData?.assignee?.id || '');
  const [startDate, setStartDate] = useState(initialData?.start.slice(0, 16) || getDefaultDate());
  const [endDate, setEndDate] = useState(initialData?.end.slice(0, 16) || getDefaultEndDate());
  const [allDay, setAllDay] = useState(initialData?.allDay || false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>(initialData?.isRecurring ? 'weekly' : 'none');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId: assigneeId || null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        allDay,
        recurrence,
      });
      onClose();
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete && confirm('Are you sure you want to delete this chore?')) {
      setSubmitting(true);
      try {
        await onDelete();
        onClose();
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssigneeId('');
    setStartDate(getDefaultDate());
    setEndDate(getDefaultEndDate());
    setAllDay(false);
    setRecurrence('none');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Chore' : 'Add Chore'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Clean kitchen"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
            rows={2}
          />
        </div>
        <div className="form-group">
          <label htmlFor="assignee">Assignee</label>
          <select id="assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            All day
          </label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start</label>
            <input
              id="startDate"
              type={allDay ? 'date' : 'datetime-local'}
              value={allDay ? startDate.slice(0, 10) : startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End</label>
            <input
              id="endDate"
              type={allDay ? 'date' : 'datetime-local'}
              value={allDay ? endDate.slice(0, 10) : endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="recurrence">Recurrence</label>
          <select
            id="recurrence"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
          >
            <option value="none">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="form-actions">
          {initialData && onDelete && (
            <button type="button" onClick={handleDelete} className="delete" disabled={submitting}>
              Delete
            </button>
          )}
          <button type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting || !title.trim()}>
            {submitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
