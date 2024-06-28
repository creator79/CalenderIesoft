// ThreePartsLayout.tsx
import React from 'react';
import { Container, Part } from './WebCalender.styles';
import DrawerCalender from './DrawerCalender';

const WebCalender: React.FC = () => {
  return (
    <Container>
      <Part>Part 1</Part>
      <Part>Part 2</Part>
      <Part>
        <DrawerCalender />
      </Part>
    </Container>
  );
};

export default WebCalender;
