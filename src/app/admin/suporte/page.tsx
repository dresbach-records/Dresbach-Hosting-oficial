import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SupportAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Suporte</CardTitle>
            <CardDescription>Gerencie tickets de suporte, departamentos e automações.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Suporte em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}