import { v4 as uuidv4 } from 'uuid';
import { getChores, saveChores } from '../storage/localStorage.js';
import { getTeamMemberById, getAllTeamMembers } from './teamMemberService.js';
import { expandChoreToEvents } from '../utils/recurrence.js';
import type { Chore, ChoreWithAssignee, CalendarEvent, CreateChoreInput } from '../types/index.js';

async function populateAssignee(chore: Chore): Promise<ChoreWithAssignee> {
  const assignee = chore.assigneeId ? await getTeamMemberById(chore.assigneeId) : null;
  return { ...chore, assignee };
}

export async function getAllChores(): Promise<ChoreWithAssignee[]> {
  const chores = await getChores();
  return Promise.all(chores.map(populateAssignee));
}

export async function getChoreById(id: string): Promise<ChoreWithAssignee | null> {
  const chores = await getChores();
  const chore = chores.find((c) => c.id === id);
  if (!chore) return null;
  return populateAssignee(chore);
}

export async function createChore(input: CreateChoreInput): Promise<ChoreWithAssignee> {
  const chores = await getChores();
  const now = new Date().toISOString();
  const newChore: Chore = {
    id: uuidv4(),
    title: input.title,
    description: input.description,
    assigneeId: input.assigneeId,
    startDate: input.startDate,
    endDate: input.endDate,
    allDay: input.allDay,
    recurrence: input.recurrence,
    recurrenceEndDate: input.recurrenceEndDate,
    createdAt: now,
    updatedAt: now,
  };
  chores.push(newChore);
  await saveChores(chores);
  return populateAssignee(newChore);
}

export async function updateChore(
  id: string,
  input: Partial<CreateChoreInput>
): Promise<ChoreWithAssignee | null> {
  const chores = await getChores();
  const index = chores.findIndex((c) => c.id === id);
  if (index === -1) return null;

  chores[index] = {
    ...chores[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await saveChores(chores);
  return populateAssignee(chores[index]);
}

export async function deleteChore(id: string): Promise<boolean> {
  const chores = await getChores();
  const index = chores.findIndex((c) => c.id === id);
  if (index === -1) return false;

  chores.splice(index, 1);
  await saveChores(chores);
  return true;
}

export async function getCalendarEvents(
  rangeStart: Date,
  rangeEnd: Date
): Promise<CalendarEvent[]> {
  const chores = await getChores();
  const members = await getAllTeamMembers();
  const memberMap = new Map(members.map((m) => [m.id, m]));

  const events: CalendarEvent[] = [];
  for (const chore of chores) {
    const assignee = chore.assigneeId ? memberMap.get(chore.assigneeId) || null : null;
    const choreEvents = expandChoreToEvents(chore, assignee, rangeStart, rangeEnd);
    events.push(...choreEvents);
  }

  return events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
