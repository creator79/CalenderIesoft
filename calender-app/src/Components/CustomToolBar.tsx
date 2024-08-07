import React, { useState } from "react";
import { ToolbarProps } from "react-big-calendar";
import styled from "styled-components";
import { format } from "date-fns";
import LeftArrow from "../assets/left.svg";
import RightArrow from "../assets/right.svg";
import CalendarIcon from "../assets/Vector.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px 0px 20px;
  background-color: #ffffff;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  height: 48px;
  width: 48px;
`;

const CurrentDate = styled.div`
  display: flex;
  align-items: center;
`;

const DateText = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-right: 12px;
  line-height: 20px;
`;

const ControlIcon = styled.img`
  width: 20px;
  cursor: pointer;
`;

const TodayButton = styled.button`
  font-family: Inter, sans-serif;
  justify-content: center;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  border: none;
  background-color: #F7F7F7;
  cursor : pointer ;
`;

const CalendarIconImg = styled.img`
  width: 20px;
  margin-right: 8px;
  cursor: pointer;
`;

const MainView = styled.div`
  display: flex;
  align-items: center;
`;

const CustomToolbar: React.FC<ToolbarProps & { selectedDate: Date; onDateChange: (date: Date) => void }> = ({ 
  onNavigate, 
  selectedDate, 
  onDateChange 
}) => {
  const [startDate, setStartDate] = useState<Date | null>(selectedDate);
  const formattedDate = format(selectedDate, "MMMM dd, yyyy");


  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      onDateChange(date);
      onNavigate("DATE", date);
    }
  };

  return (
    <ToolbarContainer>
      <TodayButton onClick={() => onNavigate("TODAY")}>Today</TodayButton>
      <CurrentDate>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          customInput={<CalendarIconImg src={CalendarIcon} alt="Calendar icon" />}
          dateFormat="MMMM dd, yyyy"
          popperPlacement="bottom"
          showPopperArrow={false}
        />
        <DateText>{formattedDate}</DateText>
      </CurrentDate>
      <MainView>
        <Button onClick={() => onNavigate("PREV")}>
          <ControlIcon src={LeftArrow} alt="Previous" />
        </Button>
        <Button onClick={() => onNavigate("NEXT")}>
          <ControlIcon src={RightArrow} alt="Next" />
        </Button>
      </MainView>
    </ToolbarContainer>
  );
};

export default CustomToolbar;
