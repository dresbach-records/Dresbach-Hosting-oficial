"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type SupportClientProps = {
  getAnswer: (prevState: string | null, formData: FormData) => Promise<string>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Enviar Pergunta
        </>
      )}
    </Button>
  );
}

export function SupportClient({ getAnswer }: SupportClientProps) {
  const [state, formAction] = useActionState(getAnswer, null);

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <Textarea
          name="query"
          placeholder="Digite sua dúvida sobre hospedagem ou tech ops..."
          rows={4}
          required
          className="bg-background"
        />
        <SubmitButton />
      </form>

      {state && (
        <Card className="mt-6 bg-card">
          <CardContent className="p-6">
            <p className="whitespace-pre-wrap font-mono text-sm">{state}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
