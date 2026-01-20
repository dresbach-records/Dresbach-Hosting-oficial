import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Server,
  BarChart,
  LifeBuoy,
} from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const heroImage = PlaceHolderImages.find((img) => img.id === "black-friday-hero");

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Segurança Robusta",
    description:
      "Proteção multicamadas, firewalls de ponta e monitoramento 24/7 para garantir a integridade dos seus dados.",
  },
  {
    icon: <Server className="h-8 w-8 text-primary" />,
    title: "Performance Confiável",
    description:
      "Infraestrutura otimizada com SSDs NVMe e links de alta velocidade para garantir a máxima performance e uptime de 99.9%.",
  },
  {
    icon: <LifeBuoy className="h-8 w-8 text-primary" />,
    title: "Suporte Proativo",
    description:
      "Nossa equipe de especialistas (Tech Ops) antecipa problemas e oferece soluções antes que eles impactem seu negócio.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Conformidade e Governança",
    description:
      "Processos alinhados com a LGPD e as melhores práticas de mercado para garantir a governança e a segurança dos seus dados.",
  },
];

export default function GermanDarkPage() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative border-b border-border/10 py-20 sm:py-32">
        <div className="container">
          <div className="max-w-4xl text-center mx-auto">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Infraestrutura de alta performance para missões críticas.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Segurança, estabilidade e suporte especializado para empresas que não podem parar. Somos o parceiro de tecnologia que seu negócio precisa para escalar com confiança.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/tech-ops">
                  Fale com um Especialista
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/planos-de-hospedagem">
                  Ver Planos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Mais que um provedor. Um parceiro de tecnologia.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Na Dresbach, combinamos infraestrutura de ponta com expertise técnica para entregar soluções que vão além da hospedagem.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-left bg-background/30">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container">
           <div className="rounded-lg bg-card border border-border p-8 md:p-16">
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-headline text-3xl font-bold tracking-tight">
                    Precisa de uma solução sob medida?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Nossa equipe de Tech Ops é especializada em arquitetura de sistemas, segurança da informação e governança digital. Se seu desafio vai além da hospedagem convencional, nós podemos ajudar.
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/tech-ops">
                      Conheça a Consultoria Tech Ops <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}