import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");
const featureGraphic = PlaceHolderImages.find((img) => img.id === "feature-graphic");
const securityFeatureImg = PlaceHolderImages.find((img) => img.id === "security-feature");
const supportFeatureImg = PlaceHolderImages.find((img) => img.id === "support-feature");
const backupFeatureImg = PlaceHolderImages.find((img) => img.id === "backup-feature");

const features = [
  {
    image: securityFeatureImg,
    title: "Controle em real-time, sem \"pegadinhas\"",
    description: "Nossa cobrança é em real e sem surpresas. Gerencie seus recursos, pague apenas pelo que usar e economize de verdade com configurações sob medida.",
  },
  {
    image: supportFeatureImg,
    title: "IP brasileiro e atendimento em português",
    description: "A segurança e a credibilidade que você precisa com um endereço IP nacional. E claro, um atendimento que fala a sua língua para resolver tudo.",
  },
  {
    image: backupFeatureImg,
    title: "Snapshot para restauração e backup",
    description: "Crie imagens de sua aplicação ou arquivos, agende backups e restaure seu ambiente com apenas alguns cliques, tudo de forma simples e segura.",
  },
];


export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Dresbach Hosting</p>
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mt-2">
                Crescimento exige boa estrutura e estabilidade.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Máquinas robustas para qualquer tipo de aplicação, alta disponibilidade com infraestrutura no Brasil e o e-mail mais completo do mercado.
              </p>
              <div className="mt-10 flex items-end gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">A partir de</p>
                    <p className="text-5xl font-bold tracking-tight text-primary">
                      <span className="text-2xl align-top">R$</span>19,90<span className="text-xl">/mês</span>
                    </p>
                  </div>

              </div>
               <div className="mt-8">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/planos-de-hospedagem">
                      Veja os planos <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
               </div>
            </div>
            <div className="flex justify-center">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={600}
                  className="rounded-lg shadow-2xl object-cover aspect-square"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section Preview */}
      <section className="py-20 sm:py-32 bg-card border-y">
        <div className="container text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Planos que entregam performance com preço justo
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Contrate o Servidor VPS Linux ou Windows com infraestrutura no Brasil, pague na moeda local e tenha o melhor custo-benefício.
          </p>
           <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/planos-de-hospedagem">
                  Conheça todos os planos
                </Link>
              </Button>
            </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
                {featureGraphic && (
                    <Image
                    src={featureGraphic.imageUrl}
                    alt={featureGraphic.description}
                    data-ai-hint={featureGraphic.imageHint}
                    width={500}
                    height={500}
                    className="rounded-lg"
                    />
                )}
            </div>
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Use nosso painel, automatize o operacional e foque na estratégia
              </h2>
              <ul className="mt-8 space-y-6 text-lg">
                <li className="flex items-start gap-4">
                  <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span><span className="font-bold">Execute, valide e automatize fluxos.</span> Como interface visual e low-code, qualquer pessoa pode criar fluxos, mesmo sem saber programar.</span>
                </li>
                <li className="flex items-start gap-4">
                  <Server className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span><span className="font-bold">Organize seus arquivos automaticamente.</span> Classifique e mova arquivos com base em regras personalizadas, sem esforço manual.</span>
                </li>
                 <li className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span><span className="font-bold">Integre várias ferramentas e unifique processos.</span> Conecte-se com e-mails, CRM e mais, tudo com lógica personalizada.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security/Performance Section */}
      <section className="py-20 sm:py-32 bg-card border-y">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Desempenho e segurança garantidos em todos os planos
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sua aplicação segura e sempre disponível com a melhor infraestrutura e um suporte que realmente resolve.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden">
                {feature.image && (
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    data-ai-hint={feature.image.imageHint}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
