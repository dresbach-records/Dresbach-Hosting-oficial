import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Plano Inicial",
    price: "R$ 19,90",
    period: "/mês",
    features: [
      "1 Site",
      "10 GB SSD",
      "10 Contas de Email",
      "Suporte Básico",
      "Painel de Controle",
    ],
    cta: "Contratar no Painel",
    isFeatured: false,
  },
  {
    name: "Plano Pro",
    price: "R$ 49,90",
    period: "/mês",
    features: [
      "Sites Ilimitados",
      "50 GB SSD NVMe",
      "Emails Ilimitados",
      "Suporte Prioritário",
      "Acesso SSH",
      "Backups Diários",
    ],
    cta: "Contratar no Painel",
    isFeatured: true,
  },
  {
    name: "Plano Business",
    price: "R$ 99,90",
    period: "/mês",
    features: [
      "Tudo do Pro+",
      "100 GB SSD NVMe",
      "Servidor Dedicado",
      "Suporte Especializado 24/7",
      "Consultoria Tech Ops inclusa",
    ],
    cta: "Contratar no Painel",
    isFeatured: false,
  },
];

export default function HostingPlansPage() {
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
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.isFeatured ? 'border-primary ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.isFeatured ? '' : 'variant-outline'}`} asChild>
                  <Link href="/area-do-cliente">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center mt-12 text-muted-foreground">
          Precisa de uma solução personalizada? <Link href="/tech-ops" className="font-semibold text-primary hover:underline">Fale com nossa equipe de Tech Ops</Link>.
        </p>
      </div>
    </div>
  );
}
