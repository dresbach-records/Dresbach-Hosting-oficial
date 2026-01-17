'use client';

import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';


function TicketStatusBadge({ status }: { status: string }) {
    let variant: "success" | "secondary" | "outline" = "outline";
    const textMap: { [key: string]: string } = {
        'Open': 'Aberto',
        'In Progress': 'Em Progresso',
        'Closed': 'Fechado',
    }
    const currentStatus = textMap[status] || status;
    
    if (currentStatus === 'Aberto') {
        variant = 'success';
    } else if (currentStatus === 'Em Progresso') {
        variant = 'secondary';
    }

    return <Badge variant={variant}>{currentStatus}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
    let variant: "destructive" | "warning" | "secondary" = "secondary";
    const textMap: { [key: string]: string } = {
        'High': 'Alta',
        'Medium': 'Média',
        'Low': 'Baixa',
    }
    const currentPriority = textMap[priority] || priority;

    if (currentPriority === 'Alta') {
        variant = 'destructive';
    } else if (currentPriority === 'Média') {
        variant = 'warning';
    }
    return <Badge variant={variant}>{currentPriority}</Badge>;
}


export default function SupportAdminPage() {
    const firestore = useFirestore();

    const ticketsQuery = useMemoFirebase(
        () => query(collection(firestore, 'tickets'), orderBy('createdAt', 'desc')),
        [firestore]
    );
    const { data: tickets, isLoading } = useCollection(ticketsQuery);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tickets de Suporte</CardTitle>
                    <CardDescription>Gerencie tickets de suporte, departamentos e automações.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar tickets..." className="pl-8" />
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Ticket
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket ID</TableHead>
                            <TableHead>Assunto</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Última Atualização</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 5 }).map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            </TableRow>
                        ))}
                        {tickets && tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">#{ticket.id.slice(0,5)}...</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>{ticket.clientName || ticket.clientId}</TableCell>
                                    <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                                    <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
                                    <TableCell>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                             !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Nenhum ticket encontrado.</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    
