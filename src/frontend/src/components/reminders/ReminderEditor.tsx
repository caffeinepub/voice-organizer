import { useState, useEffect } from 'react';
import { useCreateReminder, useUpdateReminder } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import MicButton from '../voice/MicButton';
import { toast } from 'sonner';
import type { Reminder } from '../../backend';

interface ReminderEditorProps {
  open: boolean;
  onClose: () => void;
  reminder?: Reminder;
}

export default function ReminderEditor({ open, onClose, reminder }: ReminderEditorProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const { mutate: createReminder, isPending: isCreating } = useCreateReminder();
  const { mutate: updateReminder, isPending: isUpdating } = useUpdateReminder();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setNotes(reminder.notes || '');
      if (reminder.dueDate) {
        const date = new Date(Number(reminder.dueDate) / 1_000_000);
        setDueDate(date.toISOString().split('T')[0]);
        setDueTime(date.toTimeString().slice(0, 5));
      }
    } else {
      setTitle('');
      setNotes('');
      setDueDate('');
      setDueTime('');
    }
  }, [reminder, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    let dueDateBigInt: bigint | undefined;
    if (dueDate) {
      const dateTime = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T00:00`;
      dueDateBigInt = BigInt(new Date(dateTime).getTime()) * BigInt(1_000_000);
    }

    if (reminder) {
      updateReminder(
        { id: reminder.id, title: title.trim(), notes: notes.trim() || undefined, dueDate: dueDateBigInt },
        {
          onSuccess: () => {
            toast.success('Reminder updated!');
            onClose();
          },
          onError: () => {
            toast.error('Failed to update reminder');
          },
        }
      );
    } else {
      createReminder(
        { title: title.trim(), notes: notes.trim() || undefined, dueDate: dueDateBigInt },
        {
          onSuccess: () => {
            toast.success('Reminder created!');
            onClose();
          },
          onError: () => {
            toast.error('Failed to create reminder');
          },
        }
      );
    }
  };

  const handleTitleTranscript = (text: string) => {
    setTitle(prev => prev ? `${prev} ${text}` : text);
  };

  const handleNotesTranscript = (text: string) => {
    setNotes(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{reminder ? 'Edit Reminder' : 'New Reminder'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to remember?"
                disabled={isPending}
                className="flex-1"
              />
              <MicButton onTranscript={handleTitleTranscript} size="icon" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <div className="flex gap-2">
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional details..."
                disabled={isPending}
                className="flex-1 min-h-[100px]"
              />
              <MicButton onTranscript={handleNotesTranscript} size="icon" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : reminder ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
