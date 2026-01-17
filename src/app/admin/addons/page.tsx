import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AddonsAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Gerenciador de Addons</CardTitle>
            <CardDescription>Explore e gerencie os addons disponíveis para o seu sistema.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de addons em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
