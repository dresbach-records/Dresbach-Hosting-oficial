import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ReportsAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>Visualize relatórios detalhados sobre o seu negócio.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Relatórios em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}