import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/goals', label: 'Goals', icon: '🎯' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/how-it-works', label: 'How It Works', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">✨</div>
            <h1 className="text-2xl font-bold text-foreground">Work Tracker</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-border overflow-x-auto">
          <div className="flex gap-0">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex-1 px-3 py-3 text-xs font-medium transition-colors text-center",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground border-b-2 border-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div>{item.icon}</div>
                <div className="mt-1">{item.label}</div>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Work Tracker. Built to bridge the intention-action gap.</p>
        </div>
      </footer>
    </div>
  );
};
