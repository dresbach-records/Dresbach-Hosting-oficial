'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const tickets = [
    { id: '#12345', subject: 'Problema com SSL', client: 'João Silva', priority: 'Alta', status: 'Aberto', lastUpdate: '2024-07-21 10:00' },
    { id: '#12346', subject: 'Dúvida sobre cobrança', client: 'Maria Oliveira', priority: 'Média', status: 'Em Progresso', lastUpdate: '2024-07-21 09:30' },
    { id: '#12347', subject: 'Servidor offline', client: 'Carlos Pereira', priority: 'Alta', status: 'Fechado', lastUpdate: '2024-07-20 18:00' },
];

function TicketStatusBadge({ status }: { status: string }) {
    const variant = status === 'Aberto' ? 'default' : status === 'Em Progresso' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
    const variant = priority === 'Alta' ? 'destructive' : priority === 'Média' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{priority}</Badge>;
}


export default function SupportAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Suporte</CardTitle>
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
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{ticket.client}</TableCell>
                            <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                            <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
                            <TableCell>{ticket.lastUpdate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
