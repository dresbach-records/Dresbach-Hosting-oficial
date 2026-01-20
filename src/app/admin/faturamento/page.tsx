'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { format } from 'date-fns';

function TransactionStatusBadge({ status }: { status: string }) {
    let variant: "success" | "destructive" | "warning" | "secondary" = "secondary";
    if (status === 'CONFIRMED' || status === 'RECEIVED') {
        variant = 'success';
    } else if (status === 'PENDING') {
        variant = 'warning';
    }
    return <Badge variant={variant}>{status}</Badge>;
}

export default function BillingAdminPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<any[]>('/api/admin/financials/transactions');
        setTransactions(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao buscar transações",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [toast]);

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Transações Financeiras</CardTitle>
                <CardDescription>Gerencie e visualize todas as transações.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar transações..." className="pl-8" />
                </div>
            </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID da Transação</TableHead>
                        <TableHead>Cliente ID</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      </TableRow>
                    ))}
                    {transactions && transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.id}</TableCell>
                            <TableCell>{tx.customer}</TableCell>
                            <TableCell>R$ {tx.value.toFixed(2)}</TableCell>
                            <TableCell>{format(new Date(tx.dateCreated), 'dd/MM/yyyy')}</TableCell>
                            <TableCell><TransactionStatusBadge status={tx.status} /></TableCell>
                        </TableRow>
                    ))) : (
                      !isLoading && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">Nenhuma transação encontrada.</TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
