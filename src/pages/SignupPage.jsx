import { Box, Container, Divider, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/logo';
import useResponsive from '../hooks/useResponsive';
import GoogleLogin from '../sections/auth/GoogleLogin';
import RegistrationForm from '../sections/auth/RegistrationForm';
import { StyledContent, StyledRoot, StyledSection } from '../sections/auth/SignupPageStyles';

export default function SignupPage() {
    const mdUp = useResponsive('up', 'md');
    const locaiton = useLocation();

    const { from } = locaiton.state || { from: { pathname: '/dashboard' } };

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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                paddingRight: 5, // Add some padding to bring the image closer to the form
                            }}
                        >
                            <img src="/assets/signup.png" alt="login" />
                        </Box>
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up in to Reely
                        </Typography>

                        <GoogleLogin from={from} />

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                OR
                            </Typography>
                        </Divider>

                        <RegistrationForm />

                        <Typography variant="body2" sx={{ mt: 3 }}>
                            Already have an account? {''}
                            <Link to='/login'>Login</Link>
                        </Typography>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}