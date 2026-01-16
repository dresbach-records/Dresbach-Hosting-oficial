import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Gerencie configurações gerais, segurança, email e APIs.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Configurações em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}