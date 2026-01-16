import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ServicesAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Produtos & Serviços</CardTitle>
            <CardDescription>Gerencie todos os produtos, planos e módulos de provisionamento.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Produtos & Serviços em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}