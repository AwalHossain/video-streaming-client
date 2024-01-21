import { useState } from 'react';
// @mui
import { Avatar, Box, Divider, IconButton, MenuItem, Popover, Stack, Typography } from '@mui/material';
// mocks_
import { Link, useNavigate } from 'react-router-dom';
import ProfilePage from '../../../pages/ProfilePage';
import { useLogoutMutation } from '../../../redux/features/auth/authApi';
import { disconnectSocket } from '../../../redux/features/socket/socketApi';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export default function AccountPopover({ user }) {

  const [open, setOpen] = useState(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const [logout] = useLogoutMutation();

  const handleClose = () => {
    setOpen(null);
  };

  const handleHome = () => {
    navigate('/', { replace: true });
    handleClose();
  }

  const handlProfile = () => {
    setProfileModalOpen(true);
    // handleClose();
  }

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const handleLogOut = async () => {
    try {
      await logout().unwrap();
      // delete the cookie
      localStorage.removeItem('accessToken');
      disconnectSocket();
      handleClose();
      navigate('/login', { replace: true });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              // bgcolor: "royalblue"
            },
          }),
        }}
      >
        <Avatar>
          {user?.avatar
            ? <img src={user.avatar} alt="user avatar" />
            : user?.name
              ? user.name[0].toUpperCase()
              : (
                <Avatar src={"GGGGGGGGGGGGGGGGG"} alt="photoURL" />
              )
          }
        </Avatar>
      </IconButton>


      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >

        {
          user?.name ? (
            <>
              <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" noWrap>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack sx={{ p: 1 }}>
                <MenuItem onClick={handleHome} >
                  Home
                </MenuItem>
                <MenuItem onClick={handlProfile}>
                  Profile
                </MenuItem>
                <ProfilePage open={isProfileModalOpen} onClose={handleProfileModalClose} />
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <MenuItem onClick={handleLogOut} sx={{ m: 1 }}>
                Logout
              </MenuItem>
            </>

          ) : (
            <MenuItem onClick={handleLogOut} sx={{ m: 1, textAlign: "center" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>

                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "center" }} noWrap>
                  Login
                </Typography>
              </Link>
            </MenuItem>
          )
        }
      </Popover>



    </>
  );
}
