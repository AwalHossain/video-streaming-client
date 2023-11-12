import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Checkbox, IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { useRegisterMutation } from '../../../redux/features/auth/authApi';
import NotificationBar from '../../../utils/NotificationBar';

// ----------------------------------------------------------------------

export default function RegistrationForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null)
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
            console.log(response)
            handleClick()
        } catch (err) {
            if (err.status === 'FETCH_ERROR') {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(err.data?.message || err.message);
            }
        }

    }


    return (
        <>
            {
                error && <NotificationBar severity="error" sx={{ mt: 3 }} state={error} setState={setError} />

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

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <Checkbox name="remember" label="Remember me" />
                    <Link variant="subtitle2" underline="hover">
                        Already Registered? Login
                    </Link>
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
