'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reports = [
    { name: 'Receita Mensal', category: 'Faturamento' },
    { name: 'Novos Clientes', category: 'Clientes' },
    { name: 'Churn Rate', category: 'Clientes' },
    { name: 'Produtos Mais Vendidos', category: 'Produtos' },
    { name: 'Tickets por Departamento', category: 'Suporte' },
];

export default function ReportsAdminPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>Visualize e exporte relatórios detalhados sobre o seu negócio.</CardDescription>
            </CardHeader>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {reports.map((report) => (
                <Card key={report.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{report.category}</p>
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                        </div>
                         <Select>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Últimos 7 dias</SelectItem>
                                <SelectItem value="30">Últimos 30 dias</SelectItem>
                                <SelectItem value="90">Últimos 90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                         <div className="text-center py-8 text-muted-foreground">
                            (Visualização do relatório aqui)
                         </div>
                         <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Exportar (CSV)
                        </Button>
                    </CardContent>
                </Card>
             ))}
        </div>
    </div>
  );
}
