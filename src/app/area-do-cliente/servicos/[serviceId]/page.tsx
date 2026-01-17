'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  LogIn,
  Mail,
  Server,
  Globe,
  Database,
  BarChart2,
  File,
  HardDrive,
  Users,
  Shield,
  Clock,
  PlusCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Input } from '@/components/ui/input';

const chartConfig = {
  used: { label: "Usado", color: "hsl(var(--chart-1))" },
  free: { label: "Livre", color: "hsl(var(--muted))" },
};

type SummaryData = {
    disk_limit: number;
    disk_used: number;
    email_accounts_limit: number;
    email_accounts_used: number;
    mysql_db_limit: number;
    mysql_db_used: number;
    bandwidth_limit: number;
    bandwidth_used: number;
    is_mock: boolean;
};

const getStatusVariant = (status: string): "success" | "destructive" | "secondary" => {
    switch (status) {
        case 'Active': return 'success';
        case 'Suspended': return 'destructive';
        default: return 'secondary';
    }
}

const UsageChart = ({ title, used, total, unit, isLoading, isUnlimited }: { title: string, used: number, total: number, unit: string, isLoading: boolean, isUnlimited: boolean }) => {
    
    if (isLoading) {
        return <div className="flex flex-col items-center">
            <Skeleton className="h-[120px] w-[120px] rounded-full" />
            <Skeleton className="h-5 w-24 mt-2" />
            <Skeleton className="h-4 w-20 mt-1" />
        </div>
    }

    if (isUnlimited) {
        return (
             <div className="flex flex-col items-center text-center">
                <div className="h-[120px] flex items-center justify-center">
                    <p className="text-4xl font-bold">∞</p>
                </div>
                <p className="font-semibold mt-2 text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{used > 0 ? `${used.toFixed(2)} ${unit} utilizados` : 'Ilimitado'}</p>
            </div>
        )
    }

    const usagePercentage = total > 0 ? (used / total) * 100 : 0;
    const chartData = [
        { name: 'used', value: used, fill: `hsl(var(--chart-1))` },
        { name: 'free', value: Math.max(0, total - used), fill: `hsl(var(--muted))` }
    ];

    return (
        <div className="flex flex-col items-center text-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[120px]">
                <ResponsiveContainer>
                    <PieChart>
                         <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel formatter={(value, name) => <span>{value.toFixed(2)} {unit}</span>} />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={40}
                            outerRadius={50}
                            strokeWidth={5}
                            startAngle={90}
                            endAngle={450}
                        >
                             <Cell key="cell-0" fill={chartData[0].fill} />
                             <Cell key="cell-1" fill={chartData[1].fill} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            <p className="font-semibold mt-2 text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{`${used.toFixed(2)} ${unit} / ${total.toFixed(2)} ${unit}`}</p>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <Button variant="outline" className="flex flex-col h-24 w-full items-center justify-center gap-2">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <span className="text-xs text-center">{label}</span>
    </Button>
);

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.serviceId as string;
    const { toast } = useToast();

    const [isSsoLoading, setIsSsoLoading] = useState(false);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    const [service, setService] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!serviceId) return;

        const fetchServiceData = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<any>(`/v1/client/services/${serviceId}`);
                setService(data);
            } catch (error: any) {
                console.error("Failed to fetch service data:", error);
                 toast({
                    variant: 'destructive',
                    title: 'Falha ao buscar detalhes do serviço',
                    description: error.message || 'Não foi possível carregar os dados do serviço.',
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        const fetchSummary = async () => {
            setIsSummaryLoading(true);
            try {
                const data = await apiFetch<SummaryData>(`/v1/client/services/${serviceId}/summary`);
                setSummary(data);
            } catch (error: any) {
                console.error("Failed to fetch account summary:", error);
                 toast({
                    variant: 'destructive',
                    title: 'Falha ao buscar resumo',
                    description: error.message || 'Não foi possível carregar os dados de uso da conta.',
                });
            } finally {
                setIsSummaryLoading(false);
            }
        };

        fetchServiceData();
        fetchSummary();
    }, [serviceId, toast]);


    const handleSsoLogin = async () => {
        if (!serviceId) return;
        setIsSsoLoading(true);

        try {
            const response = await apiFetch<{ url: string }>(
                `/v1/client/services/${serviceId}/sso`, 
                { method: 'POST' }
            );
            window.open(response.url, '_blank');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Falha no Login Automático',
                description: error.message || 'Não foi possível gerar a sessão de login.',
            });
        } finally {
            setIsSsoLoading(false);
        }
    }


    if (isLoading) {
        return <div className="space-y-4">
             <Skeleton className="h-10 w-48" />
             <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                <Skeleton className="h-64 w-full" />
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
             </div>
        </div>
    }

    if (!service) {
        return (
             <div>
                <h1 className="text-2xl font-bold">Serviço não encontrado</h1>
                <p>O serviço que você está tentando acessar não foi encontrado.</p>
                 <Button asChild variant="outline" className="mt-4" onClick={() => router.back()}>
                    <Link href="#"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
                </Button>
            </div>
        )
    }

    const shortcuts = [
        { icon: Mail, label: 'Contas de E-mail' },
        { icon: Users, label: 'Redirecionadores' },
        { icon: Clock, label: 'Auto-resposta' },
        { icon: File, label: 'Gerenciador de Arquivos' },
        { icon: Shield, label: 'Backup/Restauração' },
        { icon: Globe, label: 'Sub-domínios' },
        { icon: HardDrive, label: 'Domínios Adicionais' },
        { icon: BarChart2, label: 'Estatísticas de Visita' },
        { icon: Shield, label: 'Segurança' },
        { icon: Database, label: 'phpMyAdmin' },
    ];


    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-muted-foreground">
                    <Link href="/area-do-cliente" className="hover:underline">Início</Link> &gt; 
                    <Link href="/area-do-cliente/servicos" className="hover:underline"> Meus Serviços</Link> &gt; 
                    <span className="font-medium text-foreground"> {service.domain}</span>
                </p>
                <h1 className="text-3xl font-bold font-headline">{service.domain}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
                {/* Left Sidebar */}
                <aside className="space-y-4 sticky top-24">
                     <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Informações</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="text-sm">
                                <li>
                                    <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-3" onClick={handleSsoLogin} disabled={isSsoLoading}>
                                        {isSsoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogIn className="mr-2 h-4 w-4"/>}
                                        Login no cPanel
                                    </Button>
                                </li>
                                {['Login no Webmail', 'Mudar Senha'].map(action => (
                                    <li key={action}>
                                        <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-3" disabled>
                                            <LogIn className="mr-2 h-4 w-4"/> {action}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Plano e Domínio</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <div>
                                <h3 className="font-semibold text-lg">{service.description}</h3>
                                <p className="text-muted-foreground">Plano de Hospedagem: {service.serviceType}</p>
                                <div className="flex gap-2 mt-4">
                                     <Button asChild variant="outline">
                                        <a href={`http://${service.domain}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4"/> www
                                        </a>
                                    </Button>
                                     <Button variant="secondary">Informações do Brasil</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Possibilidade de uso</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                            <UsageChart 
                                title="Espaço em Disco" 
                                used={summary?.disk_used || 0} 
                                total={summary?.disk_limit || 0} 
                                unit="MB"
                                isLoading={isSummaryLoading}
                                isUnlimited={summary?.disk_limit === -1}
                            />
                            <UsageChart 
                                title="Uso de Banda" 
                                used={summary?.bandwidth_used || 0} 
                                total={summary?.bandwidth_limit || 0} 
                                unit="MB"
                                isLoading={isSummaryLoading}
                                isUnlimited={summary?.bandwidth_limit === -1}
                            />
                            <UsageChart 
                                title="Contas de Email" 
                                used={summary?.email_accounts_used || 0} 
                                total={summary?.email_accounts_limit || 0} 
                                unit=""
                                isLoading={isSummaryLoading}
                                isUnlimited={summary?.email_accounts_limit === -1}
                            />
                            <UsageChart 
                                title="Bancos de Dados" 
                                used={summary?.mysql_db_used || 0} 
                                total={summary?.mysql_db_limit || 0} 
                                unit=""
                                isLoading={isSummaryLoading}
                                isUnlimited={summary?.mysql_db_limit === -1}
                            />
                        </CardContent>
                         {summary?.is_mock && (
                            <CardFooter>
                                <p className="text-xs text-center text-amber-600 p-2 bg-amber-50 rounded-md border border-amber-200 w-full">Os dados de uso são simulados. Configure as credenciais do WHM no seu backend para ver os dados reais.</p>
                            </CardFooter>
                        )}
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Atalhos e Opções</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {shortcuts.map(shortcut => (
                                <ActionButton key={shortcut.label} icon={shortcut.icon} label={shortcut.label} />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Criar Conta de E-mail</CardTitle></CardHeader>
                        <CardContent>
                            <form className="flex flex-col sm:flex-row gap-2">
                                <Input placeholder="Seu nome" />
                                <div className="flex items-center">
                                    <Input value={`@${service.domain}`} disabled className="rounded-r-none border-r-0 bg-muted text-muted-foreground"/>
                                     <Input placeholder="Senha" type="password" className="rounded-l-none"/>
                                </div>
                                <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Criar</Button>
                            </form>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Faturamento e Informações</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Data de Registro</TableCell>
                                        <TableCell>{format(new Date(service.startDate), 'dd/MM/yyyy')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Próximo Vencimento</TableCell>
                                        <TableCell>
                                            {/* Placeholder */}
                                            {format(new Date().setMonth(new Date().getMonth() + 1), 'dd/MM/yyyy')}
                                        </TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="font-medium">Status</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(service.status)}>{service.status}</Badge></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </main>
            </div>
        </div>
    );
}
