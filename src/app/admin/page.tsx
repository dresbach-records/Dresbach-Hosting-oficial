'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShoppingCart, Users, LifeBuoy, AlertTriangle, Briefcase, FileX, CreditCard, Server } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

const chartData = [
  { month: 'Jan', revenue: 1860 },
  { month: 'Fev', revenue: 3050 },
  { month: 'Mar', revenue: 2370 },
  { month: 'Abr', revenue: 1730 },
  { month: 'Mai', revenue: 2090 },
  { month: 'Jun', revenue: 3140 },
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

type BalanceData = {
    balance: number;
    waiting_funds: number;
};


export default function AdminDashboard() {
  const { toast } = useToast();
  const [balance, setBalance] = React.useState<Partial<BalanceData>>({});
  const [clients, setClients] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [balanceData, clientsData] = await Promise.all([
              apiFetch<BalanceData>('/admin/financials/balance'),
              apiFetch<any[]>('/admin/clients'),
            ]);
            setBalance(balanceData);
            setClients(clientsData || []);
        } catch (error: any) {
            console.error("Error fetching dashboard data:", error);
            toast({
                variant: 'destructive',
                title: 'Falha ao carregar dados do dashboard',
                description: error.message || 'Não foi possível buscar os dados do servidor.',
            })
        }
        setIsLoading(false);
    }
    fetchData();
  }, [toast]);
    
  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <StatCard 
                title="Clientes Ativos"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                value={clients.length}
                isLoading={isLoading}
                description="Total de clientes no sistema"
             />
             <StatCard 
                title="Receita Disponível"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                value={balance.balance ? `R$ ${(balance.balance / 100).toFixed(2)}` : 'R$ 0.00'}
                isLoading={isLoading}
                description="Balanço atual na conta Asaas"
             />
              <StatCard 
                title="Receita Pendente"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                value={balance.waiting_funds ? `R$ ${(balance.waiting_funds / 100).toFixed(2)}` : 'R$ 0.00'}
                isLoading={isLoading}
                description="Aguardando compensação"
             />
             <StatCard 
                title="Tickets Abertos"
                icon={<LifeBuoy className="h-4 w-4 text-muted-foreground" />}
                value={0}
                isLoading={isLoading}
                description="Funcionalidade em breve"
             />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Visão Geral da Receita</CardTitle>
                <CardDescription>Últimos 6 meses (dados de exemplo)</CardDescription>
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
                <CardDescription>Funcionalidade em desenvolvimento</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                  (Gráfico em breve)
                </div>
            </CardContent>
            </Card>
        </div>
         
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Log de Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-center text-muted-foreground py-8">Funcionalidade de log de atividades em desenvolvimento.</p>
            </CardContent>
        </Card>

    </div>
  );
}
