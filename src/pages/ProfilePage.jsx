import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const ProfilePage = ({ open, onClose }) => {
    // const [open, setOpen] = useState(true);

    // const handleClose = () => {
    //     setOpen(false);
    //     on
    // };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">{"Under Construction"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This page is currently under construction. Please check back later.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProfilePage;