import { intelligentSupportAssistant } from "@/ai/flows/intelligent-support-assistant";
import { SupportClient } from "./intelligent-support-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Bot, MessageSquare, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  async function getAnswer(prevState: string | null, formData: FormData): Promise<string> {
    "use server";
    const query = formData.get("query") as string;
    if (!query) {
      return "Por favor, insira uma pergunta.";
    }

    try {
      const result = await intelligentSupportAssistant({ query });
      return result.answer;
    } catch (error) {
      console.error(error);
      return "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente um de nossos outros canais de suporte.";
    }
  }

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
              <SupportClient getAnswer={getAnswer} />
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
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><Ticket className="h-5 w-5 text-accent"/> Tickets de Suporte</CardTitle>
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
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><MessageSquare className="h-5 w-5 text-accent"/> WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Para atendimento rápido e dúvidas gerais, fale conosco no WhatsApp.</p>
                    <Button asChild variant="outline">
                        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
                    </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
