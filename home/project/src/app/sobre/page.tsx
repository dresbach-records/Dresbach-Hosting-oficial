import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Eye, Server, Bot, Shield } from "lucide-react";

const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-us');

const values = [
    {
        icon: <Eye className="h-8 w-8 text-primary" />,
        title: "Nossa Missão",
        description: "Fornecer soluções de hospedagem e tecnologia que sejam robustas, seguras e fáceis de gerenciar, permitindo que nossos clientes foquem no crescimento de seus negócios."
    },
    {
        icon: <Server className="h-8 w-8 text-primary" />,
        title: "Infraestrutura Própria",
        description: "Investimos em hardware e software de ponta, mantendo controle total sobre nossa infraestrutura para garantir máxima performance, segurança e uptime."
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "Foco em Automação",
        description: "Automatizamos processos para entregar serviços mais rápidos, reduzir custos e permitir que nossa equipe humana foque em suporte de alto nível e soluções complexas."
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "Diferencial Tecnológico",
        description: "Desenvolvemos nosso próprio backend, painel de cliente e integrações, criando um ecossistema coeso, seguro e otimizado para as necessidades do mercado."
    },
]

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Sobre a Dresbach Hosting
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Somos mais que uma empresa de hospedagem. Somos uma empresa de tecnologia focada em infraestrutura, segurança e automação para o seu sucesso digital.
            </p>
          </div>
        </div>
      </section>

      {aboutImage && (
        <section className="container mb-16 sm:mb-24">
          <Image
            src={aboutImage.imageUrl}
            alt={aboutImage.description}
            data-ai-hint={aboutImage.imageHint}
            width={1200}
            height={500}
            className="rounded-lg shadow-lg aspect-[12/5] object-cover"
          />
        </section>
      )}

      <section className="py-16 sm:py-24 bg-card">
        <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {values.map(value => (
                    <div key={value.title}>
                        {value.icon}
                        <h3 className="mt-4 font-headline text-xl font-bold">{value.title}</h3>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}
