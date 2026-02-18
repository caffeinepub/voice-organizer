import { useDueNowReminders } from '../../hooks/useDueNowReminders';
import { useMarkReminderCompleted } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function DueNowPanel() {
  const dueNow = useDueNowReminders();
  const { mutate: markCompleted } = useMarkReminderCompleted();

  if (dueNow.length === 0) return null;

  const handleComplete = (id: bigint) => {
    markCompleted(id, {
      onSuccess: () => toast.success('Reminder completed!'),
      onError: () => toast.error('Failed to mark as completed'),
    });
  };

  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          Due Now ({dueNow.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dueNow.map(reminder => (
          <div key={reminder.id.toString()} className="flex items-center justify-between p-3 bg-card rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold">{reminder.title}</h4>
              {reminder.notes && (
                <p className="text-sm text-muted-foreground">{reminder.notes}</p>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => handleComplete(reminder.id)}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Complete
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
