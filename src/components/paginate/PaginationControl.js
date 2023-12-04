import { Box, Button, Container, MenuItem, Select } from '@mui/material';
import React from 'react';

const PaginationControl = ({
    page,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange
}) => {
    const handlePageChange = (newPage) => {
        onPageChange(newPage);
    }
    const handlePageSizeChange = (e) => {
        const newPageSize = Number(e.target.value);
        onPageSizeChange(newPageSize);
    }

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / pageSize); i++) {
        pageNumbers.push(i);
    }

    return (
        <Box pt={10}>
            <Container maxWidth="lg">
                <Box py={6} display="flex" justifyContent="flex-end" gap={2}>
                    <Box pt={3} display="flex" justifyContent="flex-end" alignItems={'center'} gap={1}>
                        {pageNumbers.map((pageNumber) => (
                            <Button
                                style={{
                                    padding: "0px 8px",
                                    minWidth: "30px",
                                }}
                                onClick={() => handlePageChange(pageNumber)}
                                key={pageNumber}
                                variant={pageNumber === page ? "contained" : "outlined"}
                                size='large'
                            >
                                {pageNumber}
                            </Button>
                        ))}
                        <Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            variant="outlined"
                            color="primary"
                        >
                            <MenuItem value={1}>1 per page</MenuItem>
                            <MenuItem value={2}>2 per page</MenuItem>
                            <MenuItem value={5}>5 per page</MenuItem>
                        </Select>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default PaginationControl