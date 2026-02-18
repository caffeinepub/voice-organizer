import { useGetMessages } from '../../hooks/useQueries';
import { Card } from '@/components/ui/card';
import MessageComposer from './MessageComposer';
import MessagesList from './MessagesList';

export default function MessagesView() {
  const { data: allMessages = [], isLoading } = useGetMessages();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading messages...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Messages</h2>
        <p className="text-muted-foreground">Share messages and reminders with everyone</p>
      </div>

      <MessageComposer />

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">All Messages ({allMessages.length})</h3>
        <MessagesList messages={allMessages} />
      </div>
    </div>
  );
}
