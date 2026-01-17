'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, limit, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Server, Globe, MessageSquare, CreditCard, Search, Plus, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const StatCard = ({ title, icon, count, colorClass, isLoading }: { title: string, icon: React.ReactNode, count: number, colorClass: string, isLoading: boolean }) => (
    <Card className="relative overflow-hidden shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
            <div className="text-muted-foreground">
                {icon}
            </div>
            <div>
                 <div className="text-3xl font-bold">
                    {isLoading ? <Skeleton className="h-8 w-10" /> : count}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 h-1 w-full ${colorClass}`}></div>
    </Card>
);

function ServiceStatusBadge({ status }: { status: string }) {
    const variant = status === 'Active' ? 'default' : 'secondary';
    return <Badge variant={variant}>{status === 'Active' ? 'Ativo' : 'Inativo'}</Badge>;
}

function TicketStatusBadge({ status }: { status: string }) {
    const variant = status === 'Open' ? 'default' : 'secondary';
    return <Badge variant={variant}>{status === 'Open' ? 'Aberto' : 'Fechado'}</Badge>;
}


export default function ClientAreaDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const servicesQuery = useMemoFirebase(() => user && query(collection(firestore, 'clients', user.uid, 'services'), orderBy('startDate', 'desc'), limit(5)), [firestore, user]);
  const domainsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'domains'), [firestore, user]);
  const invoicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'invoices'), [firestore, user]);
  const ticketsQuery = useMemoFirebase(() => user && query(collection(firestore, 'clients', user.uid, 'tickets'), orderBy('createdAt', 'desc'), limit(5)), [firestore, user]);

  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
  const { data: domains, isLoading: domainsLoading } = useCollection(domainsQuery);
  const { data: invoices, isLoading: invoicesLoading } = useCollection(invoicesQuery);
  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery);
  
  return (
    <div className="space-y-6">
        <div>
            <p className="text-sm text-muted-foreground">Início do Portal / Área do Cliente</p>
            <h1 className="text-3xl font-light">Bem-vindo de volta, <span className="font-medium">{user?.displayName?.split(' ')[0] || 'Usuário'}</span></h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="SERVIÇOS" 
                icon={<Server className="h-10 w-10" />} 
                count={services?.length || 0}
                colorClass="bg-cyan-500"
                isLoading={servicesLoading}
            />
             <StatCard 
                title="DOMÍNIOS" 
                icon={<Globe className="h-10 w-10" />} 
                count={domains?.length || 0}
                colorClass="bg-green-500"
                isLoading={domainsLoading}
            />
             <StatCard 
                title="TICKETS" 
                icon={<MessageSquare className="h-10 w-10" />} 
                count={tickets?.filter(t => t.status !== 'Closed').length || 0}
                colorClass="bg-red-500"
                isLoading={ticketsLoading}
            />
            <StatCard 
                title="FATURAS" 
                icon={<CreditCard className="h-10 w-10" />} 
                count={invoices?.filter(inv => inv.status !== 'Paid').length || 0}
                colorClass="bg-orange-500"
                isLoading={invoicesLoading}
            />
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Digite sua dúvida para pesquisar em nossa base de conhecimento..." className="pl-10 h-12 bg-card" />
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Seus Produtos/Serviços Ativos</CardTitle>
            </CardHeader>
            <CardContent>
                {servicesLoading && <Skeleton className="h-24 w-full" />}
                {!servicesLoading && services && services.length > 0 ? (
                     <Table>
                        <TableBody>
                        {services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell>{service.description}</TableCell>
                                <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : (
                     !servicesLoading && <p className="text-muted-foreground text-center py-4">Parece que você ainda não tem nenhum produto/serviço conosco. <Link href="/planos-de-hospedagem" className="text-accent-600 font-semibold hover:underline">Faça um pedido para começar</Link>.</p>
                )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-2 flex justify-end">
                <Button asChild size="sm" variant="outline" className="shadow-sm">
                    <Link href="/area-do-cliente/servicos">Meus Serviços</Link>
                </Button>
            </CardFooter>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Tickets de Suporte Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {ticketsLoading && <Skeleton className="h-24 w-full" />}
                    {!ticketsLoading && tickets && tickets.length > 0 ? (
                        <Table>
                            <TableBody>
                            {tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
                                    <TableCell className="text-right">{format(new Date(ticket.createdAt), 'dd/MM/yy')}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    ) : (
                         !ticketsLoading && <p className="text-muted-foreground text-center py-4">Nenhum ticket recente encontrado. Se precisar de ajuda, por favor <Link href="/area-do-cliente/tickets?new=true" className="text-accent-600 font-semibold hover:underline">abra um ticket</Link>.</p>
                    )}
                </CardContent>
                 <CardFooter className="bg-muted/50 p-2 flex justify-end">
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                        <Link href="/area-do-cliente/tickets?new=true"><Plus className="mr-2 h-4 w-4" />Abrir Novo Ticket</Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Registrar um Novo Domínio</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input placeholder="example.com" className="bg-card"/>
                    <Button className="bg-green-600 hover:bg-green-700">Registrar</Button>
                    <Button variant="outline" className="shadow-sm">Transferir</Button>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2"><Newspaper className="h-5 w-5" /> Notícias Recentes</CardTitle>
                <Button variant="outline" size="sm" className="shadow-sm">Ver Tudo</Button>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-4">Nenhuma notícia recente.</p>
            </CardContent>
        </Card>

    </div>
  );
}
