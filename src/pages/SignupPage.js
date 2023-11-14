import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import RegistrationForm from '../sections/auth/login/RegistrationForm';

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

export default function SignupPage() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Sign up </title>
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
                            Hi, There
                        </Typography>
                        <div
                            styled={{
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 'auto',
                            }}
                        >

                            <img
                                src="/assets/signup.png" alt="login" />
                        </div>
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up in to Reely
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Already have an account? {''}
                            <Link variant="subtitle2" href='/login'>Login</Link>
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                SignUp with Google
                            </Button>
                            {/* 
                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                            </Button>

                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                            </Button> */}
                        </Stack>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                OR
                            </Typography>
                        </Divider>

                        <RegistrationForm />
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
