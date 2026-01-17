'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, redirect, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { fetchFromGoBackend } from '@/lib/go-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Search, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// --- Configurações e Dados Mock ---

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  console.error("Aviso: Chave publicável do Stripe não definida. O pagamento falhará. Defina NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
}
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;


const billingCycles = [
    { id: 'annually', name: 'Anualmente', price: 35.88, originalPrice: 2.99, discount: '25%' },
    { id: 'triennially', name: 'Trimestral', price: 10.47, originalPrice: 3.49, discount: null },
    { id: 'monthly', name: 'Mensal', price: 3.99, originalPrice: 3.99, discount: null },
];

const tlds = [
    { tld: '.com', price: 'R$ 79,99/ano' },
    { tld: '.com.br', price: 'R$ 49,99/ano' },
    { tld: '.net', price: 'R$ 89,99/ano' },
    { tld: '.org', price: 'R$ 84,99/ano' },
    { tld: '.online', price: 'R$ 29,99/ano' },
    { tld: '.dev', price: 'R$ 99,99/ano' },
];

const planDetails: { [key: string]: { name: string, price: number } } = {
    solteiro: { name: 'Solteiro', price: 2.99 },
    profissional: { name: 'Profissional', price: 4.99 },
    negocios: { name: 'Negócios', price: 9.99 },
};

// --- Componentes ---

