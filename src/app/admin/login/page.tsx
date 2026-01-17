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
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdZHk0sAAAAAPSnAIbpdQ6wXthwbzGEcdFQiGOD';

  // New state for the dev tool
  const [adminEmail, setAdminEmail] = useState('');
  const [isMakingAdmin, setIsMakingAdmin] = useState(false);
  const [makeAdminMessage, setMakeAdminMessage] = useState('');

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

        // Primeiro, o backend Go cria a sessão baseada em cookie.
        // A API de login do Go agora verifica se o usuário é admin.
        const loginResponse = await fetchFromGoBackend('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, recaptchaToken }), // recaptchaToken é validado pelo backend
        });

        // O backend retorna um erro se o login falhar ou se o usuário não for admin
        // mas aqui no frontend, também precisamos fazer o login no Firebase para ter o contexto do usuário.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idTokenResult = await userCredential.user.getIdTokenResult(true); // Força a atualização do token

        if (!idTokenResult.claims.admin) {
            await auth.signOut();
            setError('Acesso negado. Este usuário não é um administrador.');
            setIsLoading(false);
        } else {
             // O useEffect cuidará do redirecionamento
        }
      } catch (err: any) {
        if (err.message) {
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

    // New handler for the dev tool
  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMakingAdmin(true);
    setMakeAdminMessage('');
    try {
        // Este endpoint agora está protegido e requer que um admin já esteja logado
        await fetchFromGoBackend('/api/admin/make-admin', {
            method: 'POST',
            body: JSON.stringify({ email: adminEmail }),
        });
        setMakeAdminMessage(`Sucesso! ${adminEmail} agora é um administrador. Faça login para acessar o painel.`);
    } catch(err: any) {
        setMakeAdminMessage(`Erro: ${err.message}. Você precisa estar logado como admin para usar esta ferramenta.`);
    } finally {
        setIsMakingAdmin(false);
    }
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
                      <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Entrar
                      </Button>
                  </form>
              </CardContent>
          </Card>
          
          {/* New Dev Tool Card */}
          <Card className="w-full max-w-sm mt-6 border-dashed">
            <CardHeader>
                <CardTitle className="text-lg">Ferramenta de Desenvolvedor</CardTitle>
                <CardDescription>Use este formulário para conceder privilégios de administrador a um usuário existente. (Requer login de admin)</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleMakeAdmin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="admin-email">Email do Usuário</Label>
                        <Input
                            id="admin-email"
                            type="email"
                            placeholder="usuario@email.com"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                        />
                    </div>
                    {makeAdminMessage && <p className="text-sm text-muted-foreground">{makeAdminMessage}</p>}
                    <Button type="submit" className="w-full" variant="secondary" disabled={isMakingAdmin}>
                        {isMakingAdmin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tornar Administrador
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
