import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LogsAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Logs & Auditoria</CardTitle>
            <CardDescription>Consulte logs de acesso, auditoria, WHM e financeiros.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de logs em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
