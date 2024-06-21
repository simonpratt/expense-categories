import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Button } from '@dtdot/lego';

export interface AICategorisationBannerProps {
  onStartCategorisation: () => void;
}

const AICategorisationBanner = ({ onStartCategorisation }: AICategorisationBannerProps) => {
  return (
    <Paper elevation={1} sx={{ mb: 2, mt: 1 }}>
      <Box display='flex' alignItems='center' justifyContent='space-between' p={2}>
        <Box display='flex' alignItems='center'>
          <AutoFixHighIcon sx={{ fontSize: 40, mr: 2, color: 'primary' }} />
          <Box>
            <Typography variant='h6' component='h3'>
              AI-Powered Categorization
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Let AI help you categorize your transactions quickly and accurately.
            </Typography>
          </Box>
        </Box>
        <Button variant='primary' onClick={onStartCategorisation}>
          Start Now
        </Button>
      </Box>
    </Paper>
  );
};

export default AICategorisationBanner;
