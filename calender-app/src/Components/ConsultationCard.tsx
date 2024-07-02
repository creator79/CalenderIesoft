import React from "react";
import styled from "styled-components";
import ClosedIcon from "../assets/close.svg";
import LinkIcon from "../assets/Vector(4).svg";
import Services from "../assets/Vector(3).svg";
import Scheduled from "../assets/Vector(2).svg";
import Account from "../assets/Vector(1).svg";


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
      <CloseButton aria-label="Close" onClick={onClose}>
        <ClosedIconWrapper src={ClosedIcon} alt="Close" />
      </CloseButton>
      <CardContent>
        <CardHeader>Consultation</CardHeader>
        <CardDate>{`${date} , ${time}`}</CardDate>
        <ViewDetailsButton>
          View details
          <ArrowIcon
            src={LinkIcon}
            alt=""
          />
        </ViewDetailsButton>
        <InfoSection>
          <InfoItem
            icon={Account}
            label="Client"
            value={clientName}
          />
          <InfoItem
            icon={Scheduled}
            label="Scheduled with"
            value={doctorName}
          />
          <InfoItem
            icon={Services}
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
  flex-direction: column;
  font-weight: 500;
  max-width: 100%;
  width: 320px;
  margin: 0 auto;

  @media (min-width: 400px) {
    width: 360px;
  }

  @media (min-width: 768px) {
    width: 400px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-end;
  padding: 16px 16px 0 0;
`;

const ClosedIconWrapper = styled.img`
  width: 20px;
  height: 20px;
`;

const CardContent = styled.div`
  padding: 16px 20px;
  font-weight: 500;
`;

const CardHeader = styled.h2`
  color: #252527;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  margin: 0;
`;

const CardDate = styled.p`
  color: #717171;
  margin: 4px 0 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const ViewDetailsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #043540;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: 8px;
`;

const ArrowIcon = styled.img`
  width: 8px;
  height: 8px;
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
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.span`
  color: #717171;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;

const InfoValue = styled.span`
  color: #252527;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e8e8e8;
  margin: 24px 0 20px;
`;

const ActionText = styled.p`
  color: #717171;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
`;

const ActionLink = styled.a`
  color: #252527;
  text-decoration: underline;
  cursor: pointer;
`;

export default ConsultationCard;
