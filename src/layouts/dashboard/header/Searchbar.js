import { useState } from 'react';
// @mui
import { Button, ClickAwayListener, IconButton, Input, InputAdornment, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// component
import { useDispatch } from 'react-redux';
import Iconify from '../../../components/iconify';
import { setSearchFilter } from '../../../redux/features/filter/filterSlice';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search, "search");
    dispatch(setSearchFilter(search));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  }


  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <form onSubmit={handleSubmit}>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              />
              <Button type='submit' variant="contained">
                Search
              </Button>
            </form>

          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
