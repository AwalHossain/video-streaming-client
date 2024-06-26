import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Box, Button, Grid, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from 'react-redux';
import { resetFilters } from '../../redux/features/filter/filterSlice';
import { useGetAllVideosQuery } from '../../redux/features/video/videoApi';
import VideoGridItem from './VideoGridItem';

const VideoGrid = () => {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);


    const { search, sort, tags } = useSelector((state) => state.filter);



    const params = {
        page: page,
        sortBy: 'createdAt',
        sortOrder: sort,
        searchTerm: search,
    };

    if (tags.length > 0) {
        params.tags = tags;
    }

    const dispatch = useDispatch();

    const [showResetButton, setShowResetButton] = useState(false);

    const reset = () => {
        dispatch(resetFilters());
        setPage(1);
        setShowResetButton(false);
    };

    useEffect(() => {
        if (search || tags.length > 0) {
            setShowResetButton(true);
        } else {
            setShowResetButton(false);
        }
    }, [search, tags]);


    const { isFetching, isLoading, isError, error, data, refetch } = useGetAllVideosQuery(params, { refetchOnReconnect: true, refetchOnMountOrArgChange: true, refetchOnFocus: true, });

    const fetchMoreData = () => {
        if (items.length >= data?.meta?.totalRecords) {
            setHasMore(false);
            return;
        }

        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setItems([]);
    }, [tags]);

    useEffect(() => {
        if (page === 1) {
            setItems(data?.data || []);
        } else if (data?.data?.length) {
            const newItems = data.data.filter(
                (item) => !items.some((prevItem) => prevItem._id === item._id)
            );
            setItems(prevItems => [...prevItems, ...newItems]);
        }
    }, [data, page]);

    let content;

    if (isLoading || isFetching) {
        content =
            <Grid container wrap='wrap' spacing={2}>
                {Array.from({ length: 15 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <VideoGridItem key={index} isLoading={isLoading} isFetching={isFetching} />
                    </Grid>
                ))}
            </Grid>
    } else if (isError) {
        content = <div>{error.message}</div>;
    } else if (items.length === 0) {
        content = <div>No data found</div>
    } else if (items.length > 0) {
        content =
            <Grid container wrap='wrap' spacing={2}>
                {items.map((video) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                        <VideoGridItem video={video} />
                    </Grid>
                ))}
            </Grid>
    } else {
        content = (
            <Box
                flexDirection="column"
                // justifyContent="center"
                alignItems="center"
                // height="100vh"
                textAlign="center"
            >
                <Typography variant="h4" component="div" gutterBottom>
                    Something went wrong
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SvgIcon component={RefreshIcon} />}
                    onClick={() => refetch()}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box pt={3}>
                {showResetButton && (
                    <Button onClick={reset}>Reset Filters</Button>
                )}
                <InfiniteScroll
                    style={{ overflow: 'hidden' }}
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                // loader={<h4>Loading...</h4>}
                >
                    {content}
                </InfiniteScroll>
            </Box>
        </Box >
    )
}

export default VideoGrid;