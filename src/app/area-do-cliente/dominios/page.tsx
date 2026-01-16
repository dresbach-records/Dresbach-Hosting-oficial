'use client';

import { useMemoFirebase, useCollection, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function DomainsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const domainsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'domains'), [firestore, user]);
    const { data: domains, isLoading } = useCollection(domainsQuery);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Meus Domínios</CardTitle>
                <CardDescription>Gerencie todos os seus nomes de domínio registrados.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Domínio</TableHead>
                            <TableHead>Data de Expiração</TableHead>
                            <TableHead>Auto-Renovação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 2 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
                            </TableRow>
                        ))}
                        {domains && domains.length > 0 ? (
                            domains.map((domain) => (
                                <TableRow key={domain.id}>
                                    <TableCell className="font-medium">{domain.domainName}</TableCell>
                                    <TableCell>{format(new Date(domain.expirationDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={domain.autoRenew ? 'default' : 'secondary'}>
                                            {domain.autoRenew ? 'Ativada' : 'Desativada'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">Você ainda não possui domínios registrados.</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
