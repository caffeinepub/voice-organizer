import { useState } from 'react';
import { useGetReminders, useMarkReminderCompleted, useDeleteReminder } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Send, Volume2 } from 'lucide-react';
import ReminderEditor from './ReminderEditor';
import SendReminderDialog from './SendReminderDialog';
import ReminderSpeakButton from './ReminderSpeakButton';
import { toast } from 'sonner';
import type { Reminder } from '../../backend';

type FilterType = 'all' | 'upcoming' | 'completed';

export default function RemindersList() {
  const { data: reminders = [], isLoading } = useGetReminders();
  const { mutate: markCompleted } = useMarkReminderCompleted();
  const { mutate: deleteReminder } = useDeleteReminder();
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();
  const [sendingReminder, setSendingReminder] = useState<Reminder | undefined>();

  const filteredReminders = reminders.filter(r => {
    if (filter === 'completed') return r.completed;
    if (filter === 'upcoming') return !r.completed;
    return true;
  });

  const handleToggleComplete = (reminder: Reminder) => {
    if (!reminder.completed) {
      markCompleted(reminder.id, {
        onSuccess: () => toast.success('Reminder completed!'),
        onError: () => toast.error('Failed to mark as completed'),
      });
    }
  };

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder(id, {
        onSuccess: () => toast.success('Reminder deleted'),
        onError: () => toast.error('Failed to delete reminder'),
      });
    }
  };

  const formatDueDate = (dueDate?: bigint) => {
    if (!dueDate) return null;
    const date = new Date(Number(dueDate) / 1_000_000);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isPast = date < now;

    return {
      text: isToday ? `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : date.toLocaleString(),
      isPast,
      isToday,
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({reminders.length})
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
            size="sm"
          >
            Upcoming ({reminders.filter(r => !r.completed).length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            size="sm"
          >
            Completed ({reminders.filter(r => r.completed).length})
          </Button>
        </div>

        {filteredReminders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {filter === 'completed' ? 'No completed reminders yet' : 'No reminders yet. Create your first one!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map(reminder => {
              const dueInfo = formatDueDate(reminder.dueDate);
              return (
                <Card key={reminder.id.toString()} className={reminder.completed ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={reminder.completed}
                        onCheckedChange={() => handleToggleComplete(reminder)}
                        disabled={reminder.completed}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 ${reminder.completed ? 'line-through' : ''}`}>
                          {reminder.title}
                        </h3>
                        {reminder.notes && (
                          <p className="text-sm text-muted-foreground mb-2">{reminder.notes}</p>
                        )}
                        {dueInfo && (
                          <Badge variant={dueInfo.isPast && !reminder.completed ? 'destructive' : 'secondary'}>
                            {dueInfo.text}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <ReminderSpeakButton reminder={reminder} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSendingReminder(reminder)}
                          title="Send as message"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingReminder(reminder)}
                          disabled={reminder.completed}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(reminder.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {editingReminder !== undefined && (
        <ReminderEditor
          open={true}
          onClose={() => setEditingReminder(undefined)}
          reminder={editingReminder}
        />
      )}

      {sendingReminder && (
        <SendReminderDialog
          open={true}
          onClose={() => setSendingReminder(undefined)}
          reminder={sendingReminder}
        />
      )}
    </>
  );
}
