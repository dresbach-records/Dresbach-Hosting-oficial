'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CreditCard,
  Globe,
  Home,
  LifeBuoy,
  Menu,
  Search,
  Server,
  Settings,
  ShoppingCart,
  Users,
  BarChart
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
} from '@/components/ui/card';
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


const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/servicos', label: 'Serviços', icon: Server },
  { href: '/admin/dominios', label: 'Domínios', icon: Globe },
  { href: '/admin/faturamento', label: 'Faturamento', icon: CreditCard },
  { href: '/admin/suporte', label: 'Suporte', icon: LifeBuoy },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart },
];

const settingsMenuItem = { href: '/admin/configuracoes', label: 'Configurações', icon: Settings };


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

  const desktopNav = (
      <nav className="grid items-start px-2 text-sm font-medium">
        {menuItems.map((item) => (
          <NavLink key={item.href} href={item.href} isActive={pathname === item.href}>
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
          <NavLink key={item.href} href={item.href} isActive={pathname === item.href} isMobile>
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
         <NavLink href={settingsMenuItem.href} isActive={pathname === settingsMenuItem.href} isMobile>
            <settingsMenuItem.icon className="h-5 w-5" />
            {settingsMenuItem.label}
        </NavLink>
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
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                 <NavLink href={settingsMenuItem.href} isActive={pathname === settingsMenuItem.href}>
                    <settingsMenuItem.icon className="h-4 w-4" />
                    {settingsMenuItem.label}
                </NavLink>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
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
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              {mobileNav}
              <div className="mt-auto">
                 <Card>
                    <CardHeader>
                        <NavLink href={settingsMenuItem.href} isActive={pathname === settingsMenuItem.href} isMobile>
                            <settingsMenuItem.icon className="h-5 w-5" />
                            {settingsMenuItem.label}
                        </NavLink>
                    </CardHeader>
                 </Card>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            {/* Can add search here if needed */}
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
              <DropdownMenuItem>Sair</DropdownMenuItem>
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
