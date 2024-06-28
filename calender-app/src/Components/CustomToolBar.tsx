import React from "react";
import { ToolbarProps } from "react-big-calendar";
import styled from "styled-components";
import { format } from "date-fns";
import LeftArrow from "../assets/left.svg";
import RightArrow from "../assets/right.svg";
import CalendarIcon from "../assets/Vector.svg";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const CurrentDate = styled.div`
  display: flex;
  align-items: center;
`;

const DateText = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
`;

const ControlIcon = styled.img`
  width: 20px;
  cursor: pointer;
`;

const TodayButton = styled.button`
  font-family: Inter, sans-serif;
  justify-content: center;
  border-radius: var(--borderRadius-max, 1000px);
  background-color: var(--background-secondary, #f7f7f7);
  margin-top: 8px;
  font-weight: 600;
  white-space: nowrap;
  padding: 6px 16px;
`;

const CalendarIconImg = styled.img`
  width: 20px;
  margin-right: 20px;
`;

const MainView = styled.div`
  display: flex;
  flex-direction: row;
`;

const CustomToolbar: React.FC<ToolbarProps> = ({ date, onNavigate }) => {
  const formattedDate = format(date, "MMMM dd, yyyy");

  return (
    <ToolbarContainer>
      <TodayButton onClick={() => onNavigate("TODAY")}>
        Today
      </TodayButton>
      <MainView>
        <CurrentDate>
          <CalendarIconImg src={CalendarIcon} alt="Calendar icon" />
          <DateText>{formattedDate}</DateText>
        </CurrentDate>
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
