// Notification.js

import { Alert, Snackbar } from '@mui/material';

export default function Notify({ msg, handleClose }) {
    return (
        msg &&
        <Snackbar open={Boolean(msg)} autoHideDuration={3000} onClose={handleClose}
            sx={{ zIndex: 9999 }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert variant='filled' onClose={handleClose} severity={"error"} sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>
    );
}