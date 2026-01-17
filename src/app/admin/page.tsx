'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShoppingCart, Users, LifeBuoy, AlertTriangle, Briefcase, FileX, CreditCard } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: 'Jan', revenue: 1860, newClients: 12 },
  { month: 'Fev', revenue: 3050, newClients: 15 },
  { month: 'Mar', revenue: 2370, newClients: 8 },
  { month: 'Abr', revenue: 1730, newClients: 20 },
  { month: 'Mai', revenue: 2090, newClients: 18 },
  { month: 'Jun', revenue: 3140, newClients: 25 },
];

const chartConfig = {
  revenue: { label: 'Renda', color: 'hsl(var(--chart-1))' },
  newClients: { label: 'Novos Clientes', color: 'hsl(var(--chart-2))' },
}

const activityLog = [
    { actor: 'Sistema', action: 'Cron de Sincronização de Domínio: Completo', time: '3 horas atrás' },
    { actor: 'Sistema', action: 'Tarefa Automatizada: Sincronização de Status de Domínio', time: '3 horas atrás' },
    { actor: 'Admin', action: 'Login bem-sucedido', time: '4 horas atrás' },
    { actor: 'Sistema', action: 'Backup diário completo', time: '8 horas atrás' },
];


const StatCard = ({ title, icon, value, description, isLoading }: { title: string, icon: React.ReactNode, value: string | number, description?: string, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
  const firestore = useFirestore();
  const [counts, setCounts] = React.useState({
      clients: 0,
      services: 0,
      openInvoices: 0,
      openTickets: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const clientsSnap = await getCountFromServer(collection(firestore, 'clients'));
            const servicesSnap = await getCountFromServer(query(collection(firestore, 'services'), where('status', '==', 'Active')));
            const invoicesSnap = await getCountFromServer(query(collection(firestore, 'invoices'), where('status', '!=', 'Paid')));
            const ticketsSnap = await getCountFromServer(query(collection(firestore, 'tickets'), where('status', '==', 'Open')));

            setCounts({
                clients: clientsSnap.data().count,
                services: servicesSnap.data().count,
                openInvoices: invoicesSnap.data().count,
                openTickets: ticketsSnap.data().count,
            });
        } catch (error) {
            console.error("Error fetching dashboard counts:", error);
        }
        setIsLoading(false);
    }
    fetchData();
  }, [firestore]);
    
  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <StatCard 
                title="Clientes Ativos"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                value={counts.clients}
                isLoading={isLoading}
                description="Total de clientes no sistema"
             />
             <StatCard 
                title="Serviços Ativos"
                icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                value={counts.services}
                isLoading={isLoading}
                description="Total de serviços provisionados"
             />
             <StatCard 
                title="Receita Mensal (MRR)"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                value={"R$ 18.9k"} // Placeholder
                isLoading={false}
                description="+20.1% do último mês"
             />
             <StatCard 
                title="Tickets Abertos"
                icon={<LifeBuoy className="h-4 w-4 text-muted-foreground" />}
                value={counts.openTickets}
                isLoading={isLoading}
                description="Aguardando resposta do suporte"
             />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
             <StatCard 
                title="Serviços Suspensos"
                icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                value={5} // Placeholder
                isLoading={false}
             />
             <StatCard 
                title="Faturas Vencidas"
                icon={<FileX className="h-4 w-4 text-muted-foreground" />}
                value={counts.openInvoices}
                isLoading={isLoading}
             />
              <StatCard 
                title="Pedidos Pendentes"
                icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
                value={3} // Placeholder
                isLoading={false}
             />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Visão Geral da Receita</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Aquisição de Novos Clientes</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-2))" />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar yAxisId="left" dataKey="newClients" fill="var(--color-newClients)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            </Card>
        </div>
         
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Log de Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ator</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead className="text-right">Horário</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activityLog.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{log.actor}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">{log.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    </div>
  );
}
