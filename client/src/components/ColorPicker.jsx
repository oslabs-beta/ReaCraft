import React, { useState } from 'react';
import { MuiColorInput } from 'mui-color-input';
import { useDispatch } from 'react-redux';
import { updateComponentBorderColor } from '../utils/reducers/designSliceV2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ColorPicker ({ componentId, initialColor = '#000000' }) {
    const dispatch = useDispatch();
    const [color, setColor] = useState(initialColor);

    const handleColorChange = (colorValue, colorObject) => {
        setColor(colorObject.hex);
        dispatch(updateComponentBorderColor({ id: componentId, borderColor: colorObject.hex }));
    };

    return (
        <Box>
            <Typography variant="subtitle2" color="#8D8F94">Border Color</Typography>
            <MuiColorInput
                value={color}
                onChange={handleColorChange}
            />
        </Box>
    );
}