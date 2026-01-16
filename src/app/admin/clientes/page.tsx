import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ClientsAdminPage() {
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
                    <TableRow>
                        <TableCell>João da Silva</TableCell>
                        <TableCell>joao.silva@example.com</TableCell>
                        <TableCell><Badge>Ativo</Badge></TableCell>
                        <TableCell>15/07/2024</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>Maria Oliveira</TableCell>
                        <TableCell>maria.oliveira@example.com</TableCell>
                        <TableCell><Badge variant="secondary">Inativo</Badge></TableCell>
                        <TableCell>10/06/2024</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Pedro Martins</TableCell>
                        <TableCell>pedro.martins@example.com</TableCell>
                        <TableCell><Badge variant="destructive">Suspenso</Badge></TableCell>
                        <TableCell>01/05/2024</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}