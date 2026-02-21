import { useGetMessages } from '../../hooks/useQueries';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MessageComposer from './MessageComposer';
import MessagesList from './MessagesList';

export default function MessagesView() {
  const { data: messages = [], isLoading } = useGetMessages();
  const { principal } = useCurrentUser();

  const handleCopyPrincipal = () => {
    if (principal) {
      navigator.clipboard.writeText(principal);
      toast.success('Principal ID copied to clipboard');
    }
  };

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
        <p className="text-muted-foreground">Send private messages to other users</p>
      </div>

      {principal && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">Your Principal ID</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{principal}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPrincipal}
              className="gap-2 shrink-0"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this ID with others so they can send you messages
          </p>
        </Card>
      )}

      <MessageComposer />

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Your Messages ({messages.length})</h3>
        <MessagesList messages={messages} />
      </div>
    </div>
  );
}
