'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const domains = [
    { id: 'DOM-001', domain: 'joaosilva.com', client: 'João Silva', expiryDate: '2025-07-19', autoRenew: true },
    { id: 'DOM-002', domain: 'mariaoliveira.net', client: 'Maria Oliveira', expiryDate: '2024-12-20', autoRenew: false },
    { id: 'DOM-003', domain: 'carlospereira.org', client: 'Carlos Pereira', expiryDate: '2026-06-18', autoRenew: true },
];

export default function DomainsAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Domínios</CardTitle>
                <CardDescription>Gerencie registros, transferências e renovações de domínios.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar domínios..." className="pl-8" />
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Domínio
                </Button>
            </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Domínio</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data de Expiração</TableHead>
                        <TableHead>Auto-Renovação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {domains.map((domain) => (
                        <TableRow key={domain.id}>
                            <TableCell className="font-medium">{domain.domain}</TableCell>
                            <TableCell>{domain.client}</TableCell>
                            <TableCell>{domain.expiryDate}</TableCell>
                            <TableCell>
                                <Badge variant={domain.autoRenew ? 'default' : 'secondary'}>
                                    {domain.autoRenew ? 'Ativada' : 'Desativada'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
