import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';



export default function ScoreChart() {
    const [seriesNb] = React.useState(5);
    const [itemNb] = React.useState(3);


    return (
      <Box sx={{ width: '100%' }}>
        <BarChart
          height={300}
          series={series
            .slice(0, seriesNb)
            .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
        />
      </Box>
    );
  }
  
  const highlightScope = {
    highlighted: 'series',
    faded: 'global',
  };
  const series = [
    {
        label: '행동',
      data: [
        80,90,75
      ],
      color: '#CCE5FF',
    },
    {
        label: '억양',
      data: [
        77,98,85
      ],
      color: '#9AC9FF',
    },
    {
        label: '대본',
      data: [
        99,55,66
      ],
      color: '#65ADFF',
    },
    {
        label: '행동',
        data: [
          67,88,100
        ],
        color: '#3292FF',
      },
      {
        label: '행동',
        data: [
          99,87,87
        ],
        color: '#0077FF',
      },
  ].map((s) => ({ ...s, highlightScope }));