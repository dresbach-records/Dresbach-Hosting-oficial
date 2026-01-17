'use client';

import { useMemoFirebase, useCollection, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

function InvoiceStatusBadge({ status }: { status: string }) {
    let variant: "success" | "destructive" | "warning" = "warning";
    const textMap: { [key: string]: string } = {
        'Paid': 'Pago',
        'Overdue': 'Vencida',
        'Unpaid': 'Pendente',
    }
    const currentStatus = textMap[status] || status;

    if (currentStatus === 'Pago') {
        variant = 'success';
    } else if (currentStatus === 'Vencida') {
        variant = 'destructive';
    }
    return <Badge variant={variant}>{currentStatus}</Badge>;
}


export default function InvoicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const invoicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'invoices'), [firestore, user]);
    const { data: invoices, isLoading } = useCollection(invoicesQuery);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Minhas Faturas</CardTitle>
                <CardDescription>Acompanhe seu histórico de pagamentos e faturas pendentes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fatura #</TableHead>
                            <TableHead>Data de Vencimento</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {isLoading && Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                            </TableRow>
                        ))}
                        {invoices && invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id.slice(0, 8)}</TableCell>
                                    <TableCell>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
                                    <TableCell><InvoiceStatusBadge status={invoice.status} /></TableCell>
                                    <TableCell className="text-right">
                                        {invoice.status !== 'Paid' && <Button size="sm">Pagar</Button>}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Nenhuma fatura encontrada.</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
