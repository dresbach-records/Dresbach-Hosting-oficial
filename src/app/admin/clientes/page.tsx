'use client';

import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

function ClientStatusBadge({ status }: { status: string }) {
    const variant = status === 'Ativo' ? 'default' : status === 'Suspenso' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
}

export default function ClientsAdminPage() {
  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(() => collection(firestore, 'clients'), [firestore]);
  const { data: clients, isLoading } = useCollection(clientsQuery);

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>Gerencie todos os seus clientes.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Cliente
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        </TableRow>
                    ))}
                    {clients && clients.length > 0 ? (
                        clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.firstName} {client.lastName}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell><ClientStatusBadge status={client.status} /></TableCell>
                                <TableCell>{format(new Date(client.createdAt), 'dd/MM/yyyy')}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        !isLoading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Nenhum cliente encontrado.</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
