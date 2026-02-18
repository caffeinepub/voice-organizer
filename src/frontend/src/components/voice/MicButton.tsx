import { useSpeechToText } from '../../hooks/useSpeechToText';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface MicButtonProps {
  onTranscript: (text: string) => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function MicButton({ onTranscript, size = 'default' }: MicButtonProps) {
  const { isListening, transcript, isSupported, error, startListening, stopListening, resetTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="outline"
        size={size}
        disabled
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={isListening ? 'default' : 'outline'}
      size={size}
      onClick={isListening ? stopListening : startListening}
      className={isListening ? 'voice-pulse' : ''}
      title={isListening ? 'Stop recording' : 'Start voice dictation'}
    >
      {isListening ? <Mic className="w-4 h-4 text-destructive" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
}
