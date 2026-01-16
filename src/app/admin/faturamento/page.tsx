'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const invoices = [
    { id: 'INV-001', client: 'João Silva', dueDate: '2024-08-19', total: 'R$ 49,90', status: 'Paga' },
    { id: 'INV-002', client: 'Maria Oliveira', dueDate: '2024-07-15', total: 'R$ 19,90', status: 'Vencida' },
    { id: 'INV-003', client: 'Carlos Pereira', dueDate: '2024-08-18', total: 'R$ 99,90', status: 'Pendente' },
];

function InvoiceStatusBadge({ status }: { status: string }) {
    const variant = status === 'Paga' ? 'default' : status === 'Vencida' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
}

export default function BillingAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Faturamento</CardTitle>
                <CardDescription>Gerencie faturas, pagamentos e gateways.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar faturas..." className="pl-8" />
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Fatura
                </Button>
            </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fatura #</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data de Vencimento</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>{invoice.total}</TableCell>
                            <TableCell><InvoiceStatusBadge status={invoice.status} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
