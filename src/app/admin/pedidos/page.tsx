'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const orders = [
    { id: 'ORD-001', client: 'João Silva', date: '2024-07-20', total: 'R$ 49,90', status: 'Pendente' },
    { id: 'ORD-002', client: 'Maria Oliveira', date: '2024-07-19', total: 'R$ 19,90', status: 'Ativo' },
    { id: 'ORD-003', client: 'Carlos Pereira', date: '2024-07-18', total: 'R$ 99,90', status: 'Cancelado' },
];

function OrderStatusBadge({ status }: { status: string }) {
    const variant = status === 'Ativo' ? 'default' : status === 'Pendente' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{status}</Badge>;
}

export default function OrdersAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>Gerencie todos os pedidos de seus clientes.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar pedidos..." className="pl-8" />
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Pedido
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pedido ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.client}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
