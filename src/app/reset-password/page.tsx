'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: 'As senhas não coincidem.' });
      return;
    }
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A redefinição de senha será implementada em breve.",
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
          <CardTitle className="text-2xl font-headline">Crie uma Nova Senha</CardTitle>
          <CardDescription>
            A redefinição de senha está em desenvolvimento.
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
                disabled
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
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled>
              Redefinir Senha (Em Breve)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
