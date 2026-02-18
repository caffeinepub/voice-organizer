import { useDeleteMessage } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Message } from '../../backend';

interface MessagesListProps {
  messages: Message[];
}

export default function MessagesList({ messages }: MessagesListProps) {
  const { mutate: deleteMessage } = useDeleteMessage();

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessage(id, {
        onSuccess: () => toast.success('Message deleted'),
        onError: () => toast.error('Failed to delete message'),
      });
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No messages yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map(message => {
        return (
          <Card key={message.id.toString()}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {message.isReminder && (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        Reminder
                      </Badge>
                    )}
                  </div>
                  <p className="mb-2">{message.content}</p>
                  {message.reminder && (
                    <div className="bg-muted p-3 rounded-lg mt-2">
                      <h4 className="font-semibold text-sm mb-1">{message.reminder.title}</h4>
                      {message.reminder.notes && (
                        <p className="text-sm text-muted-foreground">{message.reminder.notes}</p>
                      )}
                      {message.reminder.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(Number(message.reminder.dueDate) / 1_000_000).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(message.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
