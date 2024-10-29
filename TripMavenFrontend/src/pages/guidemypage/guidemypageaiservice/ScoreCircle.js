import * as React from 'react';
import { Gauge, gaugeClasses} from '@mui/x-charts/Gauge';
import { useState, useEffect } from 'react';

export default function ScoreCircle({score}) {
  const [animatedScore, setAnimatedScore] = useState(0);


  const settings = {
    width: 220,
    height: 220,
    value: animatedScore,
    min: 0,
    max: 100,
  };
    useEffect(() => {
    let startValue = 0;
    const increment = score / 100; 

    const interval = setInterval(() => {
      startValue += increment;
      const roundedValue = Math.round(startValue);
      if (roundedValue >= score) {
        startValue = score;
        clearInterval(interval);
      }
      setAnimatedScore(roundedValue);
    }, 10); 

    return () => clearInterval(interval);
  }, [score]);

  return (
    <Gauge
      {...settings}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 60,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#0066ff',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: '#fffff',
        },
        [`& .${gaugeClasses.root}`]: {
          strokeLinecap: 'round',
        },
      })}
    />
  );
}