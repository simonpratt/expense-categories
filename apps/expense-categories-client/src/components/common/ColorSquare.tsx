import React from 'react';
import { styled } from '@mui/system';
import { colorMapping } from '../../core/colorMapping';

const ColorSquareStyled = styled('div')(({ color }) => ({
  width: 20,
  height: 20,
  backgroundColor: color,
}));

interface ColorSquareProps {
  colorKey: string | null;
}

const ColorSquare: React.FC<ColorSquareProps> = ({ colorKey }) => {
  const color = colorKey ? colorMapping[colorKey] : 'grey';
  return <ColorSquareStyled color={color} />;
};

export default ColorSquare;
