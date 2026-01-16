import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DomainsAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Domínios</CardTitle>
            <CardDescription>Gerencie registros, transferências e renovações de domínios.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Domínios em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}