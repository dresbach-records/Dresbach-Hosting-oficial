'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, File, Plus } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { apiFetch } from '@/lib/api';

const newTicketSchema = z.object({
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres."),
  department: z.enum(['Suporte', 'Financeiro', 'Vendas']),
  related_service_id: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres."),
});

type NewTicketForm = z.infer<typeof newTicketSchema>;

function TicketStatusBadge({ status }: { status: string }) {
    let variant: "success" | "secondary" | "outline" = "outline";
    
    switch (status) {
        case 'open':
            variant = 'success';
            break;
        case 'in-progress':
            variant = 'secondary';
            break;
    }
    
    return <Badge variant={variant}>{status}</Badge>;
}

const priorityMap: { [key: string]: { text: string; variant: "destructive" | "warning" | "secondary" } } = {
    'low': { text: 'Baixa', variant: 'secondary' },
    'medium': { text: 'Média', variant: 'warning' },
    'high': { text: 'Alta', variant: 'destructive' },
};

function TicketPriorityBadge({ priority }: { priority: string }) {
    const priorityInfo = priorityMap[priority.toLowerCase()] || { text: priority, variant: 'secondary' };
    return <Badge variant={priorityInfo.variant}>{priorityInfo.text}</Badge>
}

function NewTicketForm() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingServices(true);
            try {
                const data = await apiFetch<any[]>('/v1/client/services');
                setServices(data || []);
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setIsLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    const form = useForm<NewTicketForm>({
        resolver: zodResolver(newTicketSchema),
        defaultValues: {
            subject: '',
            description: '',
            department: 'Suporte',
            priority: 'medium',
            related_service_id: 'Nenhum',
        }
    });

    const onSubmit = async (values: NewTicketForm) => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            await apiFetch('/v1/client/tickets', {
                method: 'POST',
                body: JSON.stringify(values),
            });

            toast({
                title: "Ticket Enviado!",
                description: "Sua solicitação foi recebida e será analisada em breve.",
            });
            setIsSubmitting(false);
            router.push('/area-do-cliente/tickets');
        } catch (error: any) {
            console.error("Error creating ticket:", error);
            toast({
                variant: "destructive",
                title: "Erro ao criar ticket",
                description: error.message || "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
            });
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
             <p className="text-sm text-muted-foreground">
                <Link href="/area-do-cliente" className="hover:underline">Suporte</Link> / 
                <Link href="/area-do-cliente" className="hover:underline"> Área do Cliente</Link> / 
                <Link href="/area-do-cliente/tickets" className="hover:underline"> Tickets de Suporte</Link> / 
                <span className="font-medium text-foreground"> Enviar Ticket</span>
            </p>
            <Card>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle className="text-2xl">Abrir Ticket</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl><Input value={user?.name || ''} disabled /></FormControl>
                                </FormItem>
                                 <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl><Input value={user?.email || ''} disabled /></FormControl>
                                </FormItem>
                            </div>
                             <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assunto</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Departamento</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Suporte">Suporte</SelectItem>
                                                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                                                    <SelectItem value="Vendas">Vendas</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="related_service_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serviço Relacionado</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger>{isLoadingServices ? 'Carregando...' : <SelectValue />}</SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Nenhum">Nenhum</SelectItem>
                                                    {services?.map(service => (
                                                        <SelectItem key={service.id} value={service.id}>{service.domain} ({service.service_type})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prioridade</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="low">Baixa</SelectItem>
                                                    <SelectItem value="medium">Média</SelectItem>
                                                    <SelectItem value="high">Alta</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mensagem</FormLabel>
                                        <FormControl><Textarea rows={8} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Anexos</FormLabel>
                                 <div className="flex items-center gap-2">
                                    <div className="flex-grow">
                                        <Input type="file" id="attachment" />
                                        <p className="text-xs text-muted-foreground mt-1">Extensões permitidas: .jpg, .gif, .jpeg, .png, .pdf, .zip, .rar</p>
                                    </div>
                                    <Button type="button" variant="outline"><Plus className="mr-2 h-4 w-4" />Adicionar Mais</Button>
                                </div>
                            </FormItem>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/area-do-cliente/tickets')}>
                                Cancelar
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}

function TicketsList() {
    const router = useRouter();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<any[]>('/v1/client/tickets');
                setTickets(data || []);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Erro ao buscar tickets',
                    description: 'Não foi possível carregar a lista de tickets.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, [toast]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Meus Tickets de Suporte</CardTitle>
                <CardDescription>Acompanhe e gerencie todas as suas solicitações de suporte.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Assunto</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Última Atualização</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            </TableRow>
                        ))}
                        {tickets && tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} className="cursor-pointer" onClick={() => router.push(`/area-do-cliente/tickets/${ticket.id}`)}>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell><TicketPriorityBadge priority={ticket.priority} /></TableCell>
                                    <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
                                    <TableCell>{format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Nenhum ticket encontrado.</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function TicketsPageContent() {
    const searchParams = useSearchParams();
    const showNewTicketFlow = searchParams.get('new') === 'true';

    if (showNewTicketFlow) {
        return <NewTicketForm />;
    }
    
    return <TicketsList />;
}

export default function TicketsPage() {
    return (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <TicketsPageContent />
        </Suspense>
    )
}
