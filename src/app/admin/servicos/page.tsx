'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Power, PowerOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { format } from 'date-fns';

function ServiceStatusBadge({ status }: { status: string }) {
    let variant: "success" | "destructive" | "warning" | "secondary" = "secondary";
    if (status === 'active') {
        variant = 'success';
    } else if (status === 'suspended') {
        variant = 'destructive';
    } else if (status === 'pending_provision') {
        variant = 'warning';
    }
    return <Badge variant={variant}>{status}</Badge>;
}

export default function ServicesAdminPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch<any[]>('/api/admin/services');
            setServices(data || []);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao buscar serviços",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleUpdateStatus = async (serviceId: string, action: 'suspend' | 'reactivate') => {
        setIsUpdatingId(serviceId);
        try {
            await apiFetch(`/api/admin/services/${serviceId}/${action}`, { method: 'PUT' });
            toast({ title: `Serviço ${action === 'suspend' ? 'suspenso' : 'reativado'} com sucesso!` });
            fetchServices(); // Refresh the list
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar serviço",
                description: error.message,
            });
        } finally {
            setIsUpdatingId(null);
        }
    };

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
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Domínio</TableHead>
                            <TableHead>Próximo Vencimento</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))}
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>{service.id}</TableCell>
                                    <TableCell>{service.client_name || service.client_id}</TableCell>
                                    <TableCell>{service.product_name}</TableCell>
                                    <TableCell>{service.domain}</TableCell>
                                    <TableCell>{service.next_due_date ? format(new Date(service.next_due_date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                                    <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                                    <TableCell className="text-right">
                                        {isUpdatingId === service.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                {service.status === 'active' && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(service.id, 'suspend')} title="Suspender">
                                                        <PowerOff className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                                {service.status === 'suspended' && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(service.id, 'reactivate')} title="Reativar">
                                                        <Power className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">Nenhum serviço encontrado.</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
