'use client';

import Link from "next/link";
import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookUser, LogOut, Plus, ShoppingCart, Globe } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function ShortcutLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ElementType }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
         <li>
            <Link href={href} className={cn("flex items-center gap-3 px-4 py-3 hover:bg-muted/50", isActive && "bg-muted/50 font-semibold")}>
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{children}</span>
            </Link>
        </li>
    );
}

export function ClientSidebar() {
    const { user } = useUser();
    const auth = useAuth();
    const pathname = usePathname();

    const isProfilePage = pathname === '/area-do-cliente/perfil';

    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 bg-muted/50 py-3 px-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <CardTitle className="text-base font-semibold">Suas Informações</CardTitle>
                    </div>
                     <Button variant={isProfilePage ? 'default' : 'outline'} size="sm" asChild className={cn('h-7', isProfilePage && 'bg-green-600 hover:bg-green-700')}>
                        <Link href="/area-do-cliente/perfil">Atualizar</Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-1">
                    <p className="font-semibold truncate">{user?.displayName || user?.email}</p>
                    {/* Placeholder for location */}
                    <p className="text-sm text-muted-foreground">Brasil</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2 bg-muted/50 py-3 px-4">
                    <BookUser className="h-5 w-5" />
                    <CardTitle className="text-base font-semibold">Contatos</CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Nenhum Contato Encontrado</p>
                    <Button variant="outline" size="sm" className="w-full shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Novo Contato...
                    </Button>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader className="flex flex-row items-center gap-2 bg-muted/50 py-3 px-4">
                    <LogOut className="h-5 w-5 rotate-180" />
                    <CardTitle className="text-base font-semibold">Atalhos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ul className="text-sm">
                       <ShortcutLink href="/planos-de-hospedagem" icon={ShoppingCart}>Contratar Novos Serviços</ShortcutLink>
                       <ShortcutLink href="/area-do-cliente/dominios" icon={Globe}>Registrar um Novo Domínio</ShortcutLink>
                        <li>
                            <button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-left">
                                <LogOut className="h-4 w-4 text-muted-foreground" />
                                <span>Sair</span>
                            </button>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </aside>
    );
}
