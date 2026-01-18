'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A recuperação de senha será implementada em breve.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/40">
        <div className="absolute top-4 left-4">
             <Button asChild variant="outline">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Login
                </Link>
            </Button>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Recuperar Senha</CardTitle>
          <CardDescription>
            A recuperação de senha está em desenvolvimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled>
              Enviar Link (Em Breve)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
