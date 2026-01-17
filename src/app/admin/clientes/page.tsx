'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchFromGoBackend } from '@/lib/go-api';


const newClientSchema = z.object({
  firstName: z.string().min(2, "O nome é obrigatório."),
  lastName: z.string().min(2, "O sobrenome é obrigatório."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type NewClientForm = z.infer<typeof newClientSchema>;


function ClientStatusBadge({ status }: { status: string }) {
    const variant = status === 'Ativo' ? 'default' : status === 'Suspenso' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
}

export default function ClientsAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewClientForm>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const clientsQuery = useMemoFirebase(() => collection(firestore, 'clients'), [firestore]);
  const { data: clients, isLoading } = useCollection(clientsQuery);

  const onSubmit = async (values: NewClientForm) => {
    setIsSubmitting(true);
    try {
      // This endpoint in the Go backend would use the Firebase Admin SDK 
      // to create the Auth user and the Firestore document.
      await fetchFromGoBackend('/admin/create-client', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      toast({
        title: "Cliente Criado!",
        description: "O novo cliente foi adicionado com sucesso.",
      });
      setIsSubmitting(false);
      setIsDialogOpen(false);
      form.reset();
      // The useCollection hook will automatically refresh the list.
    } catch (error: any) {
      console.error("Failed to create client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar cliente",
        description: error.message || "Não foi possível criar o cliente. Verifique se o email já está em uso.",
      });
      setIsSubmitting(false);
    }
  };


  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>Gerencie todos os seus clientes.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Crie uma nova conta de cliente e um login de usuário associado.
                  </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sobrenome</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input type="email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Cliente
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        </TableRow>
                    ))}
                    {clients && clients.length > 0 ? (
                        clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.firstName} {client.lastName}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell><ClientStatusBadge status={client.status} /></TableCell>
                                <TableCell>{format(new Date(client.createdAt), 'dd/MM/yyyy')}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        !isLoading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Nenhum cliente encontrado.</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
