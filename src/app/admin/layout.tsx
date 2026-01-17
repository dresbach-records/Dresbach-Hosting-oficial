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
  Server,
  FileX,
  PauseCircle,
  CheckCircle,
  ShieldAlert,
  XCircle,
  Clock,
  Ban,
  Undo2,
  Archive,
  Timer,
  FileStack,
  FileQuote,
  Terminal,
  File,
  Flag,
  MessageSquare,
  Reply,
  ReplyAll,
  Network,
  Download,
  TrendingUp,
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

  const renderNavLinks = (isMobile = false) => {
    const linkClass = cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isMobile && 'text-lg'
    );
    const subLinkClass = cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary', isMobile && 'text-base');
    const iconSize = isMobile ? 'h-5 w-5' : 'h-4 w-4';

    const isActive = (href: string) => pathname.startsWith(href) && href !== '/admin';
    const isExactlyActive = (href: string) => pathname === href;

    return (
      <>
        <NavLink href="/admin" isActive={pathname === '/admin'} isMobile={isMobile}>
          <Home className={iconSize} />
          Home
        </NavLink>
        
        <Accordion type="multiple" defaultValue={['clientes']} className="w-full">
          <AccordionItem value="clientes" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/clientes') && 'text-primary bg-muted')}>
              <div className="flex items-center gap-3">
                <Users className={iconSize} />
                Clientes
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
              
                <Link href={'/admin/clientes?new=true'} className={cn(subLinkClass, isExactlyActive('/admin/clientes?new=true') && 'bg-muted text-primary')}>
                  <UserPlus className={iconSize} />
                  Adicionar Novo Cliente
                </Link>
                <Link href={'/admin/clientes'} className={cn(subLinkClass, isExactlyActive('/admin/clientes') && 'bg-muted text-primary')}>
                  <Search className={iconSize} />
                  Ver/Buscar Clientes
                </Link>

              <Accordion type="multiple" defaultValue={['produtos-servicos']} className="w-full">
                <AccordionItem value="produtos-servicos" className="border-b-0">
                  <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/servicos') && 'text-primary')}>
                     <div className="flex items-center gap-3">
                      <Server className={iconSize} />
                      Produtos/Serviços
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                    <Link href="/admin/servicos" className={cn(subLinkClass, isExactlyActive('/admin/servicos') && 'bg-muted text-primary')}>
                      <ListTodo className={iconSize} /> Ver Todos
                    </Link>
                    <Link href="#" className={subLinkClass}><Server className={iconSize} /> Hospedagem Compartilhada</Link>
                    <Link href="#" className={subLinkClass}><Users className={iconSize} /> Contas de Revenda</Link>
                    <Link href="#" className={subLinkClass}><Server className={iconSize} /> VPS/Servidores</Link>
                    <Link href="#" className={subLinkClass}><Wrench className={iconSize} /> Outros Serviços</Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Link href="/admin/addons" className={cn(subLinkClass, isExactlyActive('/admin/addons') && 'bg-muted text-primary')}>
                <Puzzle className={iconSize} /> Addons de Serviço
              </Link>
              <Link href="/admin/dominios" className={cn(subLinkClass, isExactlyActive('/admin/dominios') && 'bg-muted text-primary')}>
                <Globe className={iconSize} /> Registros de Domínio
              </Link>
              <Link href="#" className={subLinkClass}>
                <FileX className={iconSize} /> Pedidos de Cancelamento
              </Link>
              <Link href="#" className={subLinkClass}>
                <Users className={iconSize} /> Gerenciar Afiliados
              </Link>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="orders" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/pedidos') && 'text-primary bg-muted')}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className={iconSize} />
                    Pedidos
                </div>
                <Badge className="bg-red-500 text-white hover:bg-red-600">2</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
              <Link href={'/admin/pedidos?new=true'} className={cn(subLinkClass, isExactlyActive('/admin/pedidos?new=true') && 'bg-muted text-primary')}>
                <ShoppingCart className={iconSize} />
                Adicionar Novo Pedido
              </Link>
              <Link href={'/admin/pedidos'} className={cn(subLinkClass, isExactlyActive('/admin/pedidos') && 'bg-muted text-primary')}>
                <ListTodo className={iconSize} />
                Listar Todos os Pedidos
              </Link>
              <Link href={'/admin/pedidos?status=pending'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/pedidos?status=pending') && 'bg-muted text-primary')}>
                <div className="flex items-center gap-3">
                  <PauseCircle className={iconSize} />
                  Pedidos Pendentes
                </div>
                <Badge variant="destructive">2</Badge>
              </Link>
              <Link href={'/admin/pedidos?status=active'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/pedidos?status=active') && 'bg-muted text-primary')}>
                <div className="flex items-center gap-3">
                  <CheckCircle className={iconSize} />
                  Pedidos Ativos
                </div>
                <Badge className="bg-green-600 text-white hover:bg-green-700">123</Badge>
              </Link>
              <Link href={'/admin/pedidos?status=fraud'} className={cn(subLinkClass, isExactlyActive('/admin/pedidos?status=fraud') && 'bg-muted text-primary')}>
                <ShieldAlert className={iconSize} />
                Pedidos Fraudulentos
              </Link>
              <Link href={'/admin/pedidos?status=cancelled'} className={cn(subLinkClass, isExactlyActive('/admin/pedidos?status=cancelled') && 'bg-muted text-primary')}>
                <XCircle className={iconSize} />
                Pedidos Cancelados
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="multiple" className="w-full" defaultValue={['billing']}>
          <AccordionItem value="billing" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/faturamento') && 'text-primary bg-muted')}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className={iconSize} />
                    Faturamento
                </div>
                <Badge className="bg-red-500 text-white hover:bg-red-600">2</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/faturamento'} className={cn(subLinkClass, isExactlyActive('/admin/faturamento') && 'bg-muted text-primary')}>
                    <ListTodo className={iconSize} />
                    Lista de Transações
                </Link>

                <Accordion type="multiple" defaultValue={['invoices']} className="w-full">
                    <AccordionItem value="invoices" className="border-b-0">
                        <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/faturamento/faturas') && 'text-primary')}>
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-3">
                                <FileText className={iconSize} />
                                Faturas
                                </div>
                                <Badge variant="destructive">2</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                             <Link href="/admin/faturamento/faturas" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas') && 'bg-muted text-primary')}>
                                <Search className={iconSize} /> Ver Todas
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=paid" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas?status=paid') && 'bg-muted text-primary')}>
                                <CheckCircle className={iconSize} /> Pagas
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=draft" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas?status=draft') && 'bg-muted text-primary')}>
                                <File className={iconSize} /> Rascunhos
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=unpaid" className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/faturamento/faturas?status=unpaid') && 'bg-muted text-primary')}>
                                <div className="flex items-center gap-3">
                                <XCircle className={iconSize} /> Não Pagas
                                </div>
                                <Badge variant="destructive">2</Badge>
                            </Link>
                             <Link href="/admin/faturamento/faturas?status=overdue" className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/faturamento/faturas?status=overdue') && 'bg-muted text-primary')}>
                                <div className="flex items-center gap-3">
                                <Clock className={iconSize} /> Vencidas
                                </div>
                                <Badge variant="destructive">2</Badge>
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=cancelled" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas?status=cancelled') && 'bg-muted text-primary')}>
                                <Ban className={iconSize} /> Canceladas
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=refunded" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas?status=refunded') && 'bg-muted text-primary')}>
                                <Undo2 className={iconSize} /> Reembolsadas
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=collections" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas?status=collections') && 'bg-muted text-primary')}>
                                <Archive className={iconSize} /> Cobranças
                            </Link>
                            <Link href="/admin/faturamento/faturas?status=payment_pending" className={cn(subLinkClass, isExactlyActive('/admin/faturamento/faturas?status=payment_pending') && 'bg-muted text-primary')}>
                                <Timer className={iconSize} /> Pagamento Pendente
                            </Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <Link href={'/admin/faturamento/itens'} className={cn(subLinkClass, isExactlyActive('/admin/faturamento/itens') && 'bg-muted text-primary')}>
                    <FileStack className={iconSize} /> Itens Faturáveis
                </Link>
                <Link href={'/admin/faturamento/orcamentos'} className={cn(subLinkClass, isExactlyActive('/admin/faturamento/orcamentos') && 'bg-muted text-primary')}>
                    <FileQuote className={iconSize} /> Orçamentos
                </Link>
                <Link href={'/admin/faturamento/offline-cc'} className={cn(subLinkClass, isExactlyActive('/admin/faturamento/offline-cc') && 'bg-muted text-primary')}>
                    <CreditCard className={iconSize} /> Processamento CC Offline
                </Link>
                <Link href={'/admin/faturamento/gateway-log'} className={cn(subLinkClass, isExactlyActive('/admin/faturamento/gateway-log') && 'bg-muted text-primary')}>
                    <Terminal className={iconSize} /> Log de Gateway
                </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="multiple" className="w-full" defaultValue={['suporte']}>
            <AccordionItem value="suporte" className="border-b-0">
                <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/suporte') && 'text-primary bg-muted')}>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            <LifeBuoy className={iconSize} />
                            Suporte
                        </div>
                        <Badge className="bg-red-500 text-white hover:bg-red-600">1</Badge>
                    </div>
                </AccordionTrigger>
                <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                    <Accordion type="multiple" className="w-full" defaultValue={['tickets-de-suporte']}>
                        <AccordionItem value="tickets-de-suporte" className="border-b-0">
                            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/suporte/tickets') && 'text-primary')}>
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Ticket className={iconSize} />
                                        Tickets de Suporte
                                    </div>
                                    <Badge variant="destructive">1</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                                <Link href={'/admin/suporte/tickets?new=true'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/tickets?new=true') && 'bg-muted text-primary')}>
                                    <FilePlus2 className={iconSize} />
                                    Abrir Novo Ticket
                                </Link>
                                <Link href={'/admin/suporte'} className={cn(subLinkClass, isExactlyActive('/admin/suporte') && 'bg-muted text-primary')}>
                                    <ListTodo className={iconSize} />
                                    Ver Todos
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=awaiting'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/suporte/tickets?status=awaiting') && 'bg-muted text-primary')}>
                                    <div className="flex items-center gap-3">
                                        <Clock className={iconSize} />
                                        Aguardando Resposta
                                    </div>
                                    <Badge variant="destructive">1</Badge>
                                </Link>
                                <Link href={'/admin/suporte/tickets?flagged=true'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/tickets?flagged=true') && 'bg-muted text-primary')}>
                                    <Flag className={iconSize} />
                                    Tickets Sinalizados
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=active'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/suporte/tickets?status=active') && 'bg-muted text-primary')}>
                                    <div className="flex items-center gap-3">
                                        <ListTodo className={iconSize} />
                                        Todos Tickets Ativos
                                    </div>
                                    <Badge className="bg-green-600 text-white hover:bg-green-700">2</Badge>
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=open'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/suporte/tickets?status=open') && 'bg-muted text-primary')}>
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className={iconSize} />
                                        Aberto
                                    </div>
                                    <Badge className="bg-blue-500 text-white">1</Badge>
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=answered'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/tickets?status=answered') && 'bg-muted text-primary')}>
                                    <Reply className={iconSize} />
                                    Respondido
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=customer-reply'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/suporte/tickets?status=customer-reply') && 'bg-muted text-primary')}>
                                    <div className="flex items-center gap-3">
                                        <ReplyAll className={iconSize} />
                                        Resposta do Cliente
                                    </div>
                                    <Badge className="bg-blue-500 text-white">1</Badge>
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=on-hold'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/suporte/tickets?status=on-hold') && 'bg-muted text-primary')}>
                                    <div className="flex items-center gap-3">
                                        <PauseCircle className={iconSize} />
                                        Em Espera
                                    </div>
                                    <Badge className="bg-blue-500 text-white">1</Badge>
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=in-progress'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/tickets?status=in-progress') && 'bg-muted text-primary')}>
                                    <Timer className={iconSize} />
                                    Em Progresso
                                </Link>
                                <Link href={'/admin/suporte/tickets?status=closed'} className={cn(subLinkClass, 'flex justify-between', isExactlyActive('/admin/suporte/tickets?status=closed') && 'bg-muted text-primary')}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className={iconSize} />
                                        Fechado
                                    </div>
                                    <Badge className="bg-green-600 text-white hover:bg-green-700">1</Badge>
                                </Link>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                     <Link href={'/admin/suporte/network-issues'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/network-issues') && 'bg-muted text-primary')}>
                        <Network className={iconSize} />
                        Problemas de Rede
                    </Link>
                    <Link href={'/admin/suporte/overview'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/overview') && 'bg-muted text-primary')}>
                        <BarChart className={iconSize} />
                        Visão Geral do Suporte
                    </Link>
                    <Link href={'/admin/suporte/predefined-replies'} className={cn(subLinkClass, isExactlyActive('/admin/suporte/predefined-replies') && 'bg-muted text-primary')}>
                        <FileQuote className={iconSize} />
                        Respostas Predefinidas
                    </Link>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <Accordion type="multiple" className="w-full" defaultValue={['reports']}>
          <AccordionItem value="reports" className="border-b-0">
            <AccordionTrigger className={cn("rounded-lg px-3 py-2 hover:no-underline hover:text-primary", isActive('/admin/relatorios') && 'text-primary bg-muted')}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart className={iconSize} />
                    Relatórios
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn("pt-1 space-y-1", isMobile ? "pl-10" : "pl-7")}>
                <Link href={'/admin/relatorios'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios') && 'bg-muted text-primary')}>
                    <ListTodo className={iconSize} />
                    Ver Todos
                </Link>
                <Link href={'/admin/relatorios/geral'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios/geral') && 'bg-muted text-primary')}>
                    <FileText className={iconSize} />
                    Geral
                </Link>
                 <Link href={'/admin/relatorios/faturamento'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios/faturamento') && 'bg-muted text-primary')}>
                    <DollarSign className={iconSize} />
                    Faturamento
                </Link>
                <Link href={'/admin/relatorios/receita'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios/receita') && 'bg-muted text-primary')}>
                    <TrendingUp className={iconSize} />
                    Receita
                </Link>
                <Link href={'/admin/relatorios/clientes'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios/clientes') && 'bg-muted text-primary')}>
                    <Users className={iconSize} />
                    Clientes
                </Link>
                <Link href={'/admin/relatorios/suporte'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios/suporte') && 'bg-muted text-primary')}>
                    <LifeBuoy className={iconSize} />
                    Suporte
                </Link>
                <Link href={'/admin/relatorios/exportacoes'} className={cn(subLinkClass, isExactlyActive('/admin/relatorios/exportacoes') && 'bg-muted text-primary')}>
                    <Download className={iconSize} />
                    Exportações
                </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <NavLink href="/admin/utilitarios" isActive={isActive('/admin/utilitarios')} isMobile={isMobile}>
          <Wrench className={iconSize} /> Utilitários
        </NavLink>
        <NavLink href="/admin/addons" isActive={isActive('/admin/addons')} isMobile={isMobile}>
          <Puzzle className={iconSize} /> Addons
        </NavLink>
        <NavLink href="/admin/configuracoes" isActive={isActive('/admin/configuracoes')} isMobile={isMobile}>
          <Settings className={iconSize} /> Configurações
        </NavLink>
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
