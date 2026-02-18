import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import type { Reminder } from '../../backend';

interface ReminderSpeakButtonProps {
  reminder: Reminder;
}

export default function ReminderSpeakButton({ reminder }: ReminderSpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      let text = `Reminder: ${reminder.title}`;
      if (reminder.notes) {
        text += `. ${reminder.notes}`;
      }
      if (reminder.dueDate) {
        const date = new Date(Number(reminder.dueDate) / 1_000_000);
        text += `. Due ${date.toLocaleString()}`;
      }
      speak(text);
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title="Text-to-speech not supported"
      >
        <VolumeX className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
      className={isSpeaking ? 'voice-pulse' : ''}
    >
      <Volume2 className="w-4 h-4" />
    </Button>
  );
}
