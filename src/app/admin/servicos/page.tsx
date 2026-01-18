'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ServicesAdminPage() {
    
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Produtos & Serviços</CardTitle>
                <CardDescription>Gerencie todos os produtos, planos e módulos de provisionamento.</CardDescription>
            </div>
             <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar serviços..." className="pl-8" />
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Serviço
                </Button>
            </div>
        </CardHeader>
        <CardContent>
             <div className="text-center py-16 text-muted-foreground">
                <p className="mb-2">A listagem e gerenciamento de serviços de clientes está em desenvolvimento.</p>
                <p className="text-sm">As funcionalidades de criar, suspender e reativar serviços estarão disponíveis aqui em breve.</p>
             </div>
        </CardContent>
    </Card>
  );
}
