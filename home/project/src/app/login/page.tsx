'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Phone } from 'lucide-react';
import { Logo } from '@/components/logo';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SantaHat from '@/components/santa-hat';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const bgImage = PlaceHolderImages.find((img) => img.id === 'christmas-hero');

  useEffect(() => {
      if (!isLoading && user) {
        if (user.role === 'admin') {
            router.replace('/admin');
        } else {
            router.replace('/area-do-cliente');
        }
      }
  }, [user, isLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { token } = await apiFetch<{token: string}>('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      await login(token);
      // Let the useEffect handle the redirection
      
    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao tentar fazer login.');
        setIsSubmitting(false);
    }
  };

  if (isLoading || (!isLoading && user)) {
     return (
        <div className="flex h-screen items-center justify-center bg-black">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white p-6 overflow-hidden">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                data-ai-hint={bgImage.imageHint}
                fill
                className="object-cover z-0 opacity-70"
                priority
            />
        )}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute top-0 right-0 z-20">
            <SantaHat className="w-24 h-24 md:w-48 md:h-48" />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-md">
            <Card className="w-full bg-black/50 backdrop-blur-sm border-primary/20 text-foreground">
                <CardHeader className="text-center">
                    <div className="mb-6 flex justify-center">
                        <Logo className="brightness-0 invert" />
                    </div>
                    <CardTitle className="text-4xl font-headline text-primary">Área do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/80" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Seu e-mail ou nome de usuário"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="pl-10 bg-black/50 border-primary/30 h-12 focus:border-primary"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/80" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="pl-10 bg-black/50 border-primary/30 h-12 focus:border-primary"
                            />
                        </div>
                        <div className="text-right">
                           <Link href="/forgot-password" className="text-xs text-primary/90 hover:text-primary hover:underline">Esqueceu sua senha?</Link>
                        </div>
                        {error && <p className="text-sm text-destructive text-center">{error}</p>}
                        <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Ainda não tem uma conta? </span>
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Registre-se agora »
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 text-center text-foreground/80">
                <h3 className="font-semibold text-primary">Precisa de ajuda?</h3>
                <p className="text-sm">Atendimento 24 horas, 7 dias por semana.</p>
                <div className="mt-4 space-y-2 text-sm">
                    <a href="mailto:suporte@dresbach.com" className="flex items-center justify-center gap-2 hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                        suporte@dresbach.com
                    </a>
                    <a href="tel:1145604056" className="flex items-center justify-center gap-2 hover:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        (11) 4560-4056
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
}