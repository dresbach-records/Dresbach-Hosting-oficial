import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from 'next/link';

export default function HelpAdminPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Central de Ajuda</CardTitle>
            <CardDescription>Encontre documentação e suporte para o WHMCS.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-16">
                Consulte a <Link href="https://docs.whmcs.com/" target="_blank" className="text-primary hover:underline">documentação oficial do WHMCS</Link> para obter ajuda.
            </p>
        </CardContent>
    </Card>
  );
}
