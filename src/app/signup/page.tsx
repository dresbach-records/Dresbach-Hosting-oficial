'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { fetchFromGoBackend } from '@/lib/go-api';

const GoogleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.18-1.734 4.02-1.084 1.08-2.394 2.04-4.3 2.04-3.872 0-7.02-3.14-7.02-7.02s3.148-7.02 7.02-7.02c2.19 0 3.654.88 4.604 1.79l2.32-2.32C18.254 3.19 15.68.96 12.48.96c-6.12 0-11.04 4.92-11.04 11.04s4.92 11.04 11.04 11.04c6.408 0 10.728-4.42 10.728-10.728 0-.74-.06-1.42-.18-2.04h-10.56z" fill="currentColor"/>
  </svg>
);

const FacebookIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 fill-current">
    <title>Facebook</title>
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
  </svg>
);


export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create user on the client using the Firebase SDK
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Update the new user's profile with their name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      
      // 3. Get the ID token from the newly created user
      const idToken = await userCredential.user.getIdToken();

      // 4. Call the backend to create a session cookie. This endpoint will also handle
      // creating the user in Firestore and assigning the 'admin' role if it's the first user.
      const sessionData = await fetchFromGoBackend<{ isAdmin: boolean }>('/api/v1/auth/session-login', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });
      
      // 5. Redirect to the correct dashboard based on the role returned from the session creation
      if (sessionData.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/area-do-cliente');
      }

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso. Tente fazer login ou use um email diferente.');
      } else {
        setError(err.message || 'Falha ao criar conta. Verifique os dados e tente novamente.');
      }
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    setIsSocialLoading(true);
    setError(null);
    
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // The backend's session-login will handle user creation in Firestore if they don't exist
        const sessionData = await fetchFromGoBackend<{ isAdmin: boolean }>('/api/v1/auth/session-login', {
            method: 'POST',
            body: JSON.stringify({ idToken }),
        });
        
        // After session is created, redirect.
        if (sessionData.isAdmin) {
            router.push('/admin');
        } else {
            router.push('/area-do-cliente');
        }

    } catch (err: any) {
        console.error(err);
        setError(`Ocorreu um erro com o login via ${providerName}. Tente novamente.`);
        setIsSocialLoading(false);
    }
  };

  return (
     <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
        <div>
          <Logo className="invert brightness-0" />
        </div>
        <div className="max-w-md">
          <p className="text-sm uppercase tracking-wider text-primary-foreground/80 mb-2">Comece Agora</p>
          <h2 className="text-3xl font-bold leading-tight">Crie sua conta e tenha acesso a um mundo de possibilidades</h2>
          <p className="mt-4 text-primary-foreground/80">
            Infraestrutura de ponta, suporte premiado e a estabilidade que seu projeto precisa para crescer sem limites.
          </p>
        </div>
        <div className="text-sm text-primary-foreground/60">
            Copyright © {new Date().getFullYear()} Dresbach hosting do brasil.ltda
        </div>
      </div>
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Crie sua Conta</CardTitle>
            <CardDescription>
              Comece a usar os serviços da Dresbach Hosting em minutos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isSocialLoading || isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isSocialLoading || isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSocialLoading || isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSocialLoading || isLoading} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading || isSocialLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Conta
              </Button>
            </form>
             <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou cadastre-se com</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading || isSocialLoading} className="w-full">
                    {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                    Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin('facebook')} disabled={isLoading || isSocialLoading} className="w-full">
                    {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIcon />}
                    Facebook
                </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
