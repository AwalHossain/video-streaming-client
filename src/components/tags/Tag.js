import Chip from '@mui/material/Chip';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tagRemoved, tagSelected } from '../../redux/features/filter/filterSlice';

const Tag = ({ tag }) => {
    const dispatch = useDispatch();

    const { tags: selectedTags = [] } = useSelector(state => state.filter || {});

    const isSelected = selectedTags.includes(tag?.name);

    const handleSelectTag = () => {
        console.log('checking tag', isSelected, tag?.name, selectedTags);
        if (isSelected) {
            dispatch(tagRemoved(tag?.name))
        } else {
            dispatch(tagSelected(tag?.name))
        }
    };

    return (
        <Chip
            label={tag?.name}
            color={isSelected ? 'primary' : 'default'}
            onClick={handleSelectTag}
            variant="outlined"
        />
    );
};

export default Tag;