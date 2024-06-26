// import React from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);

// const MyCalendar = ({ events }) => {
//   const eventStyleGetter = (event, start, end, isSelected) => {
//     const backgroundColor = event.color;
//     const style = {
//       backgroundColor,
//       borderRadius: '0px',
//       opacity: 0.8,
//       color: 'white',
//       border: '0px',
//       display: 'block'
//     };
//     return {
//       style: style
//     };
//   };

//   return (
//     <Calendar
//       localizer={localizer}
//       events={events}
//       defaultView="week"
//       views={['week', 'day', 'month']}
//       step={60}
//       showMultiDayTimes
//       defaultDate={new Date()}
//       style={{ height: "100vh" }}
//       eventPropGetter={eventStyleGetter}
//     />
//   );
// };

// export default MyCalendar;
