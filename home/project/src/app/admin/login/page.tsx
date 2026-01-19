'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';


export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && user && user.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, isAuthLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { token } = await apiFetch<{token: string}>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      await login(token);
      // The useEffect will handle redirection after user state is updated.
      
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas ou erro no servidor.');
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || (!isAuthLoading && user && user.role === 'admin')) {
    return (
        <div className="flex h-screen items-center justify-center bg-muted/40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-muted/40">
          <Card className="w-full max-w-sm">
              <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                      <Logo />
                  </div>
                  <CardTitle className="text-2xl font-headline">Acesso Restrito</CardTitle>
                  <CardDescription>
                      Painel de Administração
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                              id="email"
                              type="email"
                              placeholder="admin@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="password">Senha</Label>
                          <Input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                          />
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Entrar
                      </Button>
                  </form>
              </CardContent>
          </Card>
      </div>
    </>
  );
}
