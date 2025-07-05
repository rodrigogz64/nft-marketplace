import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2, 
      py: 4 
    }}>
      <CircularProgress />
      <Typography>{message}</Typography>
    </Box>
  );
}