import axios from 'axios';
import type {
  TeamMember,
  ChoreWithAssignee,
  CalendarEvent,
  CreateTeamMemberInput,
  CreateChoreInput,
  ApiResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const teamMemberApi = {
  getAll: async (): Promise<TeamMember[]> => {
    const { data } = await api.get<ApiResponse<TeamMember[]>>('/team-members');
    return data.data;
  },
  create: async (input: CreateTeamMemberInput): Promise<TeamMember> => {
    const { data } = await api.post<ApiResponse<TeamMember>>('/team-members', input);
    return data.data;
  },
  update: async (id: string, input: Partial<CreateTeamMemberInput>): Promise<TeamMember> => {
    const { data } = await api.put<ApiResponse<TeamMember>>(`/team-members/${id}`, input);
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/team-members/${id}`);
  },
};

export const choreApi = {
  getAll: async (): Promise<ChoreWithAssignee[]> => {
    const { data } = await api.get<ApiResponse<ChoreWithAssignee[]>>('/chores');
    return data.data;
  },
  getCalendarEvents: async (start: Date, end: Date): Promise<CalendarEvent[]> => {
    const { data } = await api.get<ApiResponse<CalendarEvent[]>>('/chores/calendar', {
      params: { start: start.toISOString(), end: end.toISOString() },
    });
    return data.data;
  },
  create: async (input: CreateChoreInput): Promise<ChoreWithAssignee> => {
    const { data } = await api.post<ApiResponse<ChoreWithAssignee>>('/chores', input);
    return data.data;
  },
  update: async (id: string, input: Partial<CreateChoreInput>): Promise<ChoreWithAssignee> => {
    const { data } = await api.put<ApiResponse<ChoreWithAssignee>>(`/chores/${id}`, input);
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/chores/${id}`);
  },
};
