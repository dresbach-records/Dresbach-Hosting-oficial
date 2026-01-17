import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SupportReportsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Relatórios de Suporte</CardTitle>
            <CardDescription>Relatórios sobre volume de tickets, tempo de resposta e satisfação.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de relatórios de suporte em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
