import { Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: 'reminders' | 'messages';
  onViewChange: (view: 'reminders' | 'messages') => void;
}

export default function AppLayout({ children, currentView, onViewChange }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/generated/app-logo.dim_512x512.png" 
                alt="VoiceMate" 
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold">VoiceMate</h1>
                <p className="text-sm text-muted-foreground">Your intelligent organizer</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-2">
              <Button
                variant={currentView === 'reminders' ? 'default' : 'ghost'}
                onClick={() => onViewChange('reminders')}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Reminders
              </Button>
              <Button
                variant={currentView === 'messages' ? 'default' : 'ghost'}
                onClick={() => onViewChange('messages')}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </Button>
            </nav>
          </div>
          <nav className="flex md:hidden gap-2 mt-4">
            <Button
              variant={currentView === 'reminders' ? 'default' : 'ghost'}
              onClick={() => onViewChange('reminders')}
              className="flex-1 gap-2"
            >
              <Calendar className="w-4 h-4" />
              Reminders
            </Button>
            <Button
              variant={currentView === 'messages' ? 'default' : 'ghost'}
              onClick={() => onViewChange('messages')}
              className="flex-1 gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Messages
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} VoiceMate • Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
