'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DomainsPage() {
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
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">
                                A funcionalidade de gerenciamento de domínios está em desenvolvimento.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