const CheckoutForm = ({ orderDetails, onPaymentSuccess }: { orderDetails: { plan: string, cycle: string, domain: string, price: number }, onPaymentSuccess: (details: any) => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required' 
        });

        if (error) {
            setMessage(error.message || 'Ocorreu um erro inesperado.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Pagamento bem-sucedido! Provisionando seu serviço...');
            onPaymentSuccess(orderDetails);
        } else {
             setMessage('O estado do pagamento é inesperado: ' + paymentIntent?.status);
        }

        setIsProcessing(false);
    };
    
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button disabled={isProcessing || !stripe || !elements} className="w-full mt-6" size="lg">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Pagar R$ ${orderDetails.price.toFixed(2).replace('.', ',')}`}
            </Button>
            {message && <div id="payment-message" className="text-sm text-center mt-2 font-medium">{message}</div>}
        </form>
    )
}

const PlanCard = ({ name, price, features, selected, onClick, disabled }: { name: string, price: string, features: string[], selected: boolean, onClick: () => void, disabled: boolean }) => (
    <Card className={cn("text-center cursor-pointer transition-all", selected && "border-primary ring-2 ring-primary", disabled && "opacity-50 cursor-not-allowed")} onClick={disabled ? undefined : onClick}>
        <CardHeader className="p-4 relative">
             {selected && <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-md"><Check className="h-3 w-3"/></div>}
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <p><span className="text-2xl font-bold">R$ {price}</span><span className="text-sm text-muted-foreground">/mês</span></p>
        </CardHeader>
        <CardContent className="p-4 text-xs space-y-2 text-muted-foreground border-t">
            {features.map(f => <p key={f}>{f}</p>)}
        </CardContent>
        <CardFooter className="p-2">
            <Button variant={selected ? 'default' : 'outline'} className="w-full h-8 text-xs" disabled={disabled}>
                {selected ? 'Selecionado' : 'Selecionar'}
            </Button>
        </CardFooter>
    </Card>
)

const BillingCycleCard = ({ id, name, price, originalPrice, discount, selected, onClick, disabled }: { id: string, name: string, price: number, originalPrice: number, discount: string | null, selected: boolean, onClick: () => void, disabled: boolean }) => (
    <Card className={cn("text-center cursor-pointer transition-all", selected && "border-primary ring-2 ring-primary", disabled && "opacity-50 cursor-not-allowed")} onClick={disabled ? undefined : onClick}>
        <CardHeader className="p-4 relative">
            {selected && <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-md"><Check className="h-3 w-3"/></div>}
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
             {discount && <Badge variant="destructive" className="absolute top-2 left-2">{discount} OFF</Badge>}
            <p><span className="text-2xl font-bold">R$ {price.toFixed(2).replace('.', ',')}</span></p>
            <CardDescription>Equivale a R$ {(price / 12).toFixed(2).replace('.',',')}/mês</CardDescription>
        </CardHeader>
        <CardFooter className="p-2 border-t">
            <Button variant={selected ? 'default' : 'outline'} className="w-full h-8 text-xs" disabled={disabled}>
                {selected ? 'Selecionado' : 'Selecionar'}
            </Button>
        </CardFooter>
    </Card>
)

// --- Página Principal ---

function OrderPageContent() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Estados da configuração do pedido
    const [selectedPlan, setSelectedPlan] = useState('profissional');
    const [selectedCycle, setSelectedCycle] = useState('annually');
    const [domain, setDomain] = useState('');
    
    // Estados do fluxo de checkout
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    // Novos estados para busca de domínio
    const [isSearchingDomain, setIsSearchingDomain] = useState(false);
    const [domainSearchResult, setDomainSearchResult] = useState<{ available: boolean; message: string; } | null>(null);

    const currentCycleDetails = billingCycles.find(c => c.id === selectedCycle);
    const calculatedTotal = currentCycleDetails?.price || 0;

    useEffect(() => {
        const initialDomain = searchParams.get('domain');
        if (initialDomain) {
            setDomain(initialDomain);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isUserLoading && !user) {
            redirect('/login?redirect=/pedido');
        }
    }, [isUserLoading, user, router]);

    const handleDomainSearch = async () => {
        if (!domain.trim() || !domain.includes('.')) {
            toast({
                variant: 'destructive',
                title: 'Domínio inválido',
                description: 'Por favor, insira um domínio válido para pesquisar.',
            });
            return;
        }
        setIsSearchingDomain(true);
        setDomainSearchResult(null);
        try {
            const result = await fetchFromGoBackend<{ available: boolean }>(`/api/v1/domains/lookup/${domain}`);
            if (result.available) {
                 setDomainSearchResult({ available: true, message: `Parabéns! O domínio ${domain} está disponível.` });
            } else {
                 setDomainSearchResult({ available: false, message: `O domínio ${domain} já está em uso. Tente outro.` });
            }
        } catch (error: any) {
            setDomainSearchResult({ available: false, message: `Erro ao verificar o domínio: ${error.message}` });
        } finally {
            setIsSearchingDomain(false);
        }
    };
    
    const handleProceedToPayment = async () => {
        if (!domain) {
            toast({
                variant: 'destructive',
                title: 'Domínio necessário',
                description: 'Por favor, insira um nome de domínio para continuar.',
            });
            return;
        }
        setIsProcessing(true);

        const currentPlanDetails = planDetails[selectedPlan];
        
        try {
            const response = await fetchFromGoBackend<{ clientSecret: string, amount: number }>('/api/v1/payments/create-intent', {
                method: 'POST',
                body: JSON.stringify({ plan: currentPlanDetails.name, cycle: selectedCycle }),
            });
            setClientSecret(response.clientSecret);
            setTotal(response.amount / 100);
        } catch (error: any) {
            console.error("Falha ao criar o Payment Intent:", error);
            toast({
                variant: "destructive",
                title: "Erro ao iniciar pagamento",
                description: error.message || "Não foi possível preparar seu pagamento. Tente novamente.",
            });
             setIsProcessing(false);
        }
    };

    const handleProvisionAccount = async (orderDetails: { plan: string, cycle: string, domain: string, price: number }) => {
        try {
            await fetchFromGoBackend('/api/v1/provision-account', {
                method: 'POST',
                body: JSON.stringify({
                    plan: orderDetails.plan,
                    cycle: orderDetails.cycle,
                    domain: orderDetails.domain,
                    price: orderDetails.price,
                }),
            });

            toast({
                title: 'Pedido Recebido!',
                description: 'Seu novo serviço de hospedagem foi provisionado com sucesso.',
            });
            
            setTimeout(() => router.push('/area-do-cliente/servicos'), 2000);

        } catch (error: any) {
            console.error('Falha ao provisionar a conta:', error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Algo deu errado no provisionamento.',
                description: error.message || 'Seu pagamento foi confirmado, mas não foi possível provisionar o serviço. Por favor, contate o suporte.',
            });
        }
    };
    
    if (isUserLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (clientSecret && stripePromise) {
        return (
            <div className="bg-muted/30 py-12">
                <div className="container max-w-lg">
                     <Button variant="ghost" onClick={() => setClientSecret(null)} className="mb-4"><ChevronLeft className="mr-2 h-4 w-4"/>Voltar</Button>
                    <Card>
                        <CardHeader>
                            <CardTitle>Finalizar Pagamento</CardTitle>
                            <CardDescription>Insira os detalhes do seu pagamento para concluir a compra de forma segura.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Elements stripe={stripePromise} options={{ clientSecret, locale: 'pt-BR' }}>
                                <CheckoutForm 
                                    orderDetails={{
                                        plan: planDetails[selectedPlan].name,
                                        cycle: billingCycles.find(c => c.id === selectedCycle)?.name || '',
                                        domain: domain,
                                        price: total,
                                    }}
                                    onPaymentSuccess={handleProvisionAccount} 
                                />
                            </Elements>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-muted/30 py-12">
            <div className="container">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold font-headline mb-1">Você está quase lá! Conclua seu pedido.</h1>
                    <p className="text-muted-foreground">Revise e configure os detalhes do seu plano antes de finalizar.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Produtos</span>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isProcessing}><ChevronLeft className="h-4 w-4" /></Button>
                                        <span>1 / 3</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isProcessing}><ChevronRight className="h-4 w-4" /></Button>
                                    </div>
                                </CardTitle>
                                <Tabs defaultValue="sites">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="sites" disabled={isProcessing}>Hospedagem de Sites</TabsTrigger>
                                        <TabsTrigger value="vps" disabled={isProcessing}>Hospedagem VPS</TabsTrigger>
                                        <TabsTrigger value="dedicated" disabled={isProcessing}>Servidores Dedicados</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <PlanCard name="Solteiro" price="2,99" features={["1 Site", "10 GB de armazenamento", "Largura de banda ilimitada", "Domínio grátis incluído"]} selected={selectedPlan === 'solteiro'} onClick={() => setSelectedPlan('solteiro')} disabled={isProcessing} />
                                <PlanCard name="Profissional" price="4,99" features={["10 Sites", "20 GB de armazenamento", "Largura de banda ilimitada", "Domínio grátis incluído"]} selected={selectedPlan === 'profissional'} onClick={() => setSelectedPlan('profissional')} disabled={isProcessing} />
                                <PlanCard name="Negócios" price="9,99" features={["Sites Ilimitados", "Armazenamento de 100 GB", "Largura de banda ilimitada", "Domínio grátis incluído"]} selected={selectedPlan === 'negocios'} onClick={() => setSelectedPlan('negocios')} disabled={isProcessing} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ciclo de faturamento do produto</CardTitle>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {billingCycles.map(cycle => (
                                    <BillingCycleCard key={cycle.id} {...cycle} selected={selectedCycle === cycle.id} onClick={() => setSelectedCycle(cycle.id)} disabled={isProcessing} />
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Domínio do produto</CardTitle>
                                <Tabs defaultValue="register">
                                    <TabsList>
                                        <TabsTrigger value="register" disabled={isProcessing}>Registrar um domínio</TabsTrigger>
                                        <TabsTrigger value="transfer" disabled={isProcessing}>Domínios de transferência</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mb-4">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input 
                                            placeholder="Digite o nome de domínio aqui" 
                                            className="pl-10 h-11"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            disabled={isProcessing}
                                            onKeyDown={(e) => e.key === 'Enter' && handleDomainSearch()}
                                        />
                                    </div>
                                    <Button size="lg" className="h-11" onClick={handleDomainSearch} disabled={isProcessing || isSearchingDomain}>
                                        {isSearchingDomain ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Pesquisar'}
                                    </Button>
                                </div>
                                {isSearchingDomain && (
                                    <div className="p-4 text-center text-muted-foreground flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Verificando...
                                    </div>
                                )}
                                {domainSearchResult && (
                                    <div className={cn(
                                        "p-3 mt-4 rounded-md text-sm font-medium flex items-center gap-2",
                                        domainSearchResult.available ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    )}>
                                        {domainSearchResult.available ? <Check className="h-5 w-5"/> : <Info className="h-5 w-5"/>}
                                        {domainSearchResult.message}
                                    </div>
                                )}

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                                    {tlds.map(tld => (
                                        <Button key={tld.tld} variant="outline" className="flex-col h-auto py-2" disabled={isProcessing}>
                                            <span className="font-bold">{tld.tld}</span>
                                            <span className="text-xs text-muted-foreground">{tld.price}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                             <CardHeader>
                                <CardTitle>Complementos disponíveis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg border">
                                    <div className="flex-shrink-0">
                                        <Image src="https://picsum.photos/seed/ssl/200/150" alt="SSL Certificate" width={150} height={112} className="rounded-md" data-ai-hint="security lock"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold flex items-center gap-2">Proteja seu site com SSL <Badge variant="secondary">Recomendado</Badge></h3>
                                        <p className="text-muted-foreground text-sm mt-1 mb-4">Adicione SSL à sua hospedagem. A criptografia melhora a confiança e a segurança do seu site, o que pode impulsionar sua credibilidade.</p>
                                        <Button variant="outline" disabled={isProcessing}>
                                            Selecione a opção de segurança
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center text-base">
                                        <span>Resumo da configuração</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Info className="h-4 w-4" /></Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 text-primary p-2 rounded-md">
                                            <ShoppingCart className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Hospedagem Web - {planDetails[selectedPlan]?.name}</p>
                                            <p className="text-sm text-muted-foreground">{billingCycles.find(c => c.id === selectedCycle)?.name}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total do pedido devido hoje</p>
                                        <p className="text-3xl font-bold">R$ {calculatedTotal.toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <Button className="w-full" size="lg" onClick={handleProceedToPayment} disabled={isProcessing || !domain || !domainSearchResult?.available}>
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            <>
                                                Continuar para o Pagamento <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" className="w-full" disabled={isProcessing}>Alterar suas escolhas</Button>
                                </CardContent>
                                <CardFooter>
                                    <div className="w-full text-center text-sm text-muted-foreground hover:text-primary cursor-pointer">
                                        Tem um código promocional?
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderPageWrapper() {
    return (
        <Suspense fallback={
            <div className="bg-muted/30 py-12">
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </div>
        }>
            <OrderPageContent />
        </Suspense>
    )
}
