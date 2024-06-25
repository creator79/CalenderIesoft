// @ts-nocheck

import { FC, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { addHours, startOfHour } from 'date-fns';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';

interface CustomEvent extends Event {
  resourceId: number;
  borderColor?: string;
}

interface Resource {
  id: number;
  title: string;
  color: string;
}

const CalendarContainer = styled.div`
  height: 100vh;
  padding: 20px;
`;

const SearchInput = styled.input`
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledCalendar = styled(Calendar)<{ $eventsCount: number }>`
  .rbc-event {
    border-radius: 0px;
    opacity: 0.8;
    color: black;
  }

  .rbc-today {
    background-color: #f0f0f0;
  }

  .rbc-header {
    background-color: #f8f8f8;
    padding: auto;
    font-weight: bold;
  }

  .rbc-event-overlaps {
    box-shadow: -1px 1px 5px rgba(0,0,0,.2);
  }

  .rbc-date-cell {
    font-size: 16px;
    font-weight: bold;
  }

  .rbc-off-range-bg {
    background-color: #f8f8f8;
  }

  .rbc-off-range {
    color: #999;
  }

  .rbc-time-content {
    min-height: ${props => props.$eventsCount * 100}px; /* Adjust based on the number of events */
  }
`;

const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
const end = addHours(start, 1);

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(StyledCalendar);

const CalendarComponent: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const resources: Resource[] = [
    { id: 1, title: 'John Doe', color: '#ff9999' },
    { id: 2, title: 'Sarah Smith', color: '#99ff99' },
    { id: 3, title: 'Mike Johnson', color: '#9999ff' },
  ];

  const [events, setEvents] = useState<CustomEvent[]>([
    {
      title: 'Learn cool stuff with John',
      start,
      end,
      resourceId: 1,
      borderColor: '#ff0000',
    },
    {
      title: 'Meeting with Sarah',
      start: addHours(start, 1),
      end: addHours(end, 1),
      resourceId: 2,
      borderColor: '#00ff00',
    },
    {
      title: 'Call with Mike',
      start: addHours(start, 2),
      end: addHours(end, 2),
      resourceId: 3,
      borderColor: '#0000ff',
    },
    {
      title: 'Project Discussion',
      start: addHours(start, 3),
      end: addHours(end, 3),
      resourceId: 1,
      borderColor: '#ff9900',
    },
    {
      title: 'Team Meeting',
      start: addHours(start, 4),
      end: addHours(end, 4),
      resourceId: 2,
      borderColor: '#0099ff',
    },
  ]);

  const onEventResize: withDragAndDropProps['onEventResize'] = data => {
    const { event, start, end } = data;
    setEvents(currentEvents => {
      const updatedEvents = currentEvents.map(e =>
        e.title === event.title ? { ...e, start: new Date(start), end: new Date(end) } : e
      );
      return updatedEvents;
    });
  };

  const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
    const { event, start, end, resourceId } = data;
    setEvents(currentEvents => {
      const updatedEvents = currentEvents.map(e =>
        e.title === event.title ? { ...e, start: new Date(start), end: new Date(end), resourceId: resourceId || e.resourceId } : e
      );
      return updatedEvents;
    });
  };

  const eventStyleGetter = (event: CustomEvent) => {
    const resource = resources.find(r => r.id === event.resourceId);
    return {
      style: {
        backgroundColor: resource ? resource.color : '#999999',
        borderLeft: `5px solid ${event.borderColor || '#000000'}`,
      },
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectEvent = (event: CustomEvent, _e: React.SyntheticEvent<HTMLElement>) => {
    const resource = resources.find(r => r.id === event.resourceId);
    alert(`Selected event: ${event.title}\nPerson: ${resource?.title}\nCustom border color: ${event.borderColor}`);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CalendarContainer>
      <SearchInput
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <DnDCalendar
        defaultView='week'
        events={filteredEvents}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        style={{ height: 'calc(100vh - 60px)' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        resources={resources}
        resourceIdAccessor={(resource: Resource) => resource.id}
        resourceTitleAccessor={(resource: Resource) => resource.title}
        step={15}
        timeslots={4}
        $eventsCount={filteredEvents.length} 
      />
    </CalendarContainer>
  );
};

export default CalendarComponent;
