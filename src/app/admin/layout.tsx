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
  UserPlus,
  FileText,
  Ticket,
  FilePlus2,
  ListTodo,
  DollarSign,
  Globe,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';


const quickAccessItems = [
    { href: '#', label: 'Add New Client', icon: UserPlus },
    { href: '/admin/pedidos', label: 'Add New Order', icon: ShoppingCart },
    { href: '#', label: 'Create New Quote', icon: FileText },
    { href: '/admin/suporte', label: 'Open New Ticket', icon: Ticket },
    { href: '/admin/faturamento', label: 'New Invoice', icon: FilePlus2 },
    { href: '#', label: 'Create New To-Do Entry', icon: ListTodo },
    { href: '#', label: 'WHOIS Lookup', icon: Globe },
    { href: '#', label: 'Generate Due Invoices', icon: DollarSign },
    { href: '#', label: 'Attempt CC Captures', icon: CreditCard },
];

const menuItems = [
  { href: '/admin/clientes', label: 'Clientes', icon: Users, badge: 0 },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart, badge: 2 },
  { href: '/admin/faturamento', label: 'Faturamento', icon: CreditCard, badge: 2 },
  { href: '/admin/suporte', label: 'Suporte', icon: LifeBuoy, badge: 1 },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart, badge: 0 },
  { href: '/admin/utilitarios', label: 'Utilitários', icon: Wrench, badge: 0 },
  { href: '/admin/addons', label: 'Addons', icon: Puzzle, badge: 0 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings, badge: 0 },
  { href: '/admin/ajuda', label: 'Ajuda', icon: HelpCircle, badge: 0 },
];


function NavLink({ href, children, isActive, isMobile = false, badge = 0 }: { href: string; children: React.ReactNode; isActive: boolean, isMobile?: boolean, badge?: number }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary',
        isMobile && 'text-lg'
      )}
    >
      <div className="flex items-center gap-3">
        {children}
      </div>
       {badge > 0 && <Badge className="bg-red-500 text-white hover:bg-red-600">{badge}</Badge>}
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
         <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline [&[data-state=open]]:text-primary [&[data-state=open]]:bg-muted">
                    <Link href="/admin" className="flex items-center gap-3">
                        <Home className="h-4 w-4" />
                        Home
                    </Link>
                </AccordionTrigger>
                <AccordionContent className="pl-7 pt-1">
                    <div className="flex flex-col gap-1">
                        {quickAccessItems.map(item => (
                            <Link key={item.label} href={item.href} className="flex items-center gap-2 py-1.5 text-muted-foreground hover:text-primary text-xs">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        {menuItems.map((item) => (
          <NavLink key={item.href} href={item.href} isActive={pathname.startsWith(item.href) && item.href !== '/admin'} badge={item.badge}>
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
         <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline [&[data-state=open]]:text-primary [&[data-state=open]]:bg-muted">
                    <Link href="/admin" className="flex items-center gap-3 text-lg">
                        <Home className="h-5 w-5" />
                        Home
                    </Link>
                </AccordionTrigger>
                <AccordionContent className="pl-8 pt-1">
                    <div className="flex flex-col gap-2">
                        {quickAccessItems.map(item => (
                            <Link key={item.label} href={item.href} className="flex items-center gap-3 py-1 text-muted-foreground hover:text-primary text-base">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        {menuItems.map((item) => (
          <NavLink key={item.href} href={item.href} isActive={pathname.startsWith(item.href) && item.href !== '/admin'} isMobile badge={item.badge}>
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
          <div className="p-2">
            <form>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Menu Search..."
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                    />
                </div>
            </form>
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
