'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

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
  const [services, setServices] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [balanceData, clientsData, servicesData] = await Promise.all([
              apiFetch<BalanceData>('/admin/financials/balance'),
              apiFetch<any[]>('/admin/clients'),
              apiFetch<any[]>('/admin/services'),
            ]);
            setBalance(balanceData);
            setClients(clientsData || []);
            setServices(servicesData || []);
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
                title="Balanço Financeiro"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                value={balance.balance ? `R$ ${(balance.balance / 100).toFixed(2)}` : 'R$ 0,00'}
                isLoading={isLoading}
                description="Balanço atual na conta Asaas"
             />
             <StatCard 
                title="Total de Clientes"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                value={clients.length}
                isLoading={isLoading}
                description="Total de clientes no sistema"
             />
              <StatCard 
                title="Serviços Ativos"
                icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                value={services.filter(s => s.status === 'active').length}
                isLoading={isLoading}
                description="Total de serviços com status ativo"
             />
             <StatCard 
                title="Receita Pendente"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                value={balance.waiting_funds ? `R$ ${(balance.waiting_funds / 100).toFixed(2)}` : 'R$ 0,00'}
                isLoading={isLoading}
                description="Aguardando compensação"
             />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Visão Geral da Receita</CardTitle>
                <CardDescription>Funcionalidade em desenvolvimento</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                  (Gráfico em breve)
                </div>
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
