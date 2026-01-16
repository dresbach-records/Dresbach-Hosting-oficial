'use client';

import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUp,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Loader2,
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-black/10 transition-colors ${isActive ? 'bg-black/20' : ''}`}
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
  const pathname = usePathname();

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
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Logo className="h-8 w-auto" />
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  Notificações
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação nova.</div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm" onClick={() => signOut(auth)}>Sair</Button>
          </div>
        </div>
      </header>

      <nav className="bg-primary text-primary-foreground shadow-md sticky top-16 z-40">
        <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-1">
                <NavLink href="/area-do-cliente">Área do Cliente</NavLink>
                <NavLink href="/area-do-cliente/servicos">Serviços</NavLink>
                <NavLink href="/area-do-cliente/dominios">Domínios</NavLink>
                <NavLink href="/area-do-cliente/faturas">Faturas</NavLink>
                 <NavLink href="/area-do-cliente/tickets">Suporte</NavLink>
                 <NavLink href="/area-do-cliente/tickets?new=true">Abrir Ticket</NavLink>
                 <NavLink href="/area-do-cliente/afiliados">Afiliados</NavLink>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3 text-sm font-medium hover:bg-black/10 hover:text-primary-foreground">
                        Olá, {user.displayName?.split(' ')[0] || user.email}!
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/area-do-cliente/perfil"><UserIcon className="mr-2 h-4 w-4"/> Editar Perfil</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut(auth)}><LogOut className="mr-2 h-4 w-4"/> Sair</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </nav>

      <main className="flex-1 py-8 container">
        {children}
      </main>

      <footer className="bg-card border-t py-4 mt-auto">
        <div className="container flex items-center justify-center relative">
          <p className="text-xs text-muted-foreground">
            Copyright © {new Date().getFullYear()} Dresbach Hosting do Brasil LTDA. All Rights Reserved.
          </p>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 absolute right-4 top-1/2 -translate-y-1/2"
            onClick={handleScrollToTop}
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
