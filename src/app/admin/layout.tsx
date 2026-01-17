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
  BookUser,
  HelpCircle,
  Search,
  UserPlus,
  Globe,
  Server,
  ClipboardList,
  Cog,
  FileText,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/providers/auth-provider';


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
  const { user, isLoading, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Permite o acesso à página de login do admin sem autenticação
  if (pathname.startsWith('/admin/login')) {
      return <>{children}</>;
  }

  if (isLoading) {
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

  // For the full-screen CRM page, render children without the standard admin layout shell.
  if (pathname === '/admin/addons') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    redirect('/admin/login');
  }

  const renderNavLinks = (isMobile = false) => {
    const subLinkClass = cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', isMobile && 'text-base');
    const iconSize = isMobile ? 'h-5 w-5' : 'h-4 w-4';

    const isActive = (href: string) => pathname.startsWith(href) && href !== '/admin';
    const isExactlyActive = (href: string) => pathname === href;

    return (
      <>
        <NavLink href="/admin" isActive={isExactlyActive('/admin')} isMobile={isMobile}>
          <Home className={iconSize} /> Visão Geral
        </NavLink>

        <Accordion type="multiple" defaultValue={['clientes', 'faturamento', 'suporte']} className="w-full">
          
          <AccordionItem value="clientes" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary font-medium", isActive('/admin/clientes') && 'text-primary bg-muted')}>
              <div className="flex items-center gap-3">
                <Users className={iconSize} />
                Clientes
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/clientes'} className={cn(subLinkClass, isExactlyActive('/admin/clientes') && 'bg-muted text-primary')}>
                  <Search className={iconSize} />
                  Ver/Buscar Clientes
                </Link>
                <Link href={'/admin/clientes?new=true'} className={cn(subLinkClass, isExactlyActive('/admin/clientes?new=true') && 'bg-muted text-primary')}>
                  <UserPlus className={iconSize} />
                  Adicionar Novo
                </Link>
              <Link href="/admin/addons" className={cn(subLinkClass, isExactlyActive('/admin/addons') && 'bg-muted text-primary')}>
                <BookUser className={iconSize} /> CRM
              </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pedidos" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary font-medium", isActive('/admin/pedidos') && 'text-primary bg-muted')}>
              <div className="flex items-center gap-3">
                <ClipboardList className={iconSize} />
                Pedidos
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/pedidos'} className={cn(subLinkClass, isExactlyActive('/admin/pedidos') && 'bg-muted text-primary')}>
                   Listar Pedidos
                </Link>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="faturamento" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary font-medium", isActive('/admin/faturamento') && 'text-primary bg-muted')}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className={iconSize} />
                    Faturamento
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/faturamento'} className={cn(subLinkClass, isExactlyActive('/admin/faturamento') && 'bg-muted text-primary')}>
                   Faturas
                </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="suporte" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary font-medium", isActive('/admin/suporte') && 'text-primary bg-muted')}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <LifeBuoy className={iconSize} />
                    Suporte
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/suporte'} className={cn(subLinkClass, isExactlyActive('/admin/suporte') && 'bg-muted text-primary')}>
                    Todos os Tickets
                </Link>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="relatorios" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary font-medium", isActive('/admin/relatorios') && 'text-primary bg-muted')}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart className={iconSize} />
                    Relatórios
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/relatorios'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios') && 'bg-muted text-primary')}>
                    Ver Relatórios
                </Link>
            </AccordionContent>
          </AccordionItem>
        
        </Accordion>
        
        <div className="my-2 border-t -mx-2"></div>

        <Accordion type="multiple" defaultValue={['configuracoes']} className="w-full">
          <AccordionItem value="configuracoes" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary font-medium", isActive('/admin/configuracoes') && 'text-primary bg-muted')}>
              <div className="flex items-center gap-3">
                <Settings className={iconSize} /> Configurações
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
               <Link href={'/admin/produtos'} className={cn(subLinkClass, isActive('/admin/produtos') && 'bg-muted text-primary')}>
                  <ShoppingCart className={iconSize} /> Produtos/Serviços
                </Link>
                <Link href={'/admin/servidores'} className={cn(subLinkClass, isActive('/admin/servidores') && 'bg-muted text-primary')}>
                  <Server className={iconSize} /> Servidores
                </Link>
                <Link href={'/admin/dominios'} className={cn(subLinkClass, isActive('/admin/dominios') && 'bg-muted text-primary')}>
                  <Globe className={iconSize} /> Registros de Domínio
                </Link>
                <Link href={'/admin/automacao'} className={cn(subLinkClass, isActive('/admin/automacao') && 'bg-muted text-primary')}>
                  <Cog className={iconSize} /> Automação
                </Link>
                <Link href={'/admin/logs'} className={cn(subLinkClass, isActive('/admin/logs') && 'bg-muted text-primary')}>
                  <FileText className={iconSize} /> Logs
                </Link>
                <Link href={'/admin/configuracoes'} className={cn(subLinkClass, isActive('/admin/configuracoes') && 'bg-muted text-primary')}>
                  <Wrench className={iconSize} /> Configurações Gerais
                </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>


        <NavLink href="/admin/ajuda" isActive={isActive('/admin/ajuda')} isMobile={isMobile}>
          <HelpCircle className={iconSize} /> Ajuda
        </NavLink>
      </>
    );
  }

  const desktopNav = (
      <nav className="grid items-start px-2 text-sm font-medium">
        {renderNavLinks()}
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
        {renderNavLinks(true)}
     </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-card z-10">
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
                 <SheetTitle>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <Logo />
                    </Link>
                 </SheetTitle>
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
