'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function DomainSearchHome() {
    const [domain, setDomain] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (domain) {
            router.push(`/pedido?domain=${encodeURIComponent(domain)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
                <Input
                    type="text"
                    name="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="h-12 text-base flex-grow"
                    placeholder="Encontre o seu novo domínio"
                />
                <Button type="submit" size="lg" className="h-12">
                    Procurar
                </Button>
            </div>
        </form>
    );
}
