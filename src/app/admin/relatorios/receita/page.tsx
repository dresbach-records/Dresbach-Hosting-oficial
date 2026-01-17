import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function IncomeReportsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Relatórios de Receita</CardTitle>
            <CardDescription>Relatórios sobre receita, projeções e métricas financeiras.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de relatórios de receita em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
