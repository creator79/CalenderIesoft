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
    { color: "var(--Green-Green600, #009a51)", label: "Consultation" },
    { color: "var(--Blue-Blue600, #068bee)", label: "Service" },
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
  box-shadow: var(--elevation-shadowAbove-x-value, 0px) var(--elevation-shadowAbove-y-vlaue, -4px) var(--elevation-shadowAbove-blur, 16px) var(--elevation-shadowAbove-spread, 0px) var(--shadowLighter, rgba(0, 0, 0, 0.04));
  border: 1px solid rgba(247, 247, 247, 1);
  border-top-width: 1px;
  background-color: var(--background-primary, #fff);
  display: flex;
  max-width: 418px;
  flex-direction: column;
  font-size: 12px;
  color: var(--text-primary_onLight, #252527);
  font-weight: 500;
  text-align: center;
  line-height: 133%;
  padding: 18px 20px;
`;

const LegendContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: start    ;
`;

const LegendItemWrapper = styled.div`
  display: flex;
  gap: 12px;
  white-space: nowrap;
`;

const ColorIndicator = styled.span<{ color: string }>`
  border-radius: var(--border-radius-small-4-px, 4px);
  border: 1px solid rgba(232, 232, 232, 1);
  background-color: ${props => props.color};
  width: 20px;
  height: 20px;
`;

const LegendLabel = styled.span`
  font-family: Inter, sans-serif;
  margin: auto 0;
`;

export default LegendCard;
