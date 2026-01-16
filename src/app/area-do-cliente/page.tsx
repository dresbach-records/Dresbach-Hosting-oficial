import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, LogIn } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const clientAreaImage = PlaceHolderImages.find((img) => img.id === "client-area");

const features = [
  "Gerenciamento de Serviços",
  "Administração de Domínios",
  "Controle de Faturas e Pagamentos",
  "Abertura e Acompanhamento de Tickets",
  "Acesso ao cPanel e Webmail",
  "Integração com Suporte via WhatsApp",
];

export default function ClientAreaPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Área do Cliente
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Nosso painel próprio, inspirado no WHMCS, oferece controle total sobre seus serviços. É a central de comando do seu projeto.
          </p>

          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center text-lg">
                <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="#"> {/* Placeholder for actual login link */}
                <LogIn className="mr-2 h-5 w-5" /> Acessar Área do Cliente
              </Link>
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          {clientAreaImage && (
            <Image
              src={clientAreaImage.imageUrl}
              alt={clientAreaImage.description}
              data-ai-hint={clientAreaImage.imageHint}
              width={600}
              height={450}
              className="rounded-lg shadow-2xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
