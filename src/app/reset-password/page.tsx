'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!oobCode) {
        setError('Token de redefinição inválido ou ausente.');
        return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');

    // Placeholder: lógica de redefinição de senha com Firebase iria aqui.
    // try {
    //   await confirmPasswordReset(auth, oobCode, password);
    //   setMessage('Sua senha foi redefinida com sucesso! Você pode fazer login agora.');
    //   setTimeout(() => router.push('/login'), 3000);
    // } catch (err: any) {
    //   setError('O link de redefinição é inválido ou expirou. Por favor, tente novamente.');
    // }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMessage('Sua senha foi redefinida com sucesso! Você será redirecionado para o login.');
    setTimeout(() => router.push('/login'), 3000);
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
          <CardTitle className="text-2xl font-headline">Crie uma Nova Senha</CardTitle>
          <CardDescription>
            Escolha uma senha forte para proteger sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Redefinir Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
