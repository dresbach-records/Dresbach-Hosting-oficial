'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function DomainsPage() {
    const [domains, setDomains] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchDomains = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<any[]>('/v1/client/domains');
                setDomains(data);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao buscar domínios',
                    description: 'Não foi possível carregar a lista de domínios.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDomains();
    }, [toast]);


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
                                    <TableCell className="font-medium">{domain.domain_name}</TableCell>
                                    <TableCell>{format(new Date(domain.expiration_date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={domain.auto_renew ? 'default' : 'secondary'}>
                                            {domain.auto_renew ? 'Ativada' : 'Desativada'}
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
