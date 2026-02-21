import { useState } from 'react';
import { useSendMessage } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import MicButton from '../voice/MicButton';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function MessageComposer() {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      toast.error('Please enter a recipient Principal ID');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    sendMessage(
      { recipient: recipient.trim(), content: content.trim() },
      {
        onSuccess: () => {
          toast.success('Message sent!');
          setContent('');
          setRecipient('');
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to send message');
        },
      }
    );
  };

  const handleContentTranscript = (text: string) => {
    setContent(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
      </CardHeader>
      <CardContent>
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
              Enter the Principal ID of the user you want to send this message to. They can find their Principal ID in their profile.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <div className="flex gap-2">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message or use voice..."
                disabled={isPending}
                className="flex-1 min-h-[100px]"
              />
              <MicButton onTranscript={handleContentTranscript} size="icon" />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full gap-2">
            <Send className="w-4 h-4" />
            {isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
