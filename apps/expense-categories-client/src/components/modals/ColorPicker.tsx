import React from 'react';
import { Box } from '@mui/material';
import { colorMapping } from '../../core/colorMapping';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <Box display="flex" flexWrap="wrap">
      {Object.keys(colorMapping).map((color) => (
        <Box
          key={color}
          onClick={() => onSelectColor(color)}
          sx={{
            width: 24,
            height: 24,
            backgroundColor: colorMapping[color],
            border: selectedColor === color ? '2px solid black' : '1px solid gray',
            cursor: 'pointer',
            margin: '2px',
          }}
        />
      ))}
    </Box>
  );
};

export default ColorPicker;
