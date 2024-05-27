import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import { userLoggedIn } from '../../redux/features/auth/authSlice';

export default function GoogleLogin({ from, text }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    let loginWindow;
    const navigate = useNavigate();



    const handleGoogle = () => {
        setLoading(true);
        const width = 500;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;

        loginWindow = window.open(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/auth/google`,
            '_blank',
            `width=${width},height=${height},top=${top},left=${left}`
        );    
    }
    useEffect(() => {
        const handleFocus = () => {
            if (loginWindow && loginWindow.closed) {
                setLoading(false);
            }
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [loginWindow]);
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== import.meta.env.VITE_REACT_APP_BASE_URL) return;
            // Handle server response
            const { data } = event.data;

            // Update user interface...
            console.log(event, 'data from google login', from.pathname);
            // Save the accessToken in local storage
            localStorage.setItem('accessToken', `Bearer ${data?.accessToken}`);
            dispatch(
                userLoggedIn({
                    user: data,
                    userLoggedIn: data?.name ? true : false
                })
            )

            setLoading(false);
            console.log('checking routes from google login', from.pathname);
            navigate(`${from.pathname}`);


            loginWindow.close();
        };

        window.addEventListener('message', handleMessage);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [dispatch, navigate, from.pathname, loginWindow]);

    return (
        <Button
            fullWidth
            size="large"
            variant="outlined"
            onClick={handleGoogle}
            disabled={loading}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                padding: '10px 20px',
                color: '#DF3E30',
                borderColor: '#DF3E30',

                '&:hover': {
                    backgroundColor: '#DF3E30',
                    color: '#fff',
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 1 }}>
                <Iconify icon="eva:google-fill" width={22} height={22} />
            </Box>
            {text} with Google
        </Button>
    );
}