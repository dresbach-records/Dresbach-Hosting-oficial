import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight } from "lucide-react";
import Link from 'next/link';

function SettingsLinkCard({ title, description, href }: { title: string, description: string, href: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="outline">
                    <Link href={href}>
                        Gerenciar <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export default function SettingsAdminPage() {
  return (
    <div className="space-y-6">
         <Card>
            <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>Gerencie as configurações essenciais do seu negócio.</CardDescription>
            </CardHeader>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <SettingsLinkCard 
                title="Configurações Fiscais"
                description="Gerencie os dados da empresa para emissão de notas fiscais."
                href="/admin/configuracoes/fiscal"
             />
             {/* Adicionar mais cards de configuração aqui no futuro */}
        </div>
    </div>
  );
}
