'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function NewTicketForm() {
    const router = useRouter();

    return (
        <div className="space-y-4">
             <p className="text-sm text-muted-foreground">
                <Link href="/area-do-cliente" className="hover:underline">Suporte</Link> / 
                <Link href="/area-do-cliente" className="hover:underline"> Área do Cliente</Link> / 
                <Link href="/area-do-cliente/tickets" className="hover:underline"> Tickets de Suporte</Link> / 
                <span className="font-medium text-foreground"> Enviar Ticket</span>
            </p>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Abrir Ticket</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-16 text-muted-foreground">
                    <p className="mb-4">O sistema de suporte por tickets está em desenvolvimento.</p>
                    <p>Se precisar de ajuda, por favor <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-link font-semibold hover:underline">fale conosco no WhatsApp</a>.</p>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push('/area-do-cliente/tickets')}>
                        Voltar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function TicketsList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Meus Tickets de Suporte</CardTitle>
                <CardDescription>Acompanhe e gerencie todas as suas solicitações de suporte.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-16 text-muted-foreground">
                <p>O sistema de tickets de suporte está em desenvolvimento.</p>
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
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <TicketsPageContent />
        </Suspense>
    )
}
