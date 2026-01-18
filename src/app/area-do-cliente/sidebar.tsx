'use client';

import Link from "next/link";
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
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
                    <p className="text-sm text-center text-muted-foreground p-2">Sistema de tickets em desenvolvimento.</p>
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
