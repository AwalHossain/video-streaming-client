import PropTypes from 'prop-types';
// @mui
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import React from 'react';
import { useSelector } from 'react-redux';
import Logo from '../../../components/logo';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import Searchbar from './Searchbar';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  // [theme.breakpoints.up('lg')]: {
  //   width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  // },
  zIndex: theme.zIndex.drawer + 100,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

function Header({ onOpenNav }) {
  // const { user, loading } = useAuth();
  const { user } = useSelector(state => state.auth);
  console.log('user header index', user);
  return (
    <StyledRoot>
      <StyledToolbar>
        <Logo />


        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <Searchbar />
          <NotificationsPopover />
          <AccountPopover user={user} />
          <IconButton
            onClick={onOpenNav}
            sx={{
              mr: 1,
              color: 'text.primary',
              display: { lg: 'none' },
            }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}


export default React.memo(Header);