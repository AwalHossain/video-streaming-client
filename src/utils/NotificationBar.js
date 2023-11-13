

import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const NotificationBar = ({ state, setState, severity }) => {
    console.log(state, 'state');
    return (
        <div>
            <Snackbar
                open={!!state}
                autoHideDuration={5000}
                onClose={() => {
                    setState(null);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    variant="filled"
                    onClose={() => {
                        setState(null);
                    }}
                    severity={severity}
                >
                    {state}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default NotificationBar