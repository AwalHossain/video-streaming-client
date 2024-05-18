import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NotificationBar = () => {
    const { message, severity } = useSelector(state => state.notification);
    console.log(message, 'msg from notification bar');
    const [open, setOpen] = useState(false);

    console.log(message, 'msg from notification bar');
    useEffect(() => {
        if (message) {
            setOpen((prevOpen) => true); // Use the functional form of setOpen
        }

    }, [message]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
            sx={{
                zIndex: 9999,
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default NotificationBar;
