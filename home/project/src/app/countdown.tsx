'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import SantaHat from '@/components/santa-hat';

const CountdownUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-4xl lg:text-6xl font-bold tracking-tighter">{String(value).padStart(2, '0')}</span>
        <span className="text-xs uppercase tracking-widest">{label}</span>
    </div>
);

const CountdownPage = () => {
    const countdownEndDate = new Date('2025-01-01T00:00:00-03:00');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const bgImage = PlaceHolderImages.find((img) => img.id === 'christmas-hero');
    const nextYear = countdownEndDate.getFullYear();

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = countdownEndDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white p-6 overflow-hidden">
            {bgImage && (
                <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description}
                    data-ai-hint={bgImage.imageHint}
                    fill
                    objectFit="cover"
                    className="z-0 opacity-50"
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/70 z-10"></div>
            
            <div className="absolute top-0 right-0 z-20">
                <SantaHat className="w-24 h-24 md:w-48 md:h-48" />
            </div>

            <div className="relative z-20 text-center flex flex-col items-center">
                <div className="mb-8">
                    <Logo className="brightness-0 invert" />
                </div>

                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl text-[#C9A24D] leading-tight drop-shadow-lg">
                    Prepare-se para algo espetacular
                </h1>
                <p className="mt-4 max-w-xl text-lg text-white/80">
                    Estamos preparando uma nova experiência para {nextYear}.<br/>
                    Atualizações de sistema e melhorias de performance em andamento.
                </p>

                <div className="my-12 flex items-center justify-center space-x-4 sm:space-x-8 text-[#F2F2F2] bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                    <CountdownUnit value={timeLeft.days} label="Dias" />
                    <div className="text-4xl text-white/30">|</div>
                    <CountdownUnit value={timeLeft.hours} label="Horas" />
                    <div className="text-4xl text-white/30">|</div>
                    <CountdownUnit value={timeLeft.minutes} label="Minutos" />
                     <div className="text-4xl text-white/30">|</div>
                    <CountdownUnit value={timeLeft.seconds} label="Segundos" />
                </div>
                
                <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                    <Link href="/area-do-cliente">Acessar Área do Cliente</Link>
                </Button>
            </div>
        </div>
    );
};

export default CountdownPage;
