import React from "react";
import styled from "styled-components";

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <LegendItemWrapper>
    <ColorIndicator color={color} />
    <LegendLabel>{label}</LegendLabel>
  </LegendItemWrapper>
);

const LegendCard: React.FC = () => {
  const legendItems: LegendItemProps[] = [
    { color: " #009a51", label: "Consultation" },
    { color: " #068bee", label: "Service" },
  ];

  return (
    <Card>
      <LegendContainer>
        {legendItems.map((item, index) => (
          <LegendItem key={index} color={item.color} label={item.label} />
        ))}
      </LegendContainer>
    </Card>
  );
};

const Card = styled.section`
  justify-content: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  padding : 10px;
`;

const LegendContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: start;
`;

const LegendItemWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const ColorIndicator = styled.span<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

const LegendLabel = styled.span`
  font-family: Inter, sans-serif;
  margin: auto 0;
`;

export default LegendCard;
