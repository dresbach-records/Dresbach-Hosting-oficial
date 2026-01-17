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
import { fetchFromGoBackend } from '@/lib/go-api';


export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const { user, isAdmin, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user && isAdmin) {
      router.replace('/admin');
    }
  }, [user, isAdmin, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Firebase on the client
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Get the ID token to send to the backend
      const idToken = await userCredential.user.getIdToken();

      // 3. Call the backend to create the session and bootstrap the role if necessary.
      // The backend is the source of truth for the user's role.
      const sessionData = await fetchFromGoBackend<{ isAdmin: boolean, role: string }>('/auth/session-login', {
        method: 'POST',
        body: JSON.stringify({ idToken: idToken }),
      });
      
      // 4. Check the role returned *from the backend*.
      if (!sessionData.isAdmin) {
          // If the backend says the user is not an admin, sign them out and show an error.
          await auth.signOut(); 
          setError('Acesso negado. Este usuário não é um administrador.');
          setIsLoading(false);
          return;
      }

      // 5. If successful, the user is an admin. We need to force a refresh of the user's
      // token on the client to pick up the new custom claim set by the backend.
      await userCredential.user.getIdToken(true);
      
      // The `useUser` hook will now update, and the `useEffect` above will handle the redirect.
      
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciais inválidas.');
      } else {
        console.error(err);
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
      setIsLoading(false);
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
      </div>
    </>
  );
}
