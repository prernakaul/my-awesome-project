export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  color: string;
  createdAt: string;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Chore {
  id: string;
  title: string;
  description?: string;
  assigneeId: string | null;
  startDate: string;
  endDate: string;
  allDay: boolean;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoreWithAssignee extends Chore {
  assignee: TeamMember | null;
}

export interface CalendarEvent {
  id: string;
  choreId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  assignee: TeamMember | null;
  color: string;
  isRecurring: boolean;
}

export interface CreateTeamMemberInput {
  name: string;
  email?: string;
  color: string;
}

export interface CreateChoreInput {
  title: string;
  description?: string;
  assigneeId: string | null;
  startDate: string;
  endDate: string;
  allDay: boolean;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
}
