import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import GoogleLogin from '../sections/auth/GoogleLogin';
import LoginForm from '../sections/auth/LoginForm';
// sections

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // boxShadow: theme.customShadows.card,
  // backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const locaiton = useLocation();
  const navigate = useNavigate();

  const { from } = locaiton.state || { from: { pathname: '/dashboard' } };

  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img src="/assets/login.png" alt="login" />
            </div>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to Minimal
            </Typography>

            <GoogleLogin from={from} />

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm />

            <Typography variant="body2" sx={{ mt: 3 }}>
              Don't have an account?{''}
              <Link to='/register'>Register</Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
