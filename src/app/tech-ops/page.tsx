import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, ServerCog, HardHat, MessageCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const services = [
    {
        icon: <CheckCircle className="h-8 w-8 text-accent" />,
        title: "Diagnóstico Técnico",
        description: "Análise completa de sua infraestrutura para identificar gargalos, falhas de segurança e oportunidades de otimização."
    },
    {
        icon: <Shield className="h-8 w-8 text-accent" />,
        title: "Segurança e LGPD",
        description: "Implementação de firewalls, políticas de segurança e adequação à Lei Geral de Proteção de Dados."
    },
    {
        icon: <ServerCog className="h-8 w-8 text-accent" />,
        title: "Arquitetura de Sistemas",
        description: "Desenho de soluções escaláveis e resilientes na nuvem ou em infraestrutura dedicada."
    },
    {
        icon: <HardHat className="h-8 w-8 text-accent" />,
        title: "Correção de Problemas Críticos",
        description: "Atuação rápida para resolver incidentes que impactam seu negócio, 24/7."
    }
];

const processSteps = [
    { title: "Atendimento Inicial", description: "Contato via WhatsApp para entender sua necessidade." },
    { title: "Pré-análise Técnica", description: "Nossa equipe faz uma avaliação preliminar do seu caso." },
    { title: "Diagnóstico Pago", description: "Realizamos uma análise aprofundada para propor a solução." },
    { title: "Reunião com Especialista", description: "Apresentamos o diagnóstico e o plano de ação." },
    { title: "Plano de Ação", description: "Executamos o projeto com acompanhamento contínuo." }
];

const techOpsImage = PlaceHolderImages.find((img) => img.id === 'tech-ops-consulting');

export default function TechOpsPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-card">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                Consultoria Tech Ops
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                A Tech Ops é o time de tecnologia da Dresbach Hosting, especializado em arquitetura de sistemas, segurança da informação e governança digital. Nós resolvemos problemas que vão além da hospedagem.
              </p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" asChild>
                  <Link href="#contato">Falar com a Tech Ops</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#diagnostico">Iniciar Diagnóstico</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              {techOpsImage && (
                <Image
                  src={techOpsImage.imageUrl}
                  alt={techOpsImage.description}
                  data-ai-hint={techOpsImage.imageHint}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-16 sm:py-24">
        <div className="container text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">O que fazemos</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Do planejamento à execução, oferecemos soluções robustas para garantir a performance e segurança do seu negócio digital.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="text-left">
                <CardHeader>
                  {service.icon}
                  <CardTitle className="mt-4 font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="diagnostico" className="py-16 sm:py-24 bg-card">
        <div className="container">
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Como funciona nosso processo</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Um fluxo transparente e eficiente para entregar os melhores resultados.
                </p>
            </div>
            <div className="relative mt-12">
              <div className="absolute left-1/2 top-4 hidden h-full w-px -translate-x-1/2 bg-border md:block" aria-hidden="true"></div>
              <div className="space-y-12">
                  {processSteps.map((step, index) => (
                      <div key={step.title} className="relative flex flex-col items-center md:flex-row md:items-start md:space-x-8">
                          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4 md:mb-0">
                              {index + 1}
                          </div>
                          <div className="md:w-1/2 text-center md:text-left md:text-right md:pr-8">
                              {index % 2 !== 0 && (
                                <>
                                  <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                                  <p className="text-muted-foreground mt-2">{step.description}</p>
                                </>
                              )}
                          </div>
                          <div className="md:w-1/2 text-center md:text-left md:pl-8">
                               {index % 2 === 0 && (
                                <>
                                  <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                                  <p className="text-muted-foreground mt-2">{step.description}</p>
                                </>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
            </div>
        </div>
      </section>
      
      <section id="contato" className="py-16 sm:py-24">
        <div className="container">
          <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground md:p-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para resolver seu desafio?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
              Nossa equipe está pronta para entender sua necessidade e propor a melhor solução.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" /> Falar com um especialista
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
