'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Server, Globe, MessageSquare, CreditCard, Search, Plus, Newspaper, Gift, Snowflake, CandyCane, Mail } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/providers/auth-provider';
import { apiFetch } from '@/lib/api';

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
    const variant = status === 'active' ? 'info' : 'secondary';
    return <Badge variant={variant}>{status === 'active' ? 'Ativo' : 'Inativo'}</Badge>;
}

export default function ClientAreaDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isChristmasTime = new Date().getMonth() === 11; // December

  useEffect(() => {
      const fetchData = async () => {
          setIsLoading(true);
          try {
              const [servicesData, invoicesData] = await Promise.all([
                  apiFetch('/api/my-services'),
                  apiFetch('/api/my-invoices'),
              ]);
              setServices(servicesData || []);
              setInvoices(invoicesData || []);
          } catch (error) {
              console.error("Failed to fetch dashboard data", error);
          } finally {
              setIsLoading(false);
          }
      };
      if (user) {
        fetchData();
      }
  }, [user]);
  
  return (
    <div className="space-y-6">
        <div className="flex items-center gap-2">
            {isChristmasTime && <Snowflake className="h-7 w-7 text-destructive" />}
            <h1 className="text-3xl font-light">Bem-vindo de volta, <span className="font-medium">{user?.name?.split(' ')[0] || 'Usuário'}</span></h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="SERVIÇOS" 
                icon={isChristmasTime ? <Gift className="h-10 w-10" /> : <Server className="h-10 w-10" />} 
                count={services?.length || 0}
                colorClass={isChristmasTime ? "bg-destructive" : "bg-chart-1"}
                isLoading={isLoading}
            />
             <StatCard 
                title="DOMÍNIOS" 
                icon={isChristmasTime ? <Snowflake className="h-10 w-10" /> : <Globe className="h-10 w-10" />} 
                count={0}
                colorClass={isChristmasTime ? "bg-sky-500" : "bg-chart-2"}
                isLoading={isLoading}
            />
             <StatCard 
                title="TICKETS" 
                icon={isChristmasTime ? <Mail className="h-10 w-10" /> : <MessageSquare className="h-10 w-10" />} 
                count={0}
                colorClass={isChristmasTime ? "bg-green-600" : "bg-chart-3"}
                isLoading={isLoading}
            />
            <StatCard 
                title="FATURAS" 
                icon={isChristmasTime ? <CandyCane className="h-10 w-10" /> : <CreditCard className="h-10 w-10" />} 
                count={invoices?.filter(inv => inv.status !== 'paid' && inv.status !== 'RECEIVED' && inv.status !== 'CONFIRMED').length || 0}
                colorClass={isChristmasTime ? "bg-amber-400" : "bg-chart-5"}
                isLoading={isLoading}
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
                {isLoading && <Skeleton className="h-24 w-full" />}
                {!isLoading && services && services.length > 0 ? (
                     <Table>
                        <TableBody>
                        {services.slice(0, 5).map(service => (
                            <TableRow key={service.id}>
                                <TableCell>{service.description || service.product_name}</TableCell>
                                <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : (
                     !isLoading && <p className="text-muted-foreground text-center py-4">Parece que você ainda não tem nenhum produto/serviço conosco. <Link href="/planos-de-hospedagem" className="text-link font-semibold hover:underline">Faça um pedido para começar</Link>.</p>
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
                    <p className="text-muted-foreground text-center py-4">O sistema de suporte por tickets está em desenvolvimento. Se precisar de ajuda, por favor <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-link font-semibold hover:underline">fale conosco no WhatsApp</a>.</p>
                </CardContent>
                 <CardFooter className="bg-muted/50 p-2 flex justify-end">
                    <Button asChild size="sm" className="bg-primary hover:bg-accent text-primary-foreground">
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
                    <Button variant="outline">Registrar</Button>
                    <Button variant="secondary">Transferir</Button>
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
