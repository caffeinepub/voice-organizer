import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ReminderEditor from './ReminderEditor';
import RemindersList from './RemindersList';
import DueNowPanel from './DueNowPanel';

export default function RemindersView() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Reminders</h2>
          <p className="text-muted-foreground">Organize your tasks with voice and notifications</p>
        </div>
        <Button onClick={() => setShowEditor(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Reminder
        </Button>
      </div>

      <DueNowPanel />
      <RemindersList />

      <ReminderEditor open={showEditor} onClose={() => setShowEditor(false)} />
    </div>
  );
}
