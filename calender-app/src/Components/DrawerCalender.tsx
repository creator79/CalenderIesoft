// DrawerCalender.tsx
/* eslint-disable */
// @ts-nocheck

import React, { FC, useRef, useState, KeyboardEvent } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event as REvent,
} from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { addHours, startOfHour } from "date-fns";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import CustomToolbar from "./CustomToolBar"; // Import the custom toolbar
import LegendCard from "./Legend";

interface CustomEvent extends REvent {
  person: string;
  color: string;
  borderColor?: string;
}

interface Tag {
  id: string;
  label: string;
}

const CalendarContainer = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
    border-left: 1px solid #E8E8E8;

  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-100%)"};

  @media (min-width: 1024px) {
    transform: translateX(
      0
    ); /* Ensure calendar is always visible on larger screens */
  }
  @media (max-width: px) {
    visibility: hidden;
  }
`;
const LegendContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: white;
  padding: 10px;
  border-top: 1px solid #ccc;
`;
const DrawerToggleButton = styled.button`
  display: block;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1100;
`;

const DisplayCalendarButton = styled.button<{ $isVisible: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1100;
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
    border: none;
    opacity: 0.8;
    font-size: 12px;
    color: #fff;
   border : 1px solid #fff;
    font-family: Inter, sans-serif;
    font-weight: 500;
    line-height: 16px;
      
  }
  .rbc-label {
    padding: 0 4.5px;
  }
  .rbc-time-view {
    border: none;
    padding: 12px;
  }

  .rbc-today {
    background-color: #fff;
  }

  .rbc-header {
    padding: auto;
    font-weight: bold;
  }

  .rbc-event-overlaps {
    box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
  }

  .rbc-date-cell {
    font-size: 10px;
    font-weight: bold;
  }
  .rbc-timeslot-group {
    min-height: 16px; /* Adjust this value to increase/decrease row height */
    color: #717171;
  }

  .rbc-time-slot {
    min-height: 16px; /* Should match the value above */
    font-size: 10px;
    line-height: 16px;
    font-weight: 500px;
  }

  .rbc-events-container {
    margin-right: 10px; /* Add some margin to prevent events from touching the time column */
  }

  .rbc-off-range-bg {
    background-color: #f8f8f8;
  }

  .rbc-off-range {
    color: #999;
  }

  .rbc-time-content {
    font-size: 12px;
    line-height: 16px;
    font-weight: 500px;
  }

.rbc-allday-cell {
  display : none;
}

  .rbc-addons-dnd .rbc-addons-dnd-resizable-month-event {
    display: none;
    border: none;
  }
`;

const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore
const end = addHours(start, 1);

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(StyledCalendar);

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  margin-bottom: 10px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const Tag = styled.div`
  background-color: #e0e0e0;
  border-radius: 16px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const TagCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
  font-size: 16px;
