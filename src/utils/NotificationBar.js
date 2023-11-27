import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const NotificationBar = ({ state, setState, severity }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        // setState("");
    }
    return (
        <div>
            <Snackbar
                open={!!state}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handleClose}
            >
                <Alert
                    variant="filled"
                    severity={severity || ""}
                >
                    {state}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default NotificationBar