'use client';

import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

function ServiceStatusBadge({ status }: { status: string }) {
    const variant = status === 'Ativo' || status === 'Active' ? 'default' : status === 'Suspenso' || status === 'Suspended' ? 'destructive' : 'secondary';
    const text = status === 'Active' ? 'Ativo' : status === 'Suspended' ? 'Suspenso' : 'Pendente';
    return <Badge variant={variant}>{text}</Badge>;
}

export default function ServicesAdminPage() {
    const firestore = useFirestore();

    const servicesQuery = useMemoFirebase(
        () => query(collection(firestore, 'services'), orderBy('startDate', 'desc')),
        [firestore]
    );
    const { data: services, isLoading } = useCollection(servicesQuery);

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
                                <TableCell colSpan={5} className="text-center">Nenhum serviço encontrado. Os serviços aparecerão aqui após serem provisionados.</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}

    
