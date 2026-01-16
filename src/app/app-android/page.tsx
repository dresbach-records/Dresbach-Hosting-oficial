import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Smartphone, Check, Bell, MessageSquare, Download } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const appPromoImage = PlaceHolderImages.find((img) => img.id === "app-promo");

const features = [
  {
    icon: <Check className="h-6 w-6 text-primary" />,
    title: "Ver Serviços",
    description: "Acompanhe o status e os detalhes de todos os seus serviços contratados.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Abrir Tickets",
    description: "Precisa de ajuda? Abra um ticket de suporte diretamente pelo aplicativo.",
  },
  {
    icon: <Bell className="h-6 w-6 text-primary" />,
    title: "Receber Notificações",
    description: "Seja avisado sobre vencimentos de faturas, manutenções e respostas de tickets.",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    title: "Acesso Rápido ao Suporte",
    description: "Integração total com nosso painel e suporte via WhatsApp.",
  },
];

export default function AndroidAppPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                App Android Oficial
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Leve a gestão dos seus serviços no bolso. Nosso app é seguro, rápido e sincronizado em tempo real com o painel do cliente e o suporte via WhatsApp.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="#"> {/* Placeholder for Google Play link */}
                    <Download className="mr-2 h-5 w-5" /> Baixar App Android
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              {appPromoImage && (
                <Image
                  src={appPromoImage.imageUrl}
                  alt={appPromoImage.description}
                  data-ai-hint={appPromoImage.imageHint}
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-card">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Funcionalidades Essenciais
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar seus serviços de forma simples e eficiente.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold font-headline">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
