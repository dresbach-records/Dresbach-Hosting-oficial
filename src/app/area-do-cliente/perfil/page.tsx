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
  // Additional fields are not in the API spec, so they are removed for now
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, isLoading, refetchUser } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
        }
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, form]);

    const onSubmit = async (values: ProfileForm) => {
        // The API spec does not include an endpoint to update user profile.
        // This is a placeholder.
        toast({
            title: "Funcionalidade em desenvolvimento",
            description: "A edição do perfil de usuário será implementada em breve.",
        });

        /*
        if (!user) return;
        setIsSubmitting(true);
        
        try {
            await apiFetch(`/api/me`, { // Assumed endpoint
                method: 'PUT',
                body: JSON.stringify(values),
            });

            toast({
                title: "Perfil Atualizado",
                description: "Suas informações foram salvas com sucesso.",
            });
            refetchUser(); // refetch user data to update the UI
        } catch(error: any) {
             toast({
                variant: 'destructive',
                title: "Erro ao atualizar perfil",
                description: error.message || "Não foi possível salvar suas informações.",
            });
        } finally {
            setIsSubmitting(false);
        }
        */
    }
    
    if (isLoading) {
        return (
             <Card>
                <CardHeader><CardTitle>Meu Perfil</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-9 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-5 w-12" /><Skeleton className="h-9 w-full" /></div>
                    <Skeleton className="h-10 w-32 mt-4" />
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
                        <Button type="submit" disabled={isSubmitting || true}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Salvar (Em Breve)
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
