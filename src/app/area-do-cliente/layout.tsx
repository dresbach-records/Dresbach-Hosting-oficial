'use client';

import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  LogOut,
  Loader2,
  Home,
  Server,
  Globe,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { signOut } from 'firebase/auth';

import { useUser, useAuth } from '@/firebase';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientSidebar } from './sidebar';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/area-do-cliente' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`px-4 py-4 text-sm font-medium border-b-2 flex items-center gap-1 transition-colors ${isActive ? 'border-white text-white' : 'border-transparent text-primary-foreground/80 hover:text-white'}`}
    >
      {children}
    </Link>
  );
}

export default function ClientAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  const handleLogout = () => {
    signOut(auth);
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/50 text-foreground">
      {/* Top Header */}
      <header className="bg-card border-b">
        <div className="container flex h-16 items-center justify-between">
          <Logo className="h-8 w-auto text-primary" />
          <div className="flex items-center gap-4 text-sm">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  English
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Português</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  Notifications
                  <Bell className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-4 text-center text-sm text-muted-foreground">No unread notifications.</div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-primary text-primary-foreground shadow-md">
        <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center">
                <NavLink href="/area-do-cliente"><Home className="mr-1 h-4 w-4" />Home</NavLink>
                <NavLink href="/area-do-cliente/servicos"><Server className="mr-1 h-4 w-4" />Services</NavLink>
                <NavLink href="/area-do-cliente/dominios"><Globe className="mr-1 h-4 w-4" />Domains</NavLink>
                <NavLink href="/area-do-cliente/faturas"><CreditCard className="mr-1 h-4 w-4" />Billing</NavLink>
                <NavLink href="/area-do-cliente/tickets"><MessageSquare className="mr-1 h-4 w-4" />Support</NavLink>
                <NavLink href="/area-do-cliente/tickets?new=true">Open Ticket</NavLink>
            </div>
            <div className="text-sm text-primary-foreground/80">
                Hello, {user.displayName?.split(' ')[0] || 'User'}!
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8 container">
        <div className="flex flex-col md:flex-row gap-8">
            <ClientSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
      </main>

      <footer className="py-4 mt-auto">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">
            Powered by Dresbach Hosting
          </p>
        </div>
      </footer>
    </div>
  );
}
