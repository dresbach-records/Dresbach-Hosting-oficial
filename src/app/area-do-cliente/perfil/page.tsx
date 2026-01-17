'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/auth-provider';
import { apiFetch } from '@/lib/api';

const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Email inválido."),
  phone_number: z.string().optional(),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            address: '',
        }
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                phone_number: user.phone_number || '',
                address: user.address || '',
            });
        }
    }, [user, form]);

    const onSubmit = async (values: ProfileForm) => {
        if (!user) return;
        setIsSubmitting(true);
        
        try {
            await apiFetch(`/v1/client/profile`, {
                method: 'PUT',
                body: JSON.stringify(values),
            });

            toast({
                title: "Perfil Atualizado",
                description: "Suas informações foram salvas com sucesso.",
            });
        } catch(error: any) {
             toast({
                variant: 'destructive',
                title: "Erro ao atualizar perfil",
                description: error.message || "Não foi possível salvar suas informações.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isLoading) {
        return (
             <Card>
                <CardHeader><CardTitle>Meu Perfil</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-5 w-12" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-5 w-20" /><Skeleton className="h-9 w-full" /></div>
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais e de contato.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
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
                                    <FormControl><Input {...field} disabled /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl><Input {...field} placeholder="(XX) XXXXX-XXXX" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço</FormLabel>
                                    <FormControl><Input {...field} placeholder="Sua rua, número, bairro..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Salvar Alterações
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
