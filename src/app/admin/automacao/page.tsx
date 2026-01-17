import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AutomationAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Automação</CardTitle>
            <CardDescription>Gerencie jobs, regras de automação e eventos do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de automação em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
