// Calendar.tsx
import React, { useState } from 'react';
import { momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarContainer, SearchInput, StyledCalendar } from './Calender.styles';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  borderColor?: string;
}

interface Resource {
  id: number;
  title: string;
  color: string;
}

const MyCalendar: React.FC = () => {
  const [events] = useState<Event[]>([
     {
      id: 1,
      title: 'Meeting with John',
      start: new Date(2024, 5, 25, 10, 0),
      end: new Date(2024, 5, 25, 12, 0),
      resourceId: 1,
      borderColor: '#ff0000',
    },
    {
      id: 2,
      title: 'Lunch with Sarah',
      start: new Date(2024, 5, 25, 14, 0),
      end: new Date(2024, 5, 25, 16, 0),
      resourceId: 2,
      borderColor: '#00ff00',
    },
    {
      id: 3,
      title: 'Call with Mike',
      start: new Date(2024, 5, 26, 11, 0),
      end: new Date(2024, 5, 26, 12, 0),
      resourceId: 3,
      borderColor: '#0000ff',
    },{
      id: 4,
      title: 'Call with Mike',
      start: new Date(2024, 5, 26, 11, 0),
      end: new Date(2024, 5, 26, 12, 0),
      resourceId: 3,
      borderColor: '#0000ff',
    },{
      id: 5,
      title: 'Call with Mike',
      start: new Date(2024, 5, 26, 11, 0),
      end: new Date(2024, 5, 26, 12, 0),
      resourceId: 3,
      borderColor: '#0000ff',
    },{
      id: 6,
      title: 'Call with Mike',
      start: new Date(2024, 5, 26, 11, 0),
      end: new Date(2024, 5, 26, 12, 0),
      resourceId: 3,
      borderColor: '#0000ff',
    },
  ]);

  const resources: Resource[] = [
    { id: 1, title: 'John Doe', color: '#ff9999' },
    { id: 2, title: 'Sarah Smith', color: '#99ff99' },
    { id: 3, title: 'Mike Johnson', color: '#9999ff' },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const eventStyleGetter = (event: Event) => {
    const resource = resources.find(r => r.id === event.resourceId);
    return {
      style: {
        backgroundColor: resource ? resource.color : '#999999',
        borderLeft: `5px solid ${event.borderColor || '#000000'}`,
      }
    };
  };

  const handleSelectEvent = (event: Event) => {
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
      <StyledCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        resources={resources}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        views={['day', 'week', 'work_week', 'month']}
        defaultView={Views.WORK_WEEK}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
      />
    </CalendarContainer>
  );
};

export default MyCalendar;