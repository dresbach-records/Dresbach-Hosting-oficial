'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Server, Globe, MessageSquare, CreditCard, Search, Plus, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, icon, count, colorClass, isLoading }: { title: string, icon: React.ReactNode, count: number, colorClass: string, isLoading: boolean }) => (
    <Card className="relative overflow-hidden shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
            <div className="text-muted-foreground">
                {icon}
            </div>
            <div>
                 <div className="text-3xl font-bold">
                    {isLoading ? <Skeleton className="h-8 w-10" /> : count}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 h-1 w-full ${colorClass}`}></div>
    </Card>
);


export default function ClientAreaDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const servicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'services'), [firestore, user]);
  const domainsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'domains'), [firestore, user]);
  const invoicesQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'invoices'), [firestore, user]);
  const ticketsQuery = useMemoFirebase(() => user && collection(firestore, 'clients', user.uid, 'tickets'), [firestore, user]);

  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
  const { data: domains, isLoading: domainsLoading } = useCollection(domainsQuery);
  const { data: invoices, isLoading: invoicesLoading } = useCollection(invoicesQuery);
  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery);
  
  return (
    <div className="space-y-6">
        <div>
            <p className="text-sm text-muted-foreground">Portal Home / Client Area</p>
            <h1 className="text-3xl font-light">Welcome Back, <span className="font-medium">{user?.displayName?.split(' ')[0] || 'User'}</span></h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="SERVICES" 
                icon={<Server className="h-10 w-10" />} 
                count={services?.length || 0}
                colorClass="bg-cyan-500"
                isLoading={servicesLoading}
            />
             <StatCard 
                title="DOMAINS" 
                icon={<Globe className="h-10 w-10" />} 
                count={domains?.length || 0}
                colorClass="bg-green-500"
                isLoading={domainsLoading}
            />
             <StatCard 
                title="TICKETS" 
                icon={<MessageSquare className="h-10 w-10" />} 
                count={tickets?.filter(t => t.status !== 'Closed').length || 0}
                colorClass="bg-red-500"
                isLoading={ticketsLoading}
            />
            <StatCard 
                title="INVOICES" 
                icon={<CreditCard className="h-10 w-10" />} 
                count={invoices?.filter(inv => inv.status !== 'Paid').length || 0}
                colorClass="bg-orange-500"
                isLoading={invoicesLoading}
            />
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Enter a question here to search our knowledgebase for answers..." className="pl-10 h-12 bg-card" />
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Your Active Products/Services</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-4">It appears you do not have any products/services with us yet. <Link href="/planos-de-hospedagem" className="text-accent-600 font-semibold hover:underline">Place an order to get started</Link>.</p>
            </CardContent>
            <CardFooter className="bg-muted/50 p-2 flex justify-end">
                <Button asChild size="sm" variant="outline" className="shadow-sm">
                    <Link href="/area-do-cliente/servicos">My Services</Link>
                </Button>
            </CardFooter>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-4">No Recent Tickets Found. If you need any help, please <Link href="/area-do-cliente/tickets?new=true" className="text-accent-600 font-semibold hover:underline">open a ticket</Link>.</p>
                </CardContent>
                 <CardFooter className="bg-muted/50 p-2 flex justify-end">
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                        <Link href="/area-do-cliente/tickets?new=true"><Plus className="mr-2 h-4 w-4" />Open New Ticket</Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Register a New Domain</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input placeholder="example.com" className="bg-card"/>
                    <Button className="bg-green-600 hover:bg-green-700">Register</Button>
                    <Button variant="outline" className="shadow-sm">Transfer</Button>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2"><Newspaper className="h-5 w-5" /> Recent News</CardTitle>
                <Button variant="outline" size="sm" className="shadow-sm">View All</Button>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-4">No recent news.</p>
            </CardContent>
        </Card>

    </div>
  );
}
