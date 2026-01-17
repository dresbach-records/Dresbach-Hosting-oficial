import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function UtilitiesAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Utilitários do Sistema</CardTitle>
            <CardDescription>Ferramentas e utilitários para gerenciamento do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de utilitários em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
