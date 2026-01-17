'use client';

import { useParams } from 'next/navigation';
import { useMemoFirebase, useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Server, Globe, CreditCard, LifeBuoy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Reusable component for sub-collection tables
function ClientDataTable({ query, columns, emptyStateMessage }: { query: any, columns: { key: string, header: string, render?: (item: any) => React.ReactNode }[], emptyStateMessage: string }) {
    const { data, isLoading } = useCollection(query);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(col => <TableHead key={col.key}>{col.header}</TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        {columns.map(col => <TableCell key={col.key}><Skeleton className="h-5 w-full max-w-xs" /></TableCell>)}
                    </TableRow>
                ))}
                {data && data.length > 0 ? (
                    data.map(item => (
                        <TableRow key={item.id}>
                            {columns.map(col => (
                                <TableCell key={col.key}>
                                    {col.render ? col.render(item) : item[col.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    !isLoading && (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">{emptyStateMessage}</TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </Table>
    );
}

// Summary Stat Card component
const StatCard = ({ title, icon, count, isLoading }: { title: string, icon: React.ReactNode, count: number, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-10" /> : count}
            </div>
        </CardContent>
    </Card>
);

export default function ClientProfileAdminPage() {
    const params = useParams();
    const clientId = params.clientId as string;
    const firestore = useFirestore();

    const clientDocRef = useMemoFirebase(() => clientId ? doc(firestore, 'clients', clientId) : null, [firestore, clientId]);
    const { data: client, isLoading: isClientLoading } = useDoc(clientDocRef);

    const servicesQuery = useMemoFirebase(() => clientId ? collection(firestore, 'clients', clientId, 'services') : null, [firestore, clientId]);
    const domainsQuery = useMemoFirebase(() => clientId ? collection(firestore, 'clients', clientId, 'domains') : null, [firestore, clientId]);
    const invoicesQuery = useMemoFirebase(() => clientId ? collection(firestore, 'clients', clientId, 'invoices') : null, [firestore, clientId]);
    const ticketsQuery = useMemoFirebase(() => clientId ? collection(firestore, 'clients', clientId, 'tickets') : null, [firestore, clientId]);

    const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
    const { data: domains, isLoading: domainsLoading } = useCollection(domainsQuery);
    const { data: invoices, isLoading: invoicesLoading } = useCollection(invoicesQuery);
    const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery);

    if (isClientLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <div>
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full max-w-lg" />
                <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
            </div>
        )
    }

    if (!client) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
                <p>O cliente com o ID especificado não foi encontrado.</p>
                 <Button asChild variant="outline" className="mt-4">
                    <Link href="/admin/clientes"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes</Link>
                </Button>
            </div>
        )
    }

    const getStatusVariant = (status: string): "success" | "destructive" | "secondary" => {
        switch (status) {
            case 'Active': return 'success';
            case 'Suspended': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/clientes"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{client.firstName} {client.lastName}</h1>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
            </div>

            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="summary">Resumo</TabsTrigger>
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="services">Serviços</TabsTrigger>
                    <TabsTrigger value="domains">Domínios</TabsTrigger>
                    <TabsTrigger value="invoices">Faturas</TabsTrigger>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                    <Card>
                        <CardHeader><CardTitle>Resumo do Cliente</CardTitle></CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard 
                                    title="Serviços Ativos"
                                    icon={<Server className="h-4 w-4 text-muted-foreground" />}
                                    count={services?.filter(s => s.status === 'Active').length || 0}
                                    isLoading={servicesLoading}
                                />
                                <StatCard 
                                    title="Domínios"
                                    icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                                    count={domains?.length || 0}
                                    isLoading={domainsLoading}
                                />
                                <StatCard 
                                    title="Faturas Pendentes"
                                    icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                                    count={invoices?.filter(i => i.status !== 'Paid').length || 0}
                                    isLoading={invoicesLoading}
                                />
                                <StatCard 
                                    title="Tickets Abertos"
                                    icon={<LifeBuoy className="h-4 w-4 text-muted-foreground" />}
                                    count={tickets?.filter(t => t.status === 'Open').length || 0}
                                    isLoading={ticketsLoading}
                                />
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Perfil</CardTitle>
                            <CardDescription>Dados cadastrais do cliente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <p><strong>Nome:</strong> {client.firstName} {client.lastName}</p>
                           <p><strong>Email:</strong> {client.email}</p>
                           <p><strong>Telefone:</strong> {client.phoneNumber || 'Não informado'}</p>
                           <p><strong>Endereço:</strong> {client.address || 'Não informado'}</p>
                           <p><strong>Status:</strong> <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge></p>
                           <p><strong>Data de Cadastro:</strong> {format(new Date(client.createdAt), 'dd/MM/yyyy')}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="services">
                    <Card>
                        <CardHeader><CardTitle>Serviços</CardTitle></CardHeader>
                        <CardContent>
                             <ClientDataTable 
                                query={servicesQuery}
                                columns={[
                                    { key: 'serviceType', header: 'Serviço' },
                                    { key: 'startDate', header: 'Data de Início', render: (item) => format(new Date(item.startDate), 'dd/MM/yyyy') },
                                    { key: 'status', header: 'Status', render: (item) => <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge> }
                                ]}
                                emptyStateMessage="Nenhum serviço encontrado para este cliente."
                             />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                 <TabsContent value="domains">
                    <Card>
                        <CardHeader><CardTitle>Domínios</CardTitle></CardHeader>
                        <CardContent>
                             <ClientDataTable 
                                query={domainsQuery}
                                columns={[
                                    { key: 'domainName', header: 'Domínio' },
                                    { key: 'registrationDate', header: 'Data de Registro', render: (item) => format(new Date(item.registrationDate), 'dd/MM/yyyy') },
                                     { key: 'expirationDate', header: 'Data de Expiração', render: (item) => format(new Date(item.expirationDate), 'dd/MM/yyyy') },
                                    { key: 'autoRenew', header: 'Auto-Renovação', render: (item) => <Badge variant={item.autoRenew ? 'default' : 'secondary'}>{item.autoRenew ? 'Sim' : 'Não'}</Badge> }
                                ]}
                                emptyStateMessage="Nenhum domínio encontrado para este cliente."
                             />
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="invoices">
                    <Card>
                        <CardHeader><CardTitle>Faturas</CardTitle></CardHeader>
                        <CardContent>
                            <ClientDataTable
                                query={invoicesQuery}
                                columns={[
                                    { key: 'id', header: 'Fatura #', render: (item) => item.id.slice(0,8) },
                                    { key: 'issueDate', header: 'Data de Emissão', render: (item) => format(new Date(item.issueDate), 'dd/MM/yyyy') },
                                    { key: 'dueDate', header: 'Data de Vencimento', render: (item) => format(new Date(item.dueDate), 'dd/MM/yyyy') },
                                    { key: 'amount', header: 'Valor', render: (item) => `R$ ${item.amount.toFixed(2)}` },
                                    { key: 'status', header: 'Status', render: (item) => <Badge variant={item.status === 'Paid' ? 'success' : item.status === 'Overdue' ? 'destructive' : 'secondary'}>{item.status}</Badge> }
                                ]}
                                emptyStateMessage="Nenhuma fatura encontrada para este cliente."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tickets">
                    <Card>
                        <CardHeader><CardTitle>Tickets de Suporte</CardTitle></CardHeader>
                        <CardContent>
                            <ClientDataTable
                                query={ticketsQuery}
                                columns={[
                                    { key: 'subject', header: 'Assunto' },
                                    { key: 'priority', header: 'Prioridade', render: (item) => <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'warning' : 'secondary'}>{item.priority}</Badge> },
                                    { key: 'status', header: 'Status', render: (item) => <Badge variant={item.status === 'Open' ? 'success' : 'secondary'}>{item.status}</Badge> },
                                    { key: 'createdAt', header: 'Criado em', render: (item) => format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') }
                                ]}
                                emptyStateMessage="Nenhum ticket de suporte encontrado para este cliente."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
