'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

function OrderStatusBadge({ status }: { status: string }) {
    let variant: "success" | "warning" | "secondary" = "secondary";
    if (status === 'completed') {
        variant = 'success';
    } else if (status === 'pending') {
        variant = 'warning';
    }
    return <Badge variant={variant}>{status}</Badge>;
}

export default function DomainsAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<any[]>('/admin/domain-orders');
      setOrders(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar pedidos",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiFetch(`/admin/domain-orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      toast({ title: 'Status do pedido atualizado!' });
      fetchOrders(); // Refresh the list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar pedido",
        description: error.message,
      });
    }
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Pedidos de Domínio</CardTitle>
                <CardDescription>Gerencie todos os pedidos de registro de domínio.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar domínios..." className="pl-8" />
                </div>
            </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Domínio</TableHead>
                        <TableHead>Cliente ID</TableHead>
                        <TableHead>Data do Pedido</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))}
                    {orders && orders.length > 0 ? orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.domain_name}</TableCell>
                            <TableCell>{order.client_id}</TableCell>
                            <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              {order.status === 'pending' && (
                                <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'completed')}>
                                  Marcar como Concluído
                                </Button>
                              )}
                            </TableCell>
                        </TableRow>
                    )) : (
                      !isLoading && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">Nenhum pedido de domínio encontrado.</TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
