'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const services = [
    { id: 'SRV-001', client: 'João Silva', product: 'Plano Pro', startDate: '2024-07-19', status: 'Ativo' },
    { id: 'SRV-002', client: 'Maria Oliveira', product: 'Plano Inicial', startDate: '2024-07-20', status: 'Suspenso' },
    { id: 'SRV-003', client: 'Carlos Pereira', product: 'Plano Business', startDate: '2024-06-18', status: 'Ativo' },
];

function ServiceStatusBadge({ status }: { status: string }) {
    const variant = status === 'Ativo' ? 'default' : status === 'Suspenso' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
}

export default function ServicesAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Produtos & Serviços</CardTitle>
                <CardDescription>Gerencie todos os produtos, planos e módulos de provisionamento.</CardDescription>
            </div>
             <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar serviços..." className="pl-8" />
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Serviço
                </Button>
            </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Produto/Serviço</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data de Início</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.product}</TableCell>
                            <TableCell>{service.client}</TableCell>
                            <TableCell>{service.startDate}</TableCell>
                            <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
