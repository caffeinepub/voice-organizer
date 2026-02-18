import { useEffect, useState } from 'react';
import { useGetReminders } from './useQueries';
import type { Reminder } from '../backend';

export function useDueNowReminders() {
  const { data: reminders = [] } = useGetReminders();
  const [dueNow, setDueNow] = useState<Reminder[]>([]);

  useEffect(() => {
    const checkDueReminders = () => {
      const now = BigInt(Date.now()) * BigInt(1_000_000); // Convert to nanoseconds
      const due = reminders.filter(r => 
        !r.completed && 
        r.dueDate && 
        r.dueDate <= now
      );
      setDueNow(due);
    };

    checkDueReminders();
    const interval = setInterval(checkDueReminders, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [reminders]);

  return dueNow;
}
