"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type SupportClientProps = {
  getAnswer: (query: string) => Promise<string>;
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
  const [query, setQuery] = useState("");
  const [state, formAction] = useFormState(getAnswer, null);

  const handleFormAction = (formData: FormData) => {
    const query = formData.get("query") as string;
    formAction(query);
  };
  
  return (
    <div>
      <form action={handleFormAction} className="space-y-4">
        <Textarea
          name="query"
          placeholder="Digite sua dúvida sobre hospedagem ou tech ops..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
