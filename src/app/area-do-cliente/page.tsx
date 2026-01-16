'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Globe, FileText, LifeBuoy, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, icon, count, link, isLoading }: { title: string, icon: React.ReactNode, count: number, link: string, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : count}
            </div>
            <Link href={link} className="text-xs text-muted-foreground flex items-center gap-1 hover:underline">
                Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
        </CardContent>
    </Card>
);


export default function ClientAreaDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const servicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'services'), [firestore, user]);
  const domainsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'domains'), [firestore, user]);
  const invoicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'invoices'), [firestore, user]);
  const ticketsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'tickets'), [firestore, user]);

  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
  const { data: domains, isLoading: domainsLoading } = useCollection(domainsQuery);
  const { data: invoices, isLoading: invoicesLoading } = useCollection(invoicesQuery);
  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery);
  
  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Painel</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Serviços Ativos" 
                icon={<Server className="h-4 w-4 text-muted-foreground" />} 
                count={services?.length || 0}
                link="/area-do-cliente/servicos"
                isLoading={servicesLoading}
            />
             <StatCard 
                title="Domínios Registrados" 
                icon={<Globe className="h-4 w-4 text-muted-foreground" />} 
                count={domains?.length || 0}
                link="/area-do-cliente/dominios"
                isLoading={domainsLoading}
            />
             <StatCard 
                title="Faturas Pendentes" 
                icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
                count={invoices?.filter(inv => inv.status !== 'Paid').length || 0}
                link="/area-do-cliente/faturas"
                isLoading={invoicesLoading}
            />
             <StatCard 
                title="Tickets Abertos" 
                icon={<LifeBuoy className="h-4 w-4 text-muted-foreground" />} 
                count={tickets?.filter(t => t.status !== 'Closed').length || 0}
                link="/area-do-cliente/tickets"
                isLoading={ticketsLoading}
            />
        </div>
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Bem-vindo(a), {user?.displayName || user?.email}!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Aqui você pode gerenciar todos os aspectos da sua conta. Use a navegação ao lado para acessar as diferentes seções.
                    </p>
                    <Button asChild>
                        <Link href="/suporte">Precisa de Ajuda?</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
