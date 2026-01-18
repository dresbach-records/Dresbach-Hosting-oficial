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
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import {
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
import { Input } from '@/components/ui/input';


const getStatusVariant = (status: string): "success" | "destructive" | "secondary" => {
    switch (status) {
        case 'active': return 'success';
        case 'suspended': return 'destructive';
        default: return 'secondary';
    }
}

const ActionButton = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <Button variant="outline" className="flex flex-col h-24 w-full items-center justify-center gap-2" disabled>
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
    const [service, setService] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!serviceId) return;

        const fetchServiceData = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<any>(`/api/my-services/${serviceId}`);
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
        
        fetchServiceData();
    }, [serviceId, toast]);


    const handleSsoLogin = async () => {
        toast({ title: "Funcionalidade em desenvolvimento." });
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
                    <Link href="#">Voltar</Link>
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
                    <span className="font-medium text-foreground"> {service.domain || service.product_name}</span>
                </p>
                <h1 className="text-3xl font-bold font-headline">{service.domain || service.product_name}</h1>
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
                                        Login no cPanel (Em Breve)
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
                                <h3 className="font-semibold text-lg">{service.description || service.product_name}</h3>
                                <p className="text-muted-foreground">Plano de Hospedagem: {service.product_name}</p>
                                <div className="flex gap-2 mt-4">
                                     <Button asChild variant="outline" disabled={!service.domain}>
                                        <a href={`http://${service.domain}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4"/> Acessar Site
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Possibilidade de uso</CardTitle></CardHeader>
                        <CardContent className="text-center py-12 text-muted-foreground">
                            A visualização de uso de recursos está em desenvolvimento.
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
                                <Input placeholder="Seu nome" disabled />
                                <div className="flex items-center">
                                    <Input value={`@${service.domain || 'dominio.com'}`} disabled className="rounded-r-none border-r-0 bg-muted text-muted-foreground"/>
                                     <Input placeholder="Senha" type="password" className="rounded-l-none" disabled/>
                                </div>
                                <Button type="submit" disabled><PlusCircle className="mr-2 h-4 w-4" /> Criar</Button>
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
                                        <TableCell>{format(new Date(service.created_at), 'dd/MM/yyyy')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Próximo Vencimento</TableCell>
                                        <TableCell>{service.next_due_date ? format(new Date(service.next_due_date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
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
