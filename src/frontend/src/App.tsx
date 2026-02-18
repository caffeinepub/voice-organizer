import AppLayout from './components/layout/AppLayout';
import RemindersView from './components/reminders/RemindersView';
import MessagesView from './components/messaging/MessagesView';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [currentView, setCurrentView] = useState<'reminders' | 'messages'>('reminders');

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppLayout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'reminders' ? <RemindersView /> : <MessagesView />}
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  );
}
