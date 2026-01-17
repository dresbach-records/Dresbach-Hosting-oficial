'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo, substituir pela API
const products = [
    { id: 1, name: 'Plano Solteiro', whmPackage: 'dresbach_solteiro', price: 'R$ 3.99/mês', status: 'Ativo' },
    { id: 2, name: 'Plano Profissional', whmPackage: 'dresbach_profissional', price: 'R$ 4.99/mês', status: 'Ativo' },
    { id: 3, name: 'Plano Negócios', whmPackage: 'dresbach_negocios', price: 'R$ 9.99/mês', status: 'Ativo' },
];

export default function ProductsAdminPage() {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Produtos & Planos</CardTitle>
                <CardDescription>Gerencie os planos de hospedagem que você oferece.</CardDescription>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Produto
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome do Produto</TableHead>
                        <TableHead>Pacote WHM</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.whmPackage}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>
                               <Badge variant={product.status === 'Ativo' ? 'default' : 'secondary'}>{product.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}