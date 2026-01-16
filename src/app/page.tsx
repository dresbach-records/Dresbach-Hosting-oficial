import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Bot,
  MessageCircle,
  Server,
  ShieldCheck,
  Smartphone,
  Download,
  Wrench,
  BadgeCheck,
} from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");

const differentiators = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-accent" />,
    title: "Segurança e LGPD",
    description: "Nossos sistemas são projetados com segurança em primeiro lugar, em conformidade com a LGPD.",
  },
  {
    icon: <Server className="h-10 w-10 text-accent" />,
    title: "Infraestrutura Própria",
    description: "Controle total sobre nossos servidores para garantir performance e estabilidade.",
  },
  {
    icon: <Bot className="h-10 w-10 text-accent" />,
    title: "Atendimento via WhatsApp",
    description: "Suporte rápido e eficiente integrado à ferramenta que você já usa todos os dias.",
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-accent" />,
    title: "Consultoria Especializada",
    description: "Nossa equipe de Tech Ops está pronta para resolver desafios complexos de tecnologia.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-accent" />,
    title: "App Android + Painel Web",
    description: "Gerencie seus serviços de qualquer lugar, a qualquer hora, com total controle.",
  },
];

const howItWorksSteps = [
  "Escolha o plano ideal para seu projeto.",
  "Crie sua conta em nosso painel exclusivo.",
  "Realize o pagamento de forma segura.",
  "Seu serviço é ativado automaticamente.",
  "Acesse o suporte via painel ou WhatsApp.",
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <div className="container">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Hospedagem Profissional com Atendimento Inteligente
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-primary-foreground/80 md:text-xl">
              Tecnologia própria, suporte humano e automação de verdade.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/planos-de-hospedagem">
                  Ver Planos de Hospedagem <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="ml-2 h-5 w-5" /> Falar no WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                <Link href="/tech-ops">
                  <Wrench className="mr-2 h-5 w-5" /> Conhecer a Tech Ops
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-headline text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="infraestrutura" className="bg-card py-16 sm:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Simples, Rápido e Eficiente
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Começar a usar nossos serviços é um processo direto e automatizado.
            </p>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-md">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Ops CTA */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground md:p-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Precisa de mais que hospedagem?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
              Nossa Tech Ops analisa, planeja e resolve seus desafios tecnológicos mais complexos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/tech-ops#diagnostico">
                  <BadgeCheck className="mr-2 h-5 w-5" /> Diagnóstico Técnico
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/tech-ops#seguranca">
                  <ShieldCheck className="mr-2 h-5 w-5" /> Consultoria em Segurança
                </Link>
              </Button>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/tech-ops#contato">
                  <MessageCircle className="mr-2 h-5 w-5" /> Falar com Especialista
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* App & Bot CTA */}
      <section className="bg-card py-16 sm:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Tenha tudo na palma da mão
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Gerencie seus serviços, acesse o suporte e controle suas faturas com nossa Área do Cliente no WhatsApp e nosso App Android oficial.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href="/app-android">
                    <Download className="mr-2 h-5 w-5" /> Baixar App
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                   <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                    <Bot className="mr-2 h-5 w-5" /> Atendimento no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
               {PlaceHolderImages.find((img) => img.id === 'app-promo') && (
                <Image
                  src={PlaceHolderImages.find((img) => img.id === 'app-promo')!.imageUrl}
                  alt={PlaceHolderImages.find((img) => img.id === 'app-promo')!.description}
                  data-ai-hint={PlaceHolderImages.find((img) => img.id === 'app-promo')!.imageHint}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
