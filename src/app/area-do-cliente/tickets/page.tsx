'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemoFirebase, useCollection, useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const newTicketSchema = z.object({
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres."),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres."),
  priority: z.enum(['Low', 'Medium', 'High']),
});

type NewTicketForm = z.infer<typeof newTicketSchema>;

function TicketStatusBadge({ status }: { status: string }) {
    let variant: "success" | "secondary" | "outline" = "outline";
    const textMap: { [key: string]: string } = {
        'Open': 'Aberto',
        'In Progress': 'Em Progresso',
        'Closed': 'Fechado',
    }
    const currentStatus = textMap[status] || status;

    if (currentStatus === 'Aberto') {
        variant = 'success';
    } else if (currentStatus === 'Em Progresso') {
        variant = 'secondary';
    }
    
    return <Badge variant={variant}>{currentStatus}</Badge>;
}

const priorityMap: { [key: string]: { text: string; variant: "destructive" | "warning" | "secondary" } } = {
    'Low': { text: 'Baixa', variant: 'secondary' },
    'Medium': { text: 'Média', variant: 'warning' },
    'High': { text: 'Alta', variant: 'destructive' },
};

function TicketPriorityBadge({ priority }: { priority: string }) {
    const priorityInfo = priorityMap[priority] || { text: priority, variant: 'secondary' };
    return <Badge variant={priorityInfo.variant}>{priorityInfo.text}</Badge>
}

function TicketsPageContent() {
    const { user } = useUser();
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(searchParams.get('new') === 'true');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setIsDialogOpen(true);
        }
    }, [searchParams]);
    
    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            router.replace('/area-do-cliente/tickets', { scroll: false });
        }
    }

    const ticketsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'tickets'), [firestore, user]);
    const { data: tickets, isLoading } = useCollection(ticketsQuery);

    const form = useForm<NewTicketForm>({
        resolver: zodResolver(newTicketSchema),
        defaultValues: {
            subject: '',
            description: '',
            priority: 'Medium',
        }
    });

    const onSubmit = async (values: NewTicketForm) => {
        if (!user || !firestore) return;
        setIsSubmitting(true);

        const newTicketRef = doc(collection(firestore, `clients/${user.uid}/tickets`));
        const rootTicketRef = doc(firestore, 'tickets', newTicketRef.id);

        const ticketData = {
            ...values,
            id: newTicketRef.id,
            clientId: user.uid,
            clientName: user.displayName || user.email,
            status: 'Open',
            createdAt: new Date().toISOString(),
        };

        try {
            const batch = writeBatch(firestore);
            batch.set(newTicketRef, ticketData);
            batch.set(rootTicketRef, ticketData);
            await batch.commit();

            toast({
                title: "Ticket Enviado!",
                description: "Sua solicitação foi recebida e será analisada em breve.",
            });
            setIsSubmitting(false);
            handleOpenChange(false);
            form.reset();

        } catch (error) {
            console.error("Error creating ticket:", error);
            toast({
                variant: "destructive",
                title: "Erro ao criar ticket",
                description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
            });
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tickets de Suporte</CardTitle>
                    <CardDescription>Acompanhe suas solicitações de suporte.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button>Abrir Novo Ticket</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Novo Ticket de Suporte</DialogTitle>
                            <DialogDescription>Descreva seu problema e nossa equipe responderá em breve.</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prioridade</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Low">Baixa</SelectItem>
                                                    <SelectItem value="Medium">Média</SelectItem>
                                                    <SelectItem value="High">Alta</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl><Textarea rows={5} {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Enviar Ticket
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
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell><TicketPriorityBadge priority={ticket.priority} /></TableCell>
                                    <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
                                    <TableCell>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Nenhum ticket encontrado.</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


export default function TicketsPage() {
    return (
        <Suspense>
            <TicketsPageContent />
        </Suspense>
    )
}
