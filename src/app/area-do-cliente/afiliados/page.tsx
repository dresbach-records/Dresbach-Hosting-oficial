import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AfiliadosPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Programa de Afiliados</CardTitle>
                <CardDescription>Ganhe comissões recorrentes indicando novos clientes para a Dresbach Hosting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold">Seu Link de Afiliado</h3>
                    <div className="flex items-center gap-2">
                        <Input readOnly value="https://dresbach.hosting/?ref=12345" />
                        <Button>Copiar Link</Button>
                    </div>
                     <p className="text-sm text-muted-foreground">
                        Compartilhe este link. Você receberá 20% de comissão sobre todos os pagamentos feitos pelos clientes que se cadastrarem através dele.
                    </p>
                </div>

                 <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Cliques</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                     <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Cadastros</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                     <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Comissão Pendente</p>
                        <p className="text-2xl font-bold">R$ 0,00</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
