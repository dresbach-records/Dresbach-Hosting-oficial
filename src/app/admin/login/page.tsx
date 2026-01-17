'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import Script from 'next/script';
import { fetchFromGoBackend } from '@/lib/go-api';


export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const { user, isAdmin, isUserLoading } = useUser();
  const siteKey = '6LdZHk0sAAAAAPSnAIbpdQ6wXthwbzGEcdFQiGOD';

  useEffect(() => {
    if (!isUserLoading && user && isAdmin) {
      router.replace('/admin');
    }
  }, [user, isAdmin, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!(window as any).grecaptcha) {
      setError("Falha ao carregar reCAPTCHA. Tente recarregar a página.");
      setIsLoading(false);
      return;
    }

    (window as any).grecaptcha.enterprise.ready(async () => {
      try {
        const recaptchaToken = await (window as any).grecaptcha.enterprise.execute(siteKey, { action: 'LOGIN' });

        // First, verify the token with our Go backend
        await fetchFromGoBackend('/auth/verify-token', {
            method: 'POST',
            body: JSON.stringify({ recaptchaToken }),
        });

        // If reCAPTCHA is valid, proceed with Firebase login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idTokenResult = await userCredential.user.getIdTokenResult();
        
        if (!idTokenResult.claims.admin) {
            await auth.signOut();
            setError('Acesso negado. Este usuário não é um administrador.');
            setIsLoading(false);
        }
        // The useEffect will handle the redirect on successful admin login
      } catch (err: any) {
        if (err.message?.includes('reCAPTCHA')) {
            setError(err.message);
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Credenciais inválidas.');
        } else {
          console.error(err);
          setError('Ocorreu um erro ao fazer login. Tente novamente.');
        }
        setIsLoading(false);
      }
    });
  };

  if (isUserLoading || (!isUserLoading && user && isAdmin)) {
    return (
        <div className="flex h-screen items-center justify-center bg-muted/40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`} />
      <div className="flex min-h-screen items-center justify-center p-6 bg-muted/40">
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
                      <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Entrar
                      </Button>
                  </form>
              </CardContent>
          </Card>
      </div>
    </>
  );
}
