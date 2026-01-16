import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Painel Administrativo</h1>
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
          <CardDescription>
            O painel administrativo está em desenvolvimento. Esta é uma página temporária.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>As funcionalidades descritas, como gerenciamento de clientes, faturamento, provisionamento e suporte, serão implementadas aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
