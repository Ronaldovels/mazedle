// src/components/ResetTimer.tsx
import { useState, useEffect } from 'react';
import { getTimeUntilReset } from '../utils/gameLogic';

export function ResetTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilReset());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <p className="text-stone-400 font-medium mb-2 uppercase tracking-wide text-sm">Next Glader in:</p>
      <p className="text-3xl font-bold font-mono text-green-400 tracking-wider">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </p>
    </div>
  );
}