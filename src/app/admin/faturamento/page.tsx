import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BillingAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Faturamento</CardTitle>
            <CardDescription>Gerencie faturas, pagamentos e gateways.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Faturamento em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}