import { useState, useEffect, useCallback } from 'react';
import { choreApi } from '../services/api';
import type { CalendarEvent, CreateChoreInput } from '../types';

export function useChores(rangeStart: Date, rangeEnd: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await choreApi.getCalendarEvents(rangeStart, rangeEnd);
      setEvents(data);
    } catch {
      setError('Failed to load chores');
    } finally {
      setLoading(false);
    }
  }, [rangeStart.getTime(), rangeEnd.getTime()]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createChore = async (input: CreateChoreInput) => {
    await choreApi.create(input);
    await fetchEvents();
  };

  const updateChore = async (id: string, input: Partial<CreateChoreInput>) => {
    await choreApi.update(id, input);
    await fetchEvents();
  };

  const deleteChore = async (id: string) => {
    await choreApi.delete(id);
    await fetchEvents();
  };

  return {
    events,
    loading,
    error,
    createChore,
    updateChore,
    deleteChore,
    refetch: fetchEvents,
  };
}
