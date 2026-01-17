import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BillingReportsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Relatórios de Faturamento</CardTitle>
            <CardDescription>Relatórios detalhados sobre faturamento e transações.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de relatórios de faturamento em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
