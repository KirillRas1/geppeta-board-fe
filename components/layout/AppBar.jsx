'use client';
import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import GoogleLoginButton from 'components/GoogleLogin';
import { Grid, styled } from '@mui/material';
import { useRouter } from 'next/navigation';
import { authContext } from 'contexts/Auth';
import Image from 'next/image';
import { GitHub } from '@mui/icons-material';
import DefaultLayoutDrawer, { drawerWidth } from './Drawer';

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(
  ({ open }) => ({
    flexGrow: 1,
    padding: '20px',
    transition: 'margin 0.3s ease',
    marginLeft: open ? `-${drawerWidth}px` : 0
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})(({ open }) => ({
  transition: 'width 0.3s ease',
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
  marginLeft: open ? `${drawerWidth}px` : 0
}));

const DefaultLayoutAppBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { displayName } = useContext(authContext);
  const router = useRouter();

  const MenuIconButton = () => {
    if (!displayName) {
      return null;
    }

    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setDrawerOpen(true)}
        edge="start"
        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
    );
  };

  return (
    <>
      <AppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <Grid
            container
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <MenuIconButton />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/website_logo.svg"
                alt="logo"
                width="40"
                height="40"
              />
              <Typography>Geppeta Board</Typography>
              <IconButton href="https://github.com/KirillRas1/geppeta-board-fe">
                <GitHub />
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              onClick={() => router.push('/')}
              sx={{ cursor: 'pointer' }}
            >
              Home Page
            </Typography>
            <GoogleLoginButton />
          </Grid>
        </Toolbar>
      </AppBar>
      <DefaultLayoutDrawer
        onClick={() => setDrawerOpen(false)}
        drawerOpen={drawerOpen}
      />
    </>
  );
};

export default DefaultLayoutAppBar;
