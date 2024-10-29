import React from 'react';

import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
    return (
        <div 
            style={{
                display:'flex', flexDirection:'column', 
                alignItems:'center', justifyContent:'center', 
                height:'74vh', }}>
            <Box >
                <CircularProgress />
            </Box>
        </div>

    );
};

export default Loading;