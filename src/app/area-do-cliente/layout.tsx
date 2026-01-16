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
  MessageSquare,
  ArrowUp,
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
      className={`px-4 py-4 text-sm font-medium border-b-2 flex items-center gap-1 transition-colors ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
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
    <div className="min-h-screen flex flex-col bg-muted/40 text-foreground">
      <div className="sticky top-0 z-50 bg-card shadow-sm">
        {/* Top Header */}
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4 text-sm">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    Idioma
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
                    Notificações
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação não lida.</div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={handleLogout}>Sair</Button>
            </div>
          </div>
        </header>

        {/* Main Navigation */}
        <nav className="border-b">
          <div className="container flex h-14 items-center justify-between">
              <div className="flex items-center">
                  <NavLink href="/area-do-cliente"><Home className="mr-1 h-4 w-4" />Início</NavLink>
                  <NavLink href="/area-do-cliente/servicos"><Server className="mr-1 h-4 w-4" />Serviços</NavLink>
                  <NavLink href="/area-do-cliente/dominios"><Globe className="mr-1 h-4 w-4" />Domínios</NavLink>
                  <NavLink href="/area-do-cliente/faturas"><CreditCard className="mr-1 h-4 w-4" />Faturas</NavLink>
                  <NavLink href="/area-do-cliente/tickets"><MessageSquare className="mr-1 h-4 w-4" />Suporte</NavLink>
                  <NavLink href="/area-do-cliente/tickets?new=true">Abrir Ticket</NavLink>
              </div>
              <div className="text-sm text-muted-foreground">
                  Olá, {user.displayName?.split(' ')[0] || 'Usuário'}!
              </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 container">
        <div className="flex flex-col md:flex-row gap-8">
            <ClientSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
      </main>

      <footer className="py-4 mt-auto bg-card border-t">
        <div className="container flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            Copyright © 2026 Dresbach hosting do brasil.ltda. Todos os direitos reservados.
          </p>
          <Button variant="outline" size="sm" className="ml-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ArrowUp className="mr-2 h-4 w-4" /> Voltar ao Topo
          </Button>
        </div>
      </footer>
    </div>
  );
}
