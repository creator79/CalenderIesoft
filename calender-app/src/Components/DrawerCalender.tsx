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
import ConsultationCard from "./ConsultationCard";

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
  border-left: 1px solid #e8e8e8;
  position: relative;
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
    font-size: 12px;
    color: #fff;
    border: 1px solid #fff;
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
    display: none;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
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
    let g = parseInt(color.slice(3, 6), 16);
    let b = parseInt(color.slice(6, 6), 16);
    r = Math.max(0, r - 50);
    g = Math.max(0, g - 50);
    b = Math.max(0, b - 50);
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

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


 
const [events, setEvents] = useState<CustomEvent[]>([
  {
    title: "Service Appointment 1",
    start: new Date(2024, 6, 1, 8, 0),
    end: new Date(2024, 6, 1, 9, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "8:00 AM - 9:00 AM",
    clientName: "John Doe",
    doctorName: "Dr. Smith",
    services: ["General Checkup", "Blood Test"],
  },
  {
    title: "Consultation 1",
    start: new Date(2024, 6, 1, 9, 0),
    end: new Date(2024, 6, 1, 10, 0),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "9:00 AM - 10:00 AM",
    clientName: "Jane Doe",
    doctorName: "Dr. John",
    services: ["Dental Consultation"],
  },
  {
    title: "Hydration Ringers",
    start: new Date(2024, 6, 1, 10, 0),
    end: new Date(2024, 6, 1, 10, 15),
    person: "Nurse Kelly",
    color: "#068BEE",
    date: "2024-06-01",
    time: "10:00 AM - 10:15 AM",
    clientName: "Mary Smith",
    doctorName: "Nurse Kelly",
    services: ["IV Therapy"],
  },
  {
    title: "Hangover Relief",
    start: new Date(2024, 6, 1, 10, 0),
    end: new Date(2024, 6, 1, 10, 15),
    person: "Dr. Chris",
    color: "#068BEE",
    date: "2024-06-01",
    time: "10:00 AM - 10:15 AM",
    clientName: "Tom Jones",
    doctorName: "Dr. Chris",
    services: ["Recovery Treatment"],
  },
  {
    title: "Service Appointment 2",
    start: new Date(2024, 6, 1, 10, 0),
    end: new Date(2024, 6, 1, 11, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "10:00 AM - 11:00 AM",
    clientName: "Alice Johnson",
    doctorName: "Dr. Smith",
    services: ["Physical Examination"],
  },
  {
    title: "Consultation 2",
    start: new Date(2024, 6, 1, 10, 30),
    end: new Date(2024, 6, 1, 11, 30),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "10:30 AM - 11:30 AM",
    clientName: "Bob Williams",
    doctorName: "Dr. John",
    services: ["Medical Advice"],
  },
  {
    title: "Service Appointment 3",
    start: new Date(2024, 6, 1, 11, 0),
    end: new Date(2024, 6, 1, 12, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "11:00 AM - 12:00 PM",
    clientName: "Eve Brown",
    doctorName: "Dr. Smith",
    services: ["Routine Checkup"],
  },
  {
    title: "Consultation 3",
    start: new Date(2024, 6, 1, 11, 30),
    end: new Date(2024, 6, 1, 12, 30),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "11:30 AM - 12:30 PM",
    clientName: "Sara Miller",
    doctorName: "Dr. John",
    services: ["Health Consultation"],
  },
  {
    title: "Service Appointment 4",
    start: new Date(2024, 6, 1, 12, 0),
    end: new Date(2024, 6, 1, 13, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "12:00 PM - 1:00 PM",
    clientName: "Jack Davis",
    doctorName: "Dr. Smith",
    services: ["Annual Physical"],
  },
  {
    title: "Consultation 4 of Time Slot 1",
    start: new Date(2024, 6, 1, 13, 0),
    end: new Date(2024, 6, 1, 13, 15),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "1:00 PM - 1:15 PM",
    clientName: "Anna White",
    doctorName: "Dr. John",
    services: ["Discussion on Test Results"],
  },
  {
    title: "Consultation 4 of Time Slot 2",
    start: new Date(2024, 6, 1, 13, 15),
    end: new Date(2024, 6, 1, 13, 30),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "1:15 PM - 1:30 PM",
    clientName: "Michael Brown",
    doctorName: "Dr. John",
    services: ["Treatment Plan Discussion"],
  },
  {
    title: "Consultation 4 of Time Slot 3",
    start: new Date(2024, 6, 1, 13, 30),
    end: new Date(2024, 6, 1, 13, 45),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "1:30 PM - 1:45 PM",
    clientName: "Emily Wilson",
    doctorName: "Dr. John",
    services: ["Follow-up Appointment"],
  },
  {
    title: "Consultation 4 of Time Slot 4",
    start: new Date(2024, 6, 1, 13, 45),
    end: new Date(2024, 6, 1, 14, 0),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "1:45 PM - 2:00 PM",
    clientName: "David Taylor",
    doctorName: "Dr. John",
    services: ["Check-up"],
  },
  {
    title: "Service Appointment 6",
    start: new Date(2024, 6, 1, 14, 0),
    end: new Date(2024, 6, 1, 15, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "2:00 PM - 3:00 PM",
    clientName: "Laura Martinez",
    doctorName: "Dr. Smith",
    services: ["Preventive Care"],
  },
  {
    title: "Consultation 6",
    start: new Date(2024, 6, 1, 14, 30),
    end: new Date(2024, 6, 1, 15, 30),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "2:30 PM - 3:30 PM",
    clientName: "Peter Clark",
    doctorName: "Dr. John",
    services: ["Specialist Referral"],
  },
  {
    title: "Service Appointment 6",
    start: new Date(2024, 6, 1, 15, 0),
    end: new Date(2024, 6, 1, 16, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "3:00 PM - 4:00 PM",
    clientName: "Sophia Adams",
    doctorName: "Dr. Smith",
    services: ["Diagnostic Tests"],
  },
  {
    title: "Consultation 6",
    start: new Date(2024, 6, 1, 15, 30),
    end: new Date(2024, 6, 1, 16, 30),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "3:30 PM - 4:30 PM",
    clientName: "Emma Moore",
    doctorName: "Dr. John",
    services: ["Second Opinion"],
  },
  {
    title: "Service Appointment 6",
    start: new Date(2024, 6, 1, 16, 0),
    end: new Date(2024, 6, 1, 17, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "4:00 PM - 5:00 PM",
    clientName: "James Wilson",
    doctorName: "Dr. Smith",
    services: ["Vaccination"],
  },
  {
    title: "Consultation 6",
    start: new Date(2024, 6, 1, 17, 0),
    end: new Date(2024, 6, 1, 18, 0),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "5:00 PM - 6:00 PM",
    clientName: "Olivia Johnson",
    doctorName: "Dr. John",
    services: ["Pain Management"],
  },
  {
    title: "Service Appointment 8",
    start: new Date(2024, 6, 1, 18, 0),
    end: new Date(2024, 6, 1, 19, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "6:00 PM - 7:00 PM",
    clientName: "William Garcia",
    doctorName: "Dr. Smith",
    services: ["Emergency Care"],
  },
  {
    title: "Consultation 8",
    start: new Date(2024, 6, 1, 19, 0),
    end: new Date(2024, 6, 1, 20, 0),
    person: "Dr. John",
    color: "#009A51",
    date: "2024-06-01",
    time: "7:00 PM - 8:00 PM",
    clientName: "Liam Hernandez",
    doctorName: "Dr. John",
    services: ["Psychological Counseling"],
  },
  {
    title: "Service Appointment 9",
    start: new Date(2024, 6, 1, 18, 0),
    end: new Date(2024, 6, 1, 18, 15),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "6:00 PM - 6:15 PM",
    clientName: "Ava Martinez",
    doctorName: "Dr. Smith",
    services: ["Pediatric Checkup"],
  },
  {
    title: "Service Appointment 10",
    start: new Date(2024, 6, 1, 18, 15),
    end: new Date(2024, 6, 1, 18, 30),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "6:15 PM - 6:30 PM",
    clientName: "Mia Lopez",
    doctorName: "Dr. Smith",
    services: ["Dermatology Consultation"],
  },
  {
    title: "Service Appointment 11",
    start: new Date(2024, 6, 1, 18, 30),
    end: new Date(2024, 6, 1, 18, 45),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "6:30 PM - 6:45 PM",
    clientName: "Ella Adams",
    doctorName: "Dr. Smith",
    services: ["Eye Examination"],
  },
  {
    title: "Service Appointment 12",
    start: new Date(2024, 6, 1, 18, 45),
    end: new Date(2024, 6, 1, 19, 0),
    person: "Dr. Smith",
    color: "#068BEE",
    date: "2024-06-01",
    time: "6:45 PM - 7:00 PM",
    clientName: "Logan Moore",
    doctorName: "Dr. Smith",
    services: ["Orthopedic Consultation"],
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
              <ConsultationCard
                date={selectedEvent.date}
                time={selectedEvent.time}
                clientName={selectedEvent.clientName}
                doctorName={selectedEvent.doctorName}
                services={selectedEvent.services}
                onClose={closeModal} 
              />
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
