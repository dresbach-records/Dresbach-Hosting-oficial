'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/clientes', label: 'Clientes' },
  { href: '/admin/servicos', label: 'Serviços' },
  { href: '/admin/dominios', label: 'Domínios' },
  { href: '/admin/faturamento', label: 'Faturamento' },
  { href: '/admin/suporte', label: 'Suporte' },
  { href: '/admin/relatorios', label: 'Relatórios' },
  { href: '/admin/configuracoes', label: 'Configurações' },
];

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {children}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-card px-6 z-30">
        <div className="flex items-center gap-6">
          <Link href="/admin">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <NavLink key={item.href} href={item.href} isActive={pathname === item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Site
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/admin/32/32" alt="@admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
