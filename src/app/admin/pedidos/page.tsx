'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function ServiceStatusBadge({ status }: { status: string }) {
    const variant = status === 'Active' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive';
    const text = status === 'Active' ? 'Ativo' : status === 'Pending' ? 'Pendente' : 'Cancelado';
    return <Badge variant={variant}>{text}</Badge>;
}

export default function OrdersAdminPage() {
  const firestore = useFirestore();
  const servicesQuery = useMemoFirebase(() => query(collection(firestore, 'services'), orderBy('startDate', 'desc')), [firestore]);
  const { data: services, isLoading } = useCollection(servicesQuery);

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>Gerencie todos os pedidos de serviços de seus clientes.</CardDescription>
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
                        <TableHead>Serviço (Pedido)</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Domínio</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                         <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        </TableRow>
                    ))}
                    {services && services.length > 0 ? (
                        services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.serviceType}</TableCell>
                                <TableCell>{service.clientName}</TableCell>
                                <TableCell>{format(new Date(service.startDate), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{service.domain}</TableCell>
                                <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                         !isLoading && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Nenhum pedido/serviço encontrado.</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
