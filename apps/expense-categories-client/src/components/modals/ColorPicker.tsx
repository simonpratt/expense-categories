import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { colorMapping } from '../../core/colorMapping';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <Box display="flex" flexWrap="wrap">
      {Object.keys(colorMapping).map((color) => (
        <Tooltip key={color} title={color} arrow>
          <Box
            onClick={() => onSelectColor(color)}
            tabIndex={0}
            aria-label={`Select color ${color}`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectColor(color);
              }
            }}
            sx={{
              width: 32,
              height: 32,
              backgroundColor: colorMapping[color],
              border: selectedColor === color ? '3px solid black' : '1px solid gray',
              cursor: 'pointer',
              margin: '4px',
              borderRadius: '4px',
              outline: 'none',
              '&:focus': {
                border: '3px solid blue',
              },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default ColorPicker;
