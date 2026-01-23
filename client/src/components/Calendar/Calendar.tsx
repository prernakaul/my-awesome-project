import { useState, useMemo, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useChores } from '../../hooks/useChores';
import { ChoreForm } from '../Chores/ChoreForm';
import type { TeamMember, CalendarEvent, CreateChoreInput } from '../../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  teamMembers: TeamMember[];
}

interface BigCalendarEvent {
  id: string;
  choreId: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
  resource: CalendarEvent;
}

export function Calendar({ teamMembers }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();

  const rangeStart = useMemo(() => startOfMonth(addMonths(currentDate, -1)), [currentDate]);
  const rangeEnd = useMemo(() => endOfMonth(addMonths(currentDate, 1)), [currentDate]);

  const { events, createChore, updateChore, deleteChore } = useChores(rangeStart, rangeEnd);

  const calendarEvents: BigCalendarEvent[] = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        choreId: e.choreId,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: e.allDay,
        color: e.color,
        resource: e,
      })),
    [events]
  );

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo.start);
    setSelectedEvent(undefined);
    setIsFormOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: BigCalendarEvent) => {
    setSelectedEvent(event.resource);
    setSelectedSlot(undefined);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = async (input: CreateChoreInput) => {
    if (selectedEvent) {
      await updateChore(selectedEvent.choreId, input);
    } else {
      await createChore(input);
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      await deleteChore(selectedEvent.choreId);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedSlot(undefined);
    setSelectedEvent(undefined);
  };

  const eventStyleGetter = (event: BigCalendarEvent) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
    },
  });

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        onView={setView}
        date={currentDate}
        onNavigate={setCurrentDate}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week']}
        popup
      />
      <ChoreForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        onDelete={selectedEvent ? handleDelete : undefined}
        teamMembers={teamMembers}
        defaultDate={selectedSlot}
        initialData={selectedEvent}
      />
    </div>
  );
}
