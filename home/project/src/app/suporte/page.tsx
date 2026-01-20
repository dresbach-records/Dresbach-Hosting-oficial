import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Bot, MessageSquare, Ticket, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  
  return (
    <div className="container py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Suporte Inteligente
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Suporte técnico de verdade, humano quando necessário e automatizado quando possível. Use nosso assistente de IA para respostas rápidas ou escolha um de nossos canais de atendimento.
          </p>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Bot className="h-6 w-6" />
                Assistente de Suporte Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">O assistente IA está temporariamente indisponível. Por favor, use um dos canais de suporte ao lado.</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight">
            Outras Opções
          </h2>
          <div className="mt-4 space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><Ticket className="h-5 w-5 text-primary"/> Tickets de Suporte</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Para questões técnicas detalhadas, abra um ticket em nossa Área do Cliente.</p>
                    <Button asChild variant="outline">
                        <Link href="/area-do-cliente">Abrir Ticket</Link>
                    </Button>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary"/> WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Para atendimento rápido e dúvidas gerais, fale conosco no WhatsApp.</p>
                    <Button asChild variant="outline">
                        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
                    </Button>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><Mail className="h-5 w-5 text-primary"/> E-mail de Contato</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-1 text-sm">
                        <li><a href="mailto:suporte@dresbachhosting.com.br" className="text-muted-foreground hover:text-link">suporte@dresbachhosting.com.br</a></li>
                        <li><a href="mailto:financeiro@dresbachhosting.com.br" className="text-muted-foreground hover:text-link">financeiro@dresbachhosting.com.br</a></li>
                        <li><a href="mailto:sac@dresbachhosting.com.br" className="text-muted-foreground hover:text-link">sac@dresbachhosting.com.br</a></li>
                        <li><a href="mailto:techops@dresbachhosting.com.br" className="text-muted-foreground hover:text-link">techops@dresbachhosting.com.br</a></li>
                    </ul>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
