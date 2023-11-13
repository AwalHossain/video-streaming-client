import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Checkbox, IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { useLoginMutation } from '../../../redux/features/auth/authApi';
import NotificationBar from '../../../utils/NotificationBar';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null)


  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };

  const [login, { isLoading, error: loginErr, data }] = useLoginMutation()


  const handleSubmit = async (event) => {
    event.preventDefault();
    // handleClick();

    const data = {
      email,
      password
    };

    try {
      const response = await login(data).unwrap()
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

  console.log(error, 'error');

  return (
    <>
      {
        error && <NotificationBar severity="error" sx={{ mt: 3 }} state={error} setState={setError} />

      }
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="email"
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
          />

          <TextField
            name="password"
            label="Password"
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
            Forgot password?
          </Link>
        </Stack>
        {
          isLoading ? <LoadingButton fullWidth size="large" type="submit" variant="contained" loading /> :
            <LoadingButton fullWidth size="large" type="submit" variant="contained" >
              Login </LoadingButton>
        }
      </form>
    </>
  );
}
