'use client';

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function HostingPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<any[]>('/api/products/vps');
        setPlans(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar planos",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [toast]);
  
  return (
    <div className="bg-background">
      <div className="container py-16 sm:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Planos de Hospedagem
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Escolha o plano que melhor se adapta às suas necessidades. Contratação rápida e fácil através do nosso painel de cliente.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {isLoading && Array.from({length: 3}).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-8 w-3/5 mx-auto" /><Skeleton className="h-10 w-2/5 mx-auto mt-4" /></CardHeader>
              <CardContent><Skeleton className="h-32 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
          {plans.map((plan, index) => (
            <Card key={plan.id} className={`flex flex-col text-center ${index === 1 ? 'border-primary ring-2 ring-primary' : 'border-border'}`}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4 text-left">
                  {plan.features?.map((feature: string) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${index === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`} asChild>
                  <Link href="/pedido">{plan.cta || 'Contratar Agora'}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {!isLoading && plans.length === 0 && (
          <p className="text-center mt-12 text-muted-foreground">Não foi possível carregar os planos no momento.</p>
        )}
        <p className="text-center mt-12 text-muted-foreground">
          Precisa de uma solução personalizada? <Link href="/tech-ops" className="font-semibold text-primary hover:underline">Fale com nossa equipe de Tech Ops</Link>.
        </p>
      </div>
    </div>
  );
}
