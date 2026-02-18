import { useSendReminderAsMessage } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Reminder } from '../../backend';

interface SendReminderDialogProps {
  open: boolean;
  onClose: () => void;
  reminder: Reminder;
}

export default function SendReminderDialog({ open, onClose, reminder }: SendReminderDialogProps) {
  const { mutate: sendReminder, isPending } = useSendReminderAsMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendReminder(
      { reminderId: reminder.id },
      {
        onSuccess: () => {
          toast.success('Reminder sent as message!');
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to send reminder');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Reminder as Message</DialogTitle>
          <DialogDescription>
            Share "{reminder.title}" with everyone
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This reminder will be posted to the shared message board for everyone to see.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
