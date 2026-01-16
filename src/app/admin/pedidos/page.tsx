import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrdersAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>Gerencie pedidos, carrinho e detecção de fraude.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">Área de Pedidos em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}