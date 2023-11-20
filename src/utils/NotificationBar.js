import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const NotificationBar = ({ state, setState, severity }) => {
    return (
        <div>
            <Snackbar
                open={!!state}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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