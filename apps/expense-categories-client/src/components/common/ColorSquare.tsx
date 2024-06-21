import React from 'react';
import { styled } from '@mui/system';

const ColorSquareStyled = styled('div')(({ color }) => ({
  width: 20,
  height: 20,
  backgroundColor: color,
}));

interface ColorSquareProps {
  color: string;
}

const ColorSquare: React.FC<ColorSquareProps> = ({ color }) => {
  return <ColorSquareStyled color={color} />;
};

export default ColorSquare;
