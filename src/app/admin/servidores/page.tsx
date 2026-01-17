'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo, substituir pela API
const servers = [
    { id: 1, name: 'Servidor BR Principal', hostname: 'br1.dresbach.hosting', accounts: 150, status: 'Ativo' },
];

export default function ServersAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Servidores WHM</CardTitle>
                <CardDescription>Gerencie os servidores cPanel/WHM conectados ao sistema.</CardDescription>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Servidor
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome do Servidor</TableHead>
                        <TableHead>Hostname</TableHead>
                        <TableHead>Contas Ativas</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {servers.map((server) => (
                        <TableRow key={server.id}>
                            <TableCell className="font-medium">{server.name}</TableCell>
                            <TableCell>{server.hostname}</TableCell>
                            <TableCell>{server.accounts}</TableCell>
                            <TableCell>
                               <Badge variant={server.status === 'Ativo' ? 'default' : 'destructive'}>{server.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}