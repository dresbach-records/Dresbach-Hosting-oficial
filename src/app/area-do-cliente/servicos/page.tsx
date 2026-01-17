'use client';

import { useMemoFirebase, useCollection, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

function ServiceStatusBadge({ status }: { status: string }) {
    let variant: "success" | "destructive" | "secondary" = "secondary";
    const textMap: { [key: string]: string } = {
        'Active': 'Ativo',
        'Suspended': 'Suspenso',
    }
    const currentStatus = textMap[status] || status;

    if (currentStatus === 'Ativo') {
        variant = 'success';
    } else if (currentStatus === 'Suspenso') {
        variant = 'destructive';
    }
    return <Badge variant={variant}>{currentStatus}</Badge>;
}

export default function ServicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const servicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'services'), [firestore, user]);
    const { data: services, isLoading } = useCollection(servicesQuery);

    const handleRowClick = (serviceId: string) => {
        router.push(`/area-do-cliente/servicos/${serviceId}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Meus Serviços</CardTitle>
                <CardDescription>Aqui estão todos os seus serviços contratados.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Serviço</TableHead>
                            <TableHead>Data de Início</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                            </TableRow>
                        ))}
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <TableRow key={service.id} onClick={() => handleRowClick(service.id)} className="cursor-pointer">
                                    <TableCell className="font-medium">{service.serviceType}</TableCell>
                                    <TableCell>{format(new Date(service.startDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            !isLoading && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">Você ainda não possui serviços.</TableCell>
                            </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
