import React from "react";
import styled from "styled-components";

type ConsultationCardProps = {
  date: string;
  time: string;
  clientName: string;
  doctorName: string;
  services: string[];
  onClose: () => void;
};

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  date,
  time,
  clientName,
  doctorName,
  services,
  onClose,
}) => {
  return (
    <Card>
     <CloseButton aria-label="Close" onClick={onClose} /> 
      <CardContent>
        <CardHeader>Consultation</CardHeader>
        <CardDate>{`${date} at ${time}`}</CardDate>
        <ViewDetailsButton>
          View details
          <ArrowIcon src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c6a766e483312eeae9ea38c9c3d1e09dc3dba28136e41295ef356af315ef129?apiKey=afe94c951e2f4de1aefc2822430b019d&" alt="" />
        </ViewDetailsButton>
        <InfoSection>
          <InfoItem
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/cafee697523626ecd284c2a2215bddd2d8b6c50a5f2fa8cf5e1ac283ed199b16?apiKey=afe94c951e2f4de1aefc2822430b019d&"
            label="Client"
            value={clientName}
          />
          <InfoItem
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/abce8f3b71557d7d165ee4c6c0f402b4e7d37f878b8e207918edfb8df880e03a?apiKey=afe94c951e2f4de1aefc2822430b019d&"
            label="Scheduled with"
            value={doctorName}
          />
          <InfoItem
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/9e6b94c7ed6b2d77feec6b796320f6e43870bd5bea2abbf2c73b49b8dd10bc73?apiKey=afe94c951e2f4de1aefc2822430b019d&"
            label="Services"
            value={services.join(", ")}
          />
        </InfoSection>
        <Divider />
        <ActionText>
          Want to make a change? <ActionLink>Reschedule</ActionLink> or{" "}
          <ActionLink>cancel</ActionLink>
        </ActionText>
      </CardContent>
    </Card>
  );
};

type InfoItemProps = {
  icon: string;
  label: string;
  value: string;
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <InfoItemWrapper>
    <InfoIcon src={icon} alt="" />
    <InfoContent>
      <InfoLabel>{label}</InfoLabel>
      <InfoValue>{value}</InfoValue>
    </InfoContent>
  </InfoItemWrapper>
);

const Card = styled.article`
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  display: flex;
  width: 100%;
  flex-direction: column;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: url("https://cdn.builder.io/api/v1/image/assets/TEMP/a5b559093e531ae09dc7efe5641429c7aec123e8fd2c000855b892c23ff7f100?apiKey=afe94c951e2f4de1aefc2822430b019d&") no-repeat center;
  background-size: contain;
  width: 20px;
  height: 20px;
  border: none;
  cursor: pointer;
  align-self: flex-end;
  margin: 8px 8px 0 0;
`;

const CardContent = styled.div`
  padding: 16px 20px;
`;

const CardHeader = styled.h2`
  color: #252527;
  font: 700 18px/1.33 Inter, sans-serif;
  margin: 0;
`;

const CardDate = styled.p`
  color: #717171;
  font: 14px/1.43 Inter, sans-serif;
  margin: 4px 0 0;
`;

const ViewDetailsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #043540;
  font: 600 14px/1.43 Inter, sans-serif;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: 8px;
`;

const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const InfoItemWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  color: #717171;
  font: 12px/1.33 Inter, sans-serif;
`;

const InfoValue = styled.span`
  color: #252527;
  font: 14px/1.43 Inter, sans-serif;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e8e8e8;
  margin: 24px 0 20px;
`;

const ActionText = styled.p`
  color: #717171;
  font: 14px/1.43 Inter, sans-serif;
  margin: 0;
   white-space: nowrap; 
`;

const ActionLink = styled.a`
  color: #252527;
  text-decoration: underline;
  cursor: pointer;
`;

export default ConsultationCard;