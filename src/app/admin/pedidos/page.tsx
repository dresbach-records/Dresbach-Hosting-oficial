import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrdersAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>Gerencie pedidos pendentes, aprovações e o carrinho de compras.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">Página de gerenciamento de pedidos em desenvolvimento.</p>
        </CardContent>
    </Card>
  );
}
