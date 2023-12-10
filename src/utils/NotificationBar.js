import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from 'react';

const NotificationBar = ({ msg, severity }) => {
    const [open, setOpen] = useState(false);

    console.log(msg, 'msg from notification bar');
    useEffect(() => {
        if (msg) {
            setOpen((prevOpen) => true); // Use the functional form of setOpen
        }

    }, [msg]);

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
                {msg}
            </Alert>
        </Snackbar>
    );
}

export default NotificationBar;
