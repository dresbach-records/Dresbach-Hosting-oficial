'use client';

import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import {
  Bell,
  CreditCard,
  Home,
  LifeBuoy,
  Menu,
  Settings,
  ShoppingCart,
  Users,
  BarChart,
  Loader2,
  LogOut,
  Wrench,
  Puzzle,
  HelpCircle,
  Search,
} from 'lucide-react';
import { signOut } from 'firebase/auth';

import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';


const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/faturamento', label: 'Faturamento', icon: CreditCard },
  { href: '/admin/suporte', label: 'Suporte', icon: LifeBuoy },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart },
  { href: '/admin/utilitarios', label: 'Utilitários', icon: Wrench },
  { href: '/admin/addons', label: 'Addons', icon: Puzzle },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/admin/ajuda', label: 'Ajuda', icon: HelpCircle },
];


function NavLink({ href, children, isActive, isMobile = false }: { href: string; children: React.ReactNode; isActive: boolean, isMobile?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary',
        isMobile && 'text-lg'
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
  const { user, isAdmin, isUserLoading } = useUser();
  const auth = useAuth();

  if (pathname.startsWith('/admin/login')) {
      return <>{children}</>;
  }

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    redirect('/admin/login');
    return null;
  }

  if (!isAdmin) {
      redirect('/area-do-cliente');
      return null;
  }

  const handleLogout = () => {
    signOut(auth);
  }

  const desktopNav = (
      <nav className="grid items-start px-2 text-sm font-medium">
        {menuItems.map((item) => (
          <NavLink key={item.href} href={item.href} isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
  );

  const mobileNav = (
     <nav className="grid gap-2 text-lg font-medium">
        <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold mb-4"
          >
            <Logo />
            <span className="sr-only">Dresbach Hosting</span>
        </Link>
        {menuItems.map((item) => (
          <NavLink key={item.href} href={item.href} isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')} isMobile>
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
     </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Logo />
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            {desktopNav}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Menu de Navegação</SheetTitle>
              </SheetHeader>
              {mobileNav}
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
             <form>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar clientes, domínios, etc..."
                        className="w-full appearance-none bg-muted pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    />
                </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                 <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/admin/32/32" alt="@admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
