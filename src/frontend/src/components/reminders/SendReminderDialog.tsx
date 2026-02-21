import { useState } from 'react';
import { useSendReminderAsMessage } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Reminder } from '../../backend';

interface SendReminderDialogProps {
  open: boolean;
  onClose: () => void;
  reminder: Reminder;
}

export default function SendReminderDialog({ open, onClose, reminder }: SendReminderDialogProps) {
  const [recipient, setRecipient] = useState('');
  const { mutate: sendReminder, isPending } = useSendReminderAsMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient.trim()) {
      toast.error('Please enter a recipient Principal ID');
      return;
    }

    sendReminder(
      { recipient: recipient.trim(), reminderId: reminder.id },
      {
        onSuccess: () => {
          toast.success('Reminder sent as message!');
          onClose();
          setRecipient('');
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
            Share "{reminder.title}" with another user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Principal ID</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient's Principal ID"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Enter the Principal ID of the user you want to send this reminder to.
            </p>
          </div>
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
