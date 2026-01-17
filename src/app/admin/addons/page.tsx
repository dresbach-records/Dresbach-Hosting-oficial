import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CrmAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>CRM</CardTitle>
            <CardDescription>Gerencie o relacionamento com seus clientes.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de CRM em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
