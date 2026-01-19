'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  Unlock,
  Filter,
  Plus,
  ShoppingCart,
  Puzzle,
  Search,
  ArrowUpDown
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

function ServiceStatusBadge({ status }: { status: string }) {
    let variant: "success" | "destructive" | "warning" | "secondary" = "secondary";
    
    switch (status) {
        case 'active':
            variant = 'success';
            break;
        case 'suspended':
            variant = 'destructive';
            break;
        case 'pending':
            variant = 'warning';
            break;
    }
    
    return <Badge variant={variant}>{status}</Badge>;
}

function Sidebar({ statusCounts, onFilterChange }: { statusCounts: any, onFilterChange: (status: string) => void }) {
  return (
    <aside className="space-y-4">
      <Accordion type="multiple" defaultValue={['ver', 'acoes']}>
        <AccordionItem value="ver">
          <AccordionTrigger className="font-semibold text-base px-4 py-2 bg-muted/50 rounded-t-lg"><Filter className="mr-2 h-4 w-4" />Ver</AccordionTrigger>
          <AccordionContent className="p-4 bg-card rounded-b-lg">
            <RadioGroup defaultValue="all" onValueChange={onFilterChange}>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="r-all" className="flex-grow cursor-pointer py-1">Todos</Label>
                <Badge variant="secondary">{statusCounts.all}</Badge>
                <RadioGroupItem value="all" id="r-all" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="r-active" className="flex-grow cursor-pointer py-1">Ativo</Label>
                <Badge variant="secondary">{statusCounts.active}</Badge>
                <RadioGroupItem value="active" id="r-active" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="r-pending" className="flex-grow cursor-pointer py-1">Pendente</Label>
                 <Badge variant="secondary">{statusCounts.pending}</Badge>
                <RadioGroupItem value="pending" id="r-pending" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="r-suspended" className="flex-grow cursor-pointer py-1">Suspenso</Label>
                 <Badge variant="secondary">{statusCounts.suspended}</Badge>
                <RadioGroupItem value="suspended" id="r-suspended" />
              </div>
               <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="r-canceled" className="flex-grow cursor-pointer py-1">Cancelado</Label>
                 <Badge variant="secondary">{statusCounts.canceled}</Badge>
                <RadioGroupItem value="canceled" id="r-canceled" />
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="acoes">
          <AccordionTrigger className="font-semibold text-base px-4 py-2 bg-muted/50 rounded-t-lg"><Plus className="mr-2 h-4 w-4" />Ações</AccordionTrigger>
          <AccordionContent className="p-2 bg-card rounded-b-lg space-y-1">
             <Button variant="ghost" className="w-full justify-start"><ShoppingCart className="mr-2 h-4 w-4" />Criar ordem</Button>
             <Button variant="ghost" className="w-full justify-start"><Puzzle className="mr-2 h-4 w-4" />Ver Adicionais Disponíveis</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}


export default function ServicesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [statusFilter, setStatusFilter] = useState('all');
    const [allServices, setAllServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const data = await apiFetch<any[]>('/my-services');
                setAllServices(data || []);
                setFilteredServices(data || []);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao buscar serviços',
                    description: 'Não foi possível carregar a lista de serviços.'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, [toast]);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredServices(allServices);
        } else {
            setFilteredServices(allServices.filter(s => s.status === statusFilter));
        }
    }, [statusFilter, allServices]);

    const handleRowClick = (serviceId: string) => {
        router.push(`/area-do-cliente/servicos/${serviceId}`);
    };

    const statusCounts = useMemo(() => {
        if (isLoading || !allServices) return { active: 0, pending: 0, suspended: 0, canceled: 0, all: 0 };
        const counts = allServices.reduce((acc, service) => {
            acc[service.status] = (acc[service.status] || 0) + 1;
            return acc;
        }, { active: 0, pending: 0, suspended: 0, canceled: 0, all: 0 } as any);
        counts.all = allServices.length;
        return counts;
    }, [allServices, isLoading]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        <Sidebar statusCounts={statusCounts} onFilterChange={setStatusFilter} />
        <main>
          <div className="mb-4">
             <p className="text-sm text-muted-foreground">
                <a href="/area-do-cliente" className="hover:underline">Suporte</a> / <a href="/area-do-cliente" className="hover:underline">Área do Cliente</a> / Meus Produtos/Serviços
            </p>
            <h1 className="text-2xl font-bold">Meus Produtos/Serviços</h1>
          </div>
          <Card>
            <CardHeader className="bg-muted/50 p-4 flex-row justify-between items-center">
              <p className="text-sm">Mostrando {filteredServices?.length || 0} de {allServices?.length || 0} registros</p>
               <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Pesquisar..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">
                                <Button variant="ghost" className="px-1">Produto/Serviço <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" className="px-1">Preços <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" className="px-1">Próximo Vencimento <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
                            </TableHead>
                            <TableHead>
                               <Button variant="ghost" className="px-1">Status <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                  <div className="flex items-center gap-4">
                                      <Skeleton className="h-8 w-8 rounded-md" />
                                      <div>
                                        <Skeleton className="h-5 w-48 mb-1" />
                                        <Skeleton className="h-4 w-32" />
                                      </div>
                                  </div>
                                </TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                            </TableRow>
                        ))}
                        {filteredServices && filteredServices.length > 0 ? (
                            filteredServices.map((service) => {
                              return (
                                <TableRow key={service.id} onClick={() => handleRowClick(service.id)} className="cursor-pointer">
                                    <TableCell className="font-medium">
                                      <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-md"><Unlock className="h-4 w-4 text-green-600"/></div>
                                        <div>
                                          <p className="font-semibold">{service.description || service.product_name}</p>
                                          <p className="text-sm text-primary hover:underline">{service.domain}</p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p>R$ {service.price?.toFixed(2) || '0.00'}</p>
                                      <p className="text-xs text-muted-foreground">Mensal</p>
                                    </TableCell>
                                    <TableCell>{service.next_due_date ? format(new Date(service.next_due_date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                                    <TableCell><ServiceStatusBadge status={service.status} /></TableCell>
                                </TableRow>
                            )})
                        ) : (
                            !isLoading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">Você ainda não possui serviços.</TableCell>
                            </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter className="p-4 flex-row justify-between items-center">
               <div className="flex items-center gap-2 text-sm">
                 <span>Mostrar</span>
                 <Select defaultValue="10">
                   <SelectTrigger className="w-20">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="25">25</SelectItem>
                     <SelectItem value="50">50</SelectItem>
                   </SelectContent>
                 </Select>
                 <span>entradas</span>
               </div>
               <div className="flex items-center gap-1">
                 <Button variant="outline" size="sm" disabled>Anterior</Button>
                 <Button variant="outline" size="sm" className="bg-primary/10 border-primary">1</Button>
                 <Button variant="outline" size="sm" disabled>Próximo</Button>
               </div>
             </CardFooter>
          </Card>
        </main>
      </div>
    )
}