`;

const DrawerCalender: FC = () => {
  const [searchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true); // State for toggling calendar visibility
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State for toggling calendar drawer

  const darkerShade = (color: string) => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    r = Math.max(0, r - 50);
    g = Math.max(0, g - 50);
    b = Math.max(0, b - 50);
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const [events, setEvents] = useState<CustomEvent[]>([
    {
      title: "Service Appointment 1",
      start: new Date(2024, 5, 29, 8, 0),
      end: new Date(2024, 5, 29, 9, 0),
      person: "Dr. Smith",
      color: "#068BEE", // Blue for services
    },
    {
      title: "Consultation 1",
      start: new Date(2024, 5, 29, 9, 0),
      end: new Date(2024, 5, 29, 10, 0),
      person: "Dr. John",
      color: "#009A51", // Green for consultations
    },
    {
      title: "Hydration Ringers",
      start: new Date(2024, 5, 29, 10, 0),
      end: new Date(2024, 5, 29, 10, 15),
      person: "Nurse Kelly",
      color: "#068BEE",
    },
    {
      title: "Hangover Relief",
      start: new Date(2024, 5, 29, 10, 0),
      end: new Date(2024, 5, 29, 10, 15),
      person: "Dr. Chris",
      color: "#068BEE",
    },
    {
      title: "Service Appointment 2",
      start: new Date(2024, 5, 29, 10, 0),
      end: new Date(2024, 5, 29, 11, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 2",
      start: new Date(2024, 5, 29, 10, 30),
      end: new Date(2024, 5, 29, 11, 30),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 3",
      start: new Date(2024, 5, 29, 11, 0),
      end: new Date(2024, 5, 29, 12, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 3",
      start: new Date(2024, 5, 29, 11, 30),
      end: new Date(2024, 5, 29, 12, 30),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 4",
      start: new Date(2024, 5, 29, 12, 0),
      end: new Date(2024, 5, 29, 13, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 4 of Time Slot 1",
      start: new Date(2024, 5, 29, 13, 0),
      end: new Date(2024, 5, 29, 13, 15),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Consultation 4 of Time Slot 2",
      start: new Date(2024, 5, 29, 13, 15),
      end: new Date(2024, 5, 29, 13, 30),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Consultation 4 of Time Slot 3",
      start: new Date(2024, 5, 29, 13, 30),
      end: new Date(2024, 5, 29, 13, 45),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Consultation 4 of Time Slot 4",
      start: new Date(2024, 5, 29, 13, 45),
      end: new Date(2024, 5, 29, 14, 0),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 5",
      start: new Date(2024, 5, 29, 14, 0),
      end: new Date(2024, 5, 29, 15, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 5",
      start: new Date(2024, 5, 29, 14, 30),
      end: new Date(2024, 5, 29, 15, 30),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 6",
      start: new Date(2024, 5, 29, 15, 0),
      end: new Date(2024, 5, 29, 16, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 6",
      start: new Date(2024, 5, 29, 15, 30),
      end: new Date(2024, 5, 29, 16, 30),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 7",
      start: new Date(2024, 5, 29, 16, 0),
      end: new Date(2024, 5, 29, 17, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 7",
      start: new Date(2024, 5, 29, 17, 0),
      end: new Date(2024, 5, 29, 18, 0),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 8",
      start: new Date(2024, 5, 29, 18, 0),
      end: new Date(2024, 5, 29, 19, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Consultation 8",
      start: new Date(2024, 5, 29, 19, 0),
      end: new Date(2024, 5, 29, 20, 0),
      person: "Dr. John",
      color: "#009A51",
    },
    {
      title: "Service Appointment 9",
      start: new Date(2024, 5, 29, 18, 0),
      end: new Date(2024, 5, 29, 18, 15),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Service Appointment 10",
      start: new Date(2024, 5, 29, 18, 15),
      end: new Date(2024, 5, 29, 18, 30),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Service Appointment 11",
      start: new Date(2024, 5, 29, 18, 30),
      end: new Date(2024, 5, 29, 18, 45),
      person: "Dr. Smith",
      color: "#068BEE",
    },
    {
      title: "Service Appointment 12",
      start: new Date(2024, 5, 29, 18, 45),
      end: new Date(2024, 5, 29, 19, 0),
      person: "Dr. Smith",
      color: "#068BEE",
    },
  ]);
  
  

  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const { event, start, end } = data;
    setEvents((currentEvents) => {
      const updatedEvents = currentEvents.map((e) =>
        e.title === event.title
          ? { ...e, start: new Date(start), end: new Date(end) }
          : e
      );
      return updatedEvents;
    });
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    const { event, start, end } = data;
    setEvents((currentEvents) => {
      const updatedEvents = currentEvents.map((e) =>
        e.title === event.title
          ? { ...e, start: new Date(start), end: new Date(end) }
          : e
      );
      return updatedEvents;
    });
  };

  const eventStyleGetter = (event: CustomEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        // borderLeft: `5px solid ${darkerShade(event.color)}`,
      },
    };
  };

  const handleSelectEvent = (event: CustomEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInputRef.current?.value.trim() !== "") {
      // @ts-ignore
      const newTagLabel = tagInputRef.current.value.trim();
      setTags([
        ...tags,
        { id: new Date().getTime().toString(), label: newTagLabel },
      ]);
      // @ts-ignore
      tagInputRef.current.value = "";
    }
  };

  const removeTag = (tagId: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
  };

  const filteredEvents = events.filter(
    (event) =>
      // @ts-ignore
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (tags.length === 0 ||
        tags.some((tag) =>
          // @ts-ignore
          event?.title?.toLowerCase().includes(tag.label.toLowerCase())
        ))
  );

  return (
    <>
      <DisplayCalendarButton
        $isVisible={!isCalendarVisible}
        onClick={() => setIsCalendarVisible(true)}
      >
        Display Calendar
      </DisplayCalendarButton>

      <CalendarContainer $isOpen={isCalendarOpen}>
        {/* Your calendar component */}
        {isCalendarVisible && (
          <DnDCalendar
            defaultView="day"
            events={filteredEvents}
            localizer={localizer}
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            resizable
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            step={15}
            timeslots={4}
            $eventsCount={filteredEvents.length}
            components={{
              toolbar: CustomToolbar,
            }}
          />
        )}

        {isModalOpen && selectedEvent && (
          <>
            <ModalOverlay onClick={closeModal} />
            <ModalContainer>
              <ModalContent>
                <CloseButton onClick={closeModal}>Close</CloseButton>
                <p>Title: {selectedEvent.title}</p>
                <p>Person: {selectedEvent.person}</p>
                <p>Custom border color: {selectedEvent.borderColor}</p>
              </ModalContent>
            </ModalContainer>
          </>
        )}
        <LegendContainer>

        <LegendCard />
        </LegendContainer>
      </CalendarContainer>
    </>
  );
};

export default DrawerCalender;
