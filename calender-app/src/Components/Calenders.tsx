// @ts-ignore
import { FC, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
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

interface CustomEvent extends Event {
  resourceId: number;
  borderColor?: string;
}

interface Resource {
  id: number;
  title: string;
  color: string;
}

interface Tag {
  id: string;
  label: string;
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
    border: none; /* Remove border from events */
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
    box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
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
    min-height: ${(props) =>
      props.$eventsCount * 100}px; /* Adjust based on the number of events */
  }

  .rbc-addons-dnd .rbc-addons-dnd-resizable-month-event {
    display: none; /* Hide the drag-and-drop indicators */
  }
`;

const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
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
const CalendarComponent: FC = () => {
  const [searchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]); // State for managing tags
  const tagInputRef = useRef<HTMLInputElement>(null); // Ref for tag input

  const resources: Resource[] = [
    { id: 1, title: "John Doe", color: "#ff9999" },
    { id: 2, title: "Sarah Smith", color: "#99ff99" },
    { id: 3, title: "Mike Johnson", color: "#9999ff" },
  ];

  const [events, setEvents] = useState<CustomEvent[]>([
    {
      title: "Learn cool stuff with John",
      start,
      end,
      resourceId: 1,
      borderColor: "#ff0000",
    },
    {
      title: "Meeting with Sarah",
      start: addHours(start, 1),
      end: addHours(end, 1),
      resourceId: 2,
      borderColor: "#00ff00",
    },
    {
      title: "Call with Mike",
      start: addHours(start, 2),
      end: addHours(end, 2),
      resourceId: 3,
      borderColor: "#0000ff",
    },
    {
      title: "Project Discussion",
      start: addHours(start, 3),
      end: addHours(end, 3),
      resourceId: 1,
      borderColor: "#ff9900",
    },
    {
      title: "Team Meeting",
      start: addHours(start, 4),
      end: addHours(end, 4),
      resourceId: 2,
      borderColor: "#0099ff",
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
    const { event, start, end, resourceId } = data;
    //@ts-ignore
    setEvents((currentEvents) => {
      const updatedEvents = currentEvents.map((e) =>
        e.title === event.title
          ? {
              ...e,
              start: new Date(start),
              end: new Date(end),
              resourceId: resourceId || e.resourceId,
            }
          : e
      );
      return updatedEvents;
    });
  };

  const eventStyleGetter = (event: CustomEvent) => {
    const resource = resources.find((r) => r.id === event.resourceId);
    return {
      style: {
        backgroundColor: resource ? resource.color : "#999999",
        borderLeft: `5px solid ${event.borderColor || "#000000"}`,
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
  //@ts-ignore
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInputRef.current?.value.trim() !== "") {
      //@ts-ignore
      const newTagLabel = tagInputRef.current.value.trim();
      setTags([
        ...tags,
        { id: new Date().getTime().toString(), label: newTagLabel },
      ]);
      //@ts-ignore
      tagInputRef.current.value = ""; // Clear input
    }
  };

  const removeTag = (tagId: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
  };

  const filteredEvents = events.filter(
    (event) =>
      //@ts-ignore
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      //@ts-ignore
      (tags.length === 0 ||
        tags.some((tag) =>
          //@ts-ignore
          event?.title?.toLowerCase().includes(tag.label.toLowerCase())
        ))
  );

  return (
    <CalendarContainer>
      <TagContainer>
        {tags.map((tag) => (
          <Tag key={tag.id}>
            {tag.label}
            <TagCloseButton onClick={() => removeTag(tag.id)}>x</TagCloseButton>
          </Tag>
        ))}
        <SearchInput
          ref={tagInputRef}
          type="text"
          placeholder="Search Users"
          onKeyDown={handleKeyDown}
        />
      </TagContainer>
      <DnDCalendar
        defaultView="week"
        events={filteredEvents}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        style={{ height: "calc(100vh - 60px)" }}
        // @ts-ignore
        eventPropGetter={eventStyleGetter}
        // @ts-ignore
        onSelectEvent={handleSelectEvent}
        resources={resources}
        // @ts-ignore
        resourceIdAccessor={(resource: Resource) => resource.id}
        // @ts-ignore
        resourceTitleAccessor={(resource: Resource) => resource.title}
        step={15}
        timeslots={4}
        $eventsCount={filteredEvents.length}
      />
      {isModalOpen && selectedEvent && (
        <>
          <ModalOverlay onClick={closeModal} />
          <ModalContainer>
            <ModalContent>
              <CloseButton onClick={closeModal}>Close</CloseButton>
              <p>Title: {selectedEvent.title}</p>
              <p>
                Person:{" "}
                {
                  resources.find((r) => r.id === selectedEvent.resourceId)
                    ?.title
                }
              </p>
              <p>Custom border color: {selectedEvent.borderColor}</p>
            </ModalContent>
          </ModalContainer>
        </>
      )}
    </CalendarContainer>
  );
};

export default CalendarComponent;
