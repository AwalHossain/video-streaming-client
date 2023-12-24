import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { useGetAllVideosQuery } from '../redux/features/video/videoApi';
import VideoForm from './VideoForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'viewsCount', label: 'Views', alignRight: false },
  { id: 'likesCount', label: 'Likes', alignRight: false },
  { id: 'visibility', label: 'visibility', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'createdAt', label: 'Created at', alignRight: false },
  { id: '' },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('createdAt');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [debouncedFilterName, setDebouncedFilterName] = useState(filterName);

  const [isEditing, setIsEditing] = useState(false); // Add state for editing

  const [editingId, setEditingId] = useState(null);


  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterName(filterName);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [filterName]);

  const params = {
    page: page + 1,
    pageSize: rowsPerPage,
    sortBy: orderBy || 'createdAt',
    sortOrder: order,
    searchTerm: debouncedFilterName || "",
  };

  console.log(params, 'params from user page');

  const { isFetching, isLoading, isError, error, data, refetch } = useGetAllVideosQuery(params, { refetchOnReconnect: true, refetchOnMountOrArgChange: true, refetchOnFocus: true, });

  let content;
  let USERLIST = data?.data || [];

  console.log(data, 'data from user page');

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpen(event.currentTarget);
    setEditingId(id)
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title) => {
    console.log(title, 'title from the clinck');
    const selectedIndex = selected.indexOf(title);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    console.log(newPage, 'newPage');
    setPage(parseInt(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    console.log(event.target.value, 'event.target.value');
  };

  const handleEdit = (id) => {
    console.log('edit here ', id);
    handleCloseMenu();
    setEditingId(id);
    setIsEditing(true);
  }

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditingId(null);
  }


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
  console.log(filteredUsers, 'filteredUsers from user page');
  const isNotFound = data?.data?.length === 0;

  return (
    <>
      <Helmet>
        <title> VideoList </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Videos
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Upload New Video
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>

                  {
                    isFetching || isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Box display="flex" justifyContent="center">
                            <CircularProgress />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((row) => {

                        const { _id: id, title, createdAt, status, viewsCount, likesCount, visibility } = row;
                        const selectedVideo = selected.indexOf(title) !== -1;
                        console.log(row, 'row from user page');
                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedVideo}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedVideo} onChange={(event) => handleClick(event, title)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={title} src={"avatarUrl"} />
                                <Typography variant="subtitle2" noWrap>
                                  {title}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{viewsCount}</TableCell>

                            <TableCell align="left">{likesCount}</TableCell>

                            <TableCell align="left">{visibility}</TableCell>

                            <TableCell align="left">
                              <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                            </TableCell>
                            <TableCell align="left">{new Date(createdAt).toLocaleString()}</TableCell>

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id)}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                              </IconButton>
                            </TableCell>
                            <TableCell align="right">
                              <Popover
                                open={Boolean(open)}
                                anchorEl={open}
                                onClose={handleCloseMenu}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                  sx: {
                                    p: 1,
                                    width: 140,
                                    '& .MuiMenuItem-root': {
                                      px: 1,
                                      typography: 'body2',
                                      borderRadius: 0.75,
                                    },
                                  },
                                }}
                              >
                                <MenuItem onClick={() => handleEdit(USERLIST.find(video => video._id === editingId)?._id)}>
                                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                                  {USERLIST.find(video => video._id === editingId)?.title}
                                </MenuItem>

                                <MenuItem sx={{ color: 'error.main' }}>
                                  <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                                  Delete
                                </MenuItem>
                              </Popover>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )
                  }


                  {emptyRows > 0 && page === 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.meta?.totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>


      {
        isEditing && (
          <VideoForm id={editingId} onClose={handleCloseEdit} />
        )
      }
    </>
  );
}
