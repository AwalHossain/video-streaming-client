import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Divider, Link as MuiLink, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import { Link, useLocation } from 'react-router-dom';
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
              Sign in to Reely
            </Typography>

            <Typography variant="body2" sx={{ mb: 4, textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <MuiLink component={Link} to='/register' variant="subtitle2">
                Get started
              </MuiLink>
            </Typography>

            <GoogleLogin from={from} text={"Sign in with Google"} />

            <Divider sx={{ my: 3, typography: 'overline', color: 'text.disabled' }}>
              OR
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
