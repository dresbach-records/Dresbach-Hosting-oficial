'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemoFirebase, useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  firstName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Email inválido."),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clientDocRef = useMemoFirebase(() => user && doc(firestore, 'clients', user.uid), [firestore, user]);
    const { data: clientData, isLoading } = useDoc(clientDocRef);

    const form = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
        }
    });

    useEffect(() => {
        if (clientData) {
            form.reset({
                firstName: clientData.firstName,
                lastName: clientData.lastName,
                email: clientData.email,
                phoneNumber: clientData.phoneNumber || '',
                address: clientData.address || '',
            });
        }
    }, [clientData, form]);

    const onSubmit = async (values: ProfileForm) => {
        if (!clientDocRef) return;
        setIsSubmitting(true);
        
        const updatedData = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            address: values.address,
        };

        await updateDocumentNonBlocking(clientDocRef, updatedData);

        toast({
            title: "Perfil Atualizado",
            description: "Suas informações foram salvas com sucesso.",
        });
        setIsSubmitting(false);
    }
    
    if (isLoading) {
        return (
             <Card>
                <CardHeader><CardTitle>Meu Perfil</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-9 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-5 w-20" /><Skeleton className="h-9 w-full" /></div>
                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <FormControl><Input {...field} disabled /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phoneNumber"
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
