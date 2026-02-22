import LoginButton from '../auth/LoginButton';
import { Calendar, MessageSquare, Mic, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/generated/voicemate-logo.dim_800x800.png" 
                alt="VoiceMate Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">VoiceMate</h1>
                <p className="text-sm text-muted-foreground">Your intelligent organizer</p>
              </div>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Organize Your Life with Voice
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create reminders, send messages, and stay organized—all with the power of your voice and secure privacy controls.
            </p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/assets/generated/hero.dim_1600x600.png" 
              alt="VoiceMate Hero" 
              className="w-full h-auto"
            />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>
              <p className="text-muted-foreground text-sm">
                Create and manage reminders with due dates. Never miss an important task again.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Private Messaging</h3>
              <p className="text-muted-foreground text-sm">
                Send messages and reminders to specific users securely and privately.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Voice Input</h3>
              <p className="text-muted-foreground text-sm">
                Use voice dictation to quickly create reminders and compose messages hands-free.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Your data is private and secure. Only you can access your reminders and messages.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center border">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Organized?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sign in with Internet Identity to start managing your reminders and messages securely.
            </p>
            <LoginButton />
          </div>
        </div>
      </main>

      {/* Footer */}
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
