'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';


function TicketStatusBadge({ status }: { status: string }) {
    let variant: "success" | "secondary" | "outline" = "outline";
    
    switch (status) {
        case 'open':
            variant = 'success';
            break;
        case 'in-progress':
            variant = 'secondary';
            break;
    }
    
    return <Badge variant={variant}>{status}</Badge>;
}

const priorityMap: { [key: string]: { text: string; variant: "destructive" | "warning" | "secondary" } } = {
    'low': { text: 'Baixa', variant: 'secondary' },
    'medium': { text: 'Média', variant: 'warning' },
    'high': { text: 'Alta', variant: 'destructive' },
};

function PriorityBadge({ priority }: { priority: string }) {
    const priorityInfo = priorityMap[priority.toLowerCase()] || { text: priority, variant: 'secondary' };
    return <Badge variant={priorityInfo.variant}>{priorityInfo.text}</Badge>
}


export default function SupportAdminPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<any[]>('/v1/admin/tickets');
                setTickets(data);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Erro ao buscar tickets',
                    description: 'Não foi possível carregar a lista de tickets.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, [toast]);

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
                                    <TableCell>{ticket.client_name || ticket.client_id}</TableCell>
                                    <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                                    <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
                                    <TableCell>{format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
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
