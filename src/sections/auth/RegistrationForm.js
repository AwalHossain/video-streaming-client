import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Checkbox, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { useRegisterMutation } from '../../redux/features/auth/authApi';
import Notify from './Notify';

// ----------------------------------------------------------------------

export default function RegistrationForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState(null)
    const handleClick = () => {
        navigate('/dashboard', { replace: true });
    };

    const [register, { isLoading, error: RegErr, data }] = useRegisterMutation()


    const handleSubmit = async (event) => {
        event.preventDefault();
        // handleClick();

        const data = {
            name,
            email,
            password
        };

        try {
            const response = await register(data).unwrap()
            console.log(response, 'response from register', msg);
            setMsg(response?.message)
            if (response?.data?.name) {
                handleClick()
            }
            if (response?.data?.name) {
                handleClick()
            }
        } catch (err) {
            if (err.status === 'FETCH_ERROR') {
                setMsg('Network error. Please check your internet connection and try again.');
            } else {
                setMsg(err.data?.message || err.message);
            }
        }

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setMsg(null);
    }



    return (
        <>
            {
                msg && < Notify msg={msg} handleClose={handleClose} />

            }
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        name="setName"
                        type='text'
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="Your Name"
                    />
                    <TextField
                        name="email"
                        type='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email address"
                    />

                    <TextField
                        name="password"
                        label="Password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="" sx={{ my: 2 }}>
                    <Checkbox name="remember" label="Remember me" /> Remember Me
                </Stack>

                {
                    isLoading ? <LoadingButton fullWidth size="large" type="submit" variant="contained" loading /> :
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" >
                            Register </LoadingButton>
                }
            </form>
        </>
    );
}
