import type { Chore, CalendarEvent, TeamMember } from '../types/index.js';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function advanceDate(date: Date, recurrence: Chore['recurrence']): Date {
  switch (recurrence) {
    case 'daily':
      return addDays(date, 1);
    case 'weekly':
      return addWeeks(date, 1);
    case 'monthly':
      return addMonths(date, 1);
    default:
      return date;
  }
}

function choreToEvent(
  chore: Chore,
  assignee: TeamMember | null,
  instanceDate?: Date
): CalendarEvent {
  const startDate = instanceDate ? new Date(instanceDate) : new Date(chore.startDate);
  const originalStart = new Date(chore.startDate);
  const originalEnd = new Date(chore.endDate);
  const duration = originalEnd.getTime() - originalStart.getTime();

  const endDate = new Date(startDate.getTime() + duration);

  return {
    id: instanceDate ? `${chore.id}_${startDate.toISOString()}` : chore.id,
    choreId: chore.id,
    title: chore.title,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    allDay: chore.allDay,
    assignee,
    color: assignee?.color || '#6B7280',
    isRecurring: chore.recurrence !== 'none',
  };
}

export function expandChoreToEvents(
  chore: Chore,
  assignee: TeamMember | null,
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  if (chore.recurrence === 'none') {
    const choreStart = new Date(chore.startDate);
    const choreEnd = new Date(chore.endDate);
    if (choreEnd >= rangeStart && choreStart <= rangeEnd) {
      return [choreToEvent(chore, assignee)];
    }
    return [];
  }

  const events: CalendarEvent[] = [];
  let currentDate = new Date(chore.startDate);
  const recurrenceEnd = chore.recurrenceEndDate
    ? new Date(chore.recurrenceEndDate)
    : rangeEnd;
  const effectiveEnd = recurrenceEnd < rangeEnd ? recurrenceEnd : rangeEnd;

  // Find the first occurrence within or before the range
  while (currentDate < rangeStart) {
    currentDate = advanceDate(currentDate, chore.recurrence);
    if (currentDate > effectiveEnd) break;
  }

  // Generate events within the range
  while (currentDate <= effectiveEnd) {
    events.push(choreToEvent(chore, assignee, currentDate));
    currentDate = advanceDate(currentDate, chore.recurrence);
  }

  return events;
}
