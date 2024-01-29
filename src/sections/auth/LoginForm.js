import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { useLoginMutation } from '../../redux/features/auth/authApi';
import Notify from './Notify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null)


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
      const response = await login(data).unwrap();
      console.log(response, 'response from login');
      setMsg(response?.message)

      if (response?.data?.name) {
        // Store the accessToken in local storage
        localStorage.setItem('accessToken', `Bearer ${response?.data?.accessToken}`);
        handleClick()
      }
    } catch (err) {
      console.log(err, 'err from login', loginErr);

      if (err.status === 'FETCH_ERROR') {
        setMsg('Network error. Please check your internet connection and try again.');
      } else {
        setMsg(err.data?.message || err.message || loginErr.message);
      }
    }

  };

  const handleTestAccountLogin = async () => {
    setEmail('test@test.com');
    setPassword('123456');

    const data = {
      email: 'test@test.com',
      password: '123456'
    };

    try {
      const response = await login(data).unwrap();
      console.log(response, 'response from login');
      setMsg(response?.message)

      if (response?.data?.name) {
        // Store the accessToken in local storage
        localStorage.setItem('accessToken', `Bearer ${response?.data?.accessToken}`);
        handleClick()
      }
    } catch (err) {
      console.log(err, 'err from login', loginErr);

      if (err.status === 'FETCH_ERROR') {
        setMsg('Network error. Please check your internet connection and try again.');
      } else {
        setMsg(err.data?.message || err.message || loginErr.message);
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
        < Notify msg={msg} handleClose={handleClose} />

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
          {/* <Checkbox name="remember" label="Remember me" /> */}
          <Link variant="subtitle2" underline="hover" style={{
            cursor: 'pointer '
          }}>
            Forgot password?
          </Link>
        </Stack>

        {
          isLoading ? <LoadingButton fullWidth size="large" type="submit" variant="contained" loading /> :
            <LoadingButton fullWidth size="large" type="submit" variant="contained" >
              Login </LoadingButton>
        }
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Button variant="contained" onClick={handleTestAccountLogin}
            fullWidth
            size="large"
            type="submit"
          >
            Use Trial Account
          </Button>
        </Stack>
      </form>
    </>
  );
}
