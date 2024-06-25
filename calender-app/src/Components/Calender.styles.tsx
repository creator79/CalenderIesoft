// Calendar.styles.tsx
import styled from 'styled-components';
import { Calendar as BigCalendar } from 'react-big-calendar';

export const CalendarContainer = styled.div`
  height: 800px;
  margin: 20px;
`;

export const SearchInput = styled.input`
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const StyledCalendar = styled(BigCalendar)`
  .rbc-event {
    border-radius: 0px;
    opacity: 0.8;
    color: black;
    display: block;
  }

  .rbc-today {
    background-color: #f0f0f0;
  }

  .rbc-header {
    background-color: #f8f8f8;
    padding: 10px 0;
    font-weight: bold;
  }

  .rbc-toolbar {
    margin-bottom: 20px;
  }

  .rbc-event-overlaps {
    box-shadow: -1px 1px 5px rgba(0,0,0,.2);
  }

  .rbc-date-cell {
    font-size: 16px;
    font-weight: bold;
    padding: 5px;
  }

  .rbc-off-range-bg {
    background-color: #f8f8f8;
  }

  .rbc-off-range {
    color: #999;
  }
`;