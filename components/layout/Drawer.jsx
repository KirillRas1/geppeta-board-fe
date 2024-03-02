import React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProfileDisplayName from 'components/profile/ProfileName';
import { styled } from '@mui/material';

export const drawerWidth = 240;

const DrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px'
});

const DefaultLayoutDrawer = ({ onClick, drawerOpen }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
    >
      <DrawerHeader>
        <IconButton onClick={onClick}>
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <ProfileDisplayName />
    </Drawer>
  );
};
export default DefaultLayoutDrawer;
