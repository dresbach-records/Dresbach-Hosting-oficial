'use client';

import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    LayoutList,
    Info,
    Download,
    Rocket,
    MessageCircle,
    Library,
} from 'lucide-react';
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function SidebarLink({ href, children, icon: Icon, active }: { href: string; children: React.ReactNode; icon: React.ElementType, active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 rounded-md",
                active && "bg-muted font-semibold text-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            <span>{children}</span>
        </Link>
    );
}

export function ClientSidebar() {
    const { user } = useUser();
    const firestore = useFirestore();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const latestTicketQuery = useMemoFirebase(() => user && query(collection(firestore, 'clients', user.uid, 'tickets'), orderBy('createdAt', 'desc'), limit(1)), [firestore, user]);
    const { data: latestTicket, isLoading: isTicketLoading } = useCollection(latestTicketQuery);

    const ticket = latestTicket?.[0];

    const supportLinks = [
        { href: '/area-do-cliente/tickets', icon: MessageSquare, label: 'Meus Tickets de Suporte' },
        { href: '#', icon: LayoutList, label: 'Anúncios' },
        { href: '#', icon: Library, label: 'Base de Conhecimento' },
        { href: '#', icon: Download, label: 'Downloads' },
        { href: '#', icon: Rocket, label: 'Status da Rede' },
    ];

    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3 px-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Últimos Tickets
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    {isTicketLoading && <Skeleton className="h-10 w-full" />}
                    {ticket && (
                        <Link href="/area-do-cliente/tickets" className="text-sm hover:underline">
                            <p className="font-semibold truncate">#{ticket.id.slice(0,6)} - {ticket.subject}</p>
                            <p className="text-primary">{ticket.status === 'Open' ? 'Aguardando Suporte' : 'Aguardando Cliente'}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                            </p>
                        </Link>
                    )}
                     {!isTicketLoading && !ticket && (
                        <p className="text-sm text-center text-muted-foreground p-2">Nenhum ticket recente.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="bg-muted/50 py-3 px-4">
                     <CardTitle className="text-base font-semibold flex items-center gap-2">
                         <Info className="h-4 w-4" /> Suporte
                     </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                    {supportLinks.map(link => (
                         // `Meus Tickets` is active for both the list and the new ticket flow.
                        <SidebarLink key={link.label} href={link.href} icon={link.icon} active={link.href !== '#' && pathname.startsWith(link.href)}>
                            {link.label}
                        </SidebarLink>
                    ))}
                </CardContent>
                 <CardFooter className="p-0 border-t">
                    <Button asChild className="w-full justify-center rounded-t-none" variant={pathname === '/area-do-cliente/tickets' && searchParams.get('new') === 'true' ? 'secondary' : 'default'}>
                       <Link href="/area-do-cliente/tickets?new=true">
                            <MessageCircle className="h-4 w-4 mr-2" /> Abrir Ticket
                       </Link>
                    </Button>
                </CardFooter>
            </Card>
        </aside>
    );
}
