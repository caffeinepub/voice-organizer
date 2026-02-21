import AppLayout from './components/layout/AppLayout';
import RemindersView from './components/reminders/RemindersView';
import MessagesView from './components/messaging/MessagesView';
import LandingPage from './components/landing/LandingPage';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useCurrentUser } from './hooks/useCurrentUser';

export default function App() {
  const [currentView, setCurrentView] = useState<'reminders' | 'messages'>('reminders');
  const { isAuthenticated, userProfile, isLoading: profileLoading, isFetched } = useCurrentUser();

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LandingPage />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup dialog for first-time users
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {showProfileSetup && <ProfileSetupDialog />}
      <AppLayout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'reminders' ? <RemindersView /> : <MessagesView />}
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  );
}
