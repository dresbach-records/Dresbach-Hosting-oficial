'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemoFirebase, useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Info,
  KeyRound,
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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Progress } from "@/components/ui/progress";
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

const UsageChart = ({ title, used, total, unit }: { title: string, used: number, total: number, unit: string }) => {
    const usagePercentage = total > 0 ? (used / total) * 100 : 0;
    const chartData = [
        { name: 'used', value: used, fill: `hsl(var(--chart-1))` },
        { name: 'free', value: total - used, fill: `hsl(var(--muted))` }
    ];

    return (
        <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[120px]">
                <ResponsiveContainer>
                    <PieChart>
                         <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={40}
                            outerRadius={50}
                            strokeWidth={5}
                        >
                             <Cell key="cell-0" fill={chartData[0].fill} />
                             <Cell key="cell-1" fill={chartData[1].fill} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            <p className="font-semibold mt-2 text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{`${used.toFixed(2)} ${unit} / ${total} ${unit}`}</p>
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
    const { user } = useUser();
    const firestore = useFirestore();
    const serviceId = params.serviceId as string;

    const serviceDocRef = useMemoFirebase(() => user && serviceId ? doc(firestore, 'clients', user.uid, 'services', serviceId) : null, [firestore, user, serviceId]);
    const { data: service, isLoading } = useDoc(serviceDocRef);

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
                                {['Login no cPanel', 'Login no Webmail', 'Mudar Senha'].map(action => (
                                    <li key={action}>
                                        <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-3">
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
                            {/* Placeholder data */}
                            <UsageChart title="Espaço em Disco" used={4.21} total={10} unit="GB"/>
                            <UsageChart title="Uso de Banda" used={6.89} total={100} unit="GB"/>
                            <UsageChart title="Contas de Email" used={2} total={10} unit=""/>
                            <UsageChart title="Bancos de Dados" used={1} total={5} unit=""/>
                        </CardContent>
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
                                        <TableCell><Badge variant={service.status === 'Active' ? 'success' : 'secondary'}>{service.status}</Badge></TableCell>
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
