'use client';

import { useMemo } from 'react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Globe,
  Server,
  FileText,
  LifeBuoy,
  User,
  LogOut,
  Loader2,
} from 'lucide-react';
import { signOut } from 'firebase/auth';

import { useUser, useAuth } from '@/firebase';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export default function ClientAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const pathname = usePathname();

  const navItems = useMemo(
    () => [
      { href: '/area-do-cliente', label: 'Painel', icon: LayoutDashboard },
      { href: '/area-do-cliente/servicos', label: 'Serviços', icon: Server },
      { href: '/area-do-cliente/dominios', label: 'Domínios', icon: Globe },
      { href: '/area-do-cliente/faturas', label: 'Faturas', icon: FileText },
      { href: '/area-do-cliente/tickets', label: 'Tickets', icon: LifeBuoy },
      { href: '/area-do-cliente/perfil', label: 'Meu Perfil', icon: User },
    ],
    []
  );

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo className="h-7 w-auto" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut(auth)}>
                    <LogOut />
                    <span>Sair</span>
                </SidebarMenuButton>
             </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="flex-1 text-lg font-semibold md:text-2xl">
              {navItems.find(item => item.href === pathname)?.label || 'Área do Cliente'}
            </h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
