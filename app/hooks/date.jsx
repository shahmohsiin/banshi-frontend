import { useState, useEffect, useMemo } from 'react';

export default function useTodayString() {
  const [now, setNow] = useState(new Date());

  // Schedule update at midnight
  useEffect(() => {
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

    const timeout = setTimeout(() => {
      setNow(new Date());
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [now]);

  // Memoize the formatted string
  return useMemo(() => {
    let date = new Date()

           const localizedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
    return localizedDate;
  }, [now]);
}
