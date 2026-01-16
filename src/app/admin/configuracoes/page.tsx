import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

function SettingsSection({ title, description }: { title: string, description: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">Configurações para {title.toLowerCase()} em desenvolvimento.</p>
                <div className="flex justify-end">
                    <Button>Salvar Alterações</Button>
                </div>
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
                <CardDescription>Gerencie configurações gerais, segurança, faturamento, email e APIs.</CardDescription>
            </CardHeader>
        </Card>
        <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            <TabsContent value="geral">
                <SettingsSection title="Configurações Gerais" description="Nome da empresa, moeda, idioma, fuso horário." />
            </TabsContent>
            <TabsContent value="seguranca">
                 <SettingsSection title="Segurança" description="Permissões, 2FA, logs, IP whitelist, rate limit." />
            </TabsContent>
            <TabsContent value="faturamento">
                 <SettingsSection title="Faturamento" description="Gateways de pagamento, moedas, impostos." />
            </TabsContent>
            <TabsContent value="email">
                 <SettingsSection title="Email" description="Configuração de SMTP, templates de email." />
            </TabsContent>
            <TabsContent value="api">
                 <SettingsSection title="API" description="Gerencie tokens de API, webhooks e logs." />
            </TabsContent>
        </Tabs>
    </div>
  );
}
