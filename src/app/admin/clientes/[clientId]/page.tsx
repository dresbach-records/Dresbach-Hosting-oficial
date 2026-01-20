'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Server, Globe, CreditCard, LifeBuoy, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import React from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ClientProfileAdminPage() {
    const params = useParams();
    const clientId = params.clientId as string;
    const { toast } = useToast();

    const [client, setClient] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    
    // For now, sub-collections are not available in the new API spec for admin
    const [services] = React.useState<any[]>([]);
    const [domains] = React.useState<any[]>([]);
    const [invoices] = React.useState<any[]>([]);
    const [tickets] = React.useState<any[]>([]);


    React.useEffect(() => {
        if (!clientId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const clientData = await apiFetch(`/api/admin/clients/${clientId}`);
                setClient(clientData);
            } catch (error) {
                console.error("Failed to fetch client data", error);
                toast({ variant: 'destructive', title: 'Erro ao buscar cliente' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [clientId, toast]);
    
    const handleDeleteClient = async () => {
      try {
        await apiFetch(`/api/admin/clients/${clientId}`, { method: 'DELETE' });
        toast({ title: 'Cliente excluído com sucesso.' });
        // Ideally, redirect back to the client list page
        window.location.href = '/admin/clientes';
      } catch (error: any) {
        console.error("Failed to delete client", error);
        toast({ variant: 'destructive', title: 'Erro ao excluir cliente', description: error.message });
      }
    }


    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <div>
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full max-w-lg" />
                <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
            </div>
        )
    }

    if (!client) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
                <p>O cliente com o ID especificado não foi encontrado.</p>
                 <Button asChild variant="outline" className="mt-4">
                    <Link href="/admin/clientes"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes</Link>
                </Button>
            </div>
        )
    }

    const getStatusVariant = (status: string): "success" | "destructive" | "secondary" => {
        switch (status) {
            case 'active': return 'success';
            case 'suspended': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="h-7 w-7">
                        <Link href="/admin/clientes"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{client.name}</h1>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4"/> Excluir Cliente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente
                        e todos os seus dados associados de nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteClient}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="services">Serviços (Em Breve)</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Perfil</CardTitle>
                            <CardDescription>Dados cadastrais do cliente. A edição será implementada em breve.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <p><strong>Nome:</strong> {client.name}</p>
                           <p><strong>Email:</strong> {client.email}</p>
                           <p><strong>ID Asaas:</strong> {client.asaas_customer_id}</p>
                           <p><strong>Status:</strong> <Badge variant={getStatusVariant(client.status || 'active')}>{client.status || 'active'}</Badge></p>
                           <p><strong>Data de Cadastro:</strong> {format(new Date(client.created_at), 'dd/MM/yyyy HH:mm')}</p>
                           <Button disabled>Salvar Alterações (Em Breve)</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="services">
                    <Card>
                        <CardHeader><CardTitle>Serviços</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-center py-16 text-muted-foreground">O gerenciamento de serviços individuais do cliente será implementado em breve.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
