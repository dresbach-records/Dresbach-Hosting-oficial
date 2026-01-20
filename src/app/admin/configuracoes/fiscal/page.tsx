'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const fiscalSettingsSchema = z.object({
    provider: z.string().min(1, "O provedor é obrigatório."),
    company_name: z.string().min(1, "A razão social é obrigatória."),
    cnpj: z.string().min(1, "O CNPJ é obrigatório."),
    municipal_registration: z.string().min(1, "A inscrição municipal é obrigatória."),
    city: z.string().min(1, "A cidade é obrigatória."),
    state: z.string().min(1, "O estado é obrigatório."),
    iss_rate: z.coerce.number().min(0, "A alíquota de ISS não pode ser negativa."),
    environment: z.enum(["Sandbox", "Produção"]),
});

type FiscalSettingsForm = z.infer<typeof fiscalSettingsSchema>;

export default function FiscalSettingsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FiscalSettingsForm>({
        resolver: zodResolver(fiscalSettingsSchema),
        defaultValues: {
            provider: '',
            company_name: '',
            cnpj: '',
            municipal_registration: '',
            city: '',
            state: '',
            iss_rate: 0,
            environment: 'Sandbox',
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<FiscalSettingsForm>('/api/admin/fiscal/settings');
                form.reset(data);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar configurações",
                    description: error.message,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [form, toast]);

    const onSubmit = async (values: FiscalSettingsForm) => {
        setIsSubmitting(true);
        try {
            await apiFetch('/api/admin/fiscal/settings', {
                method: 'PUT',
                body: JSON.stringify(values),
            });
            toast({
                title: "Configurações Salvas!",
                description: "Suas configurações fiscais foram atualizadas com sucesso.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Configurações Fiscais</CardTitle>
                    <CardDescription>Gerencie os dados da sua empresa para emissão de notas fiscais.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configurações Fiscais</CardTitle>
                <CardDescription>Gerencie os dados da sua empresa para emissão de notas fiscais.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="provider" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Provedor de NFS-e</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="company_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Razão Social</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cnpj" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CNPJ</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="municipal_registration" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inscrição Municipal</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="iss_rate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alíquota de ISS (%)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="environment" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ambiente</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o ambiente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Sandbox">Sandbox</SelectItem>
                                            <SelectItem value="Produção">Produção</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Configurações
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
