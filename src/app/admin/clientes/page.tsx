'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Eye } from "lucide-react";
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
import { apiFetch } from '@/lib/api';

const newClientSchema = z.object({
  name: z.string().min(2, "O nome é obrigatório."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type NewClientForm = z.infer<typeof newClientSchema>;

function ClientStatusBadge({ status }: { status: string }) {
    let variant: "success" | "destructive" | "secondary" = "secondary";
    if (status === 'active') {
        variant = 'success';
    } else if (status === 'suspended') {
        variant = 'destructive';
    }
    return <Badge variant={variant}>{status}</Badge>;
}

export default function ClientsAdminPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<NewClientForm>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
        const data = await apiFetch<any[]>('/admin/clients');
        setClients(data || []);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao buscar clientes",
            description: "Não foi possível carregar a lista de clientes.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onSubmit = async (values: NewClientForm) => {
    setIsSubmitting(true);
    try {
      await apiFetch('/admin/clients', {
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
      fetchClients();
    } catch (error: any) {
      console.error("Failed to create client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar cliente",
        description: error.message || "Não foi possível criar o cliente.",
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
                    Crie uma nova conta de cliente.
                  </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
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
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                             <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))}
                    {clients && clients.length > 0 ? (
                        clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell><ClientStatusBadge status={client.status || 'active'} /></TableCell>
                                <TableCell>{format(new Date(client.created_at), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/admin/clientes/${client.id}`}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Gerenciar Cliente</span>
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        !isLoading && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Nenhum cliente encontrado.</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
