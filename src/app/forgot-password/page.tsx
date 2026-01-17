'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Placeholder: a lógica de envio de email de redefinição de senha iria aqui.
    // Por exemplo, usando a função `sendPasswordResetEmail` do Firebase Auth.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Exemplo de como seria com Firebase:
    // try {
    //   await sendPasswordResetEmail(auth, email);
    //   setMessage('Um link para redefinir sua senha foi enviado para o seu e-mail.');
    // } catch (err: any) {
    //   setError('Não foi possível enviar o e-mail. Verifique se o endereço está correto.');
    // }

    setMessage('Se uma conta com este e-mail existir, um link para redefinir a senha foi enviado.');
    setIsLoading(false);
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
            Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.
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
                disabled={isLoading}
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Link de Recuperação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
