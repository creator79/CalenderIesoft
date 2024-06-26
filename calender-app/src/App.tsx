// import MyCalendar from "./Components/Calender";
import CalendarComponent from "./Components/Calenders";

// const events = [
//   {
//     title: 'Meeting with Alice',
//     start: new Date(2024, 5, 24, 10, 0),
//     end: new Date(2024, 5, 24, 11, 0),
//     color: '#f56a00' // Alice's color
//   },
//   {
//     title: 'Meeting with Bob',
//     start: new Date(2024, 5, 24, 10, 0),
//     end: new Date(2024, 5, 24, 11, 0),
//     color: '#7265e6' // Bob's color
//   },
//   {
//     title: 'Meeting with Charlie',
//     start: new Date(2024, 5, 24, 10, 0),
//     end: new Date(2024, 5, 24, 11, 0),
//     color: '#ffbf00' // Charlie's color
//   },
//   {
//     title: 'Meeting with Dave',
//     start: new Date(2024, 5, 24, 10, 0),
//     end: new Date(2024, 5, 24, 11, 0),
//     color: '#00aaff' // Dave's color
//   }
// ];

const App = () => (
  <div>
    {/* <MyCalendar events={events} /> */}
    <CalendarComponent/>
  </div>
);

export default App;
