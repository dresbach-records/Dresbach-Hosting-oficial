import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ClientsReportsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Relatórios de Clientes</CardTitle>
            <CardDescription>Relatórios sobre aquisição de clientes, churn e atividade.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de relatórios de clientes em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
