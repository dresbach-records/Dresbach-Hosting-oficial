'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

function InvoiceStatusBadge({ status }: { status: string }) {
    let variant: "info" | "destructive" | "warning" = "warning";
    const textMap: { [key: string]: string } = {
        'paid': 'Pago',
        'overdue': 'Vencida',
        'unpaid': 'Pendente',
        'canceled': 'Cancelada'
    }
    // Asaas statuses
    const asaasStatusMap: { [key: string]: string } = {
        'RECEIVED': 'Pago',
        'CONFIRMED': 'Pago',
        'PENDING': 'Pendente',
        'OVERDUE': 'Vencida',
    }
    const currentStatusText = asaasStatusMap[status] || textMap[status] || status;

    if (currentStatusText === 'Pago') {
        variant = 'info';
    } else if (currentStatusText === 'Vencida') {
        variant = 'destructive';
    }
    return <Badge variant={variant}>{currentStatusText}</Badge>;
}

function InvoicesPageContent() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('from_payment')) {
            toast({
                title: "Processando Pagamento",
                description: "Seu pagamento está sendo processado. O status da fatura será atualizado em breve assim que recebermos a confirmação.",
                duration: 8000,
            });
            // Clean the URL
            router.replace('/area-do-cliente/faturas', { scroll: false });
        }
    }, [searchParams, router, toast]);

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            try {
                // Corrected API path
                const data = await apiFetch<any[]>('/my-invoices');
                setInvoices(data);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao buscar faturas',
                    description: 'Não foi possível carregar a lista de faturas.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoices();
    }, [toast]);

    const handlePayInvoice = async (invoice: any) => {
        setIsProcessingId(invoice.id);
        try {
            // Corrected API path and payload
            const response = await apiFetch<{ invoiceUrl: string }>('/checkout', {
                method: 'POST',
                body: JSON.stringify({ invoice_id: Number(invoice.id) }),
            });
            if (response.invoiceUrl) {
                window.location.href = response.invoiceUrl;
            } else {
                throw new Error("URL de pagamento não recebida do servidor.");
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erro ao Iniciar Pagamento',
                description: error.message || 'Não foi possível gerar o link de pagamento. Tente novamente.',
            });
            setIsProcessingId(null);
        }
    };
    
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
                                <TableCell className="text-right"><Skeleton className="h-8 w-28" /></TableCell>
                            </TableRow>
                        ))}
                        {invoices && invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{format(new Date(invoice.due_date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
                                    <TableCell><InvoiceStatusBadge status={invoice.status} /></TableCell>
                                    <TableCell className="text-right">
                                        {(invoice.status === 'unpaid' || invoice.status === 'overdue' || invoice.status === 'PENDING' || invoice.status === 'OVERDUE') && (
                                            <Button 
                                                size="sm" 
                                                onClick={() => handlePayInvoice(invoice)}
                                                disabled={isProcessingId === invoice.id}
                                            >
                                                {isProcessingId === invoice.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Pagar Agora
                                            </Button>
                                        )}
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

export default function InvoicesPage() {
    return (
        <Suspense fallback={
            <Card>
                <CardHeader>
                    <CardTitle>Minhas Faturas</CardTitle>
                    <CardDescription>Acompanhe seu histórico de pagamentos e faturas pendentes.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        }>
            <InvoicesPageContent />
        </Suspense>
    );
}
