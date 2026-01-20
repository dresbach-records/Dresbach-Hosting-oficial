import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const heroImage = PlaceHolderImages.find((img) => img.id === "black-friday-hero");

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M24 4L6 9V21C6 33.12 13.92 41.36 24 44C34.08 41.36 42 33.12 42 21V9L24 4Z" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeadsetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 28V24C2 15.27 9.27 8 18 8H20C28.73 8 36 15.27 36 24V28" stroke="hsl(var(--primary))" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 26V36C28 38.21 29.79 40 32 40H34C35.1 40 36 39.1 36 38V28" stroke="hsl(var(--primary))" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 28V38C12 39.1 12.9 40 14 40H16C18.21 40 20 38.21 20 36V26" stroke="hsl(var(--primary))" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 24.06C37.82 24.02 39.6 24 41.32 24C41.74 24 42.14 24 42.54 24.02" stroke="hsl(var(--primary))" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ScalableIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M28.8 4H19.2C18.24 4 17.34 4.42 16.7 5.18L5.18 18.26C4.42 18.96 4 19.92 4 20.92V38C4 40.2 5.8 42 8 42H40C42.2 42 44 40.2 44 38V20.92C44 19.92 43.58 18.96 42.82 18.26L31.3 5.18C30.66 4.42 29.76 4 28.8 4Z" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 25V34" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 29V34" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 21V34" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 12H34" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const serviceFeatures = [
  {
    icon: <ShieldIcon />,
    title: "FAST & SECURE",
    description: "Experience ultra-fast, secure and reliable hosting for your website with cutting-edge infrastructure.",
  },
  {
    icon: <HeadsetIcon />,
    title: "24/7 SUPPORT",
    description: "Get expert assistance anytime with our round-the-clock support: team always ready to help.",
  },
  {
    icon: <ScalableIcon />,
    title: "SCALABLE PLANS",
    description: "Easily upgrade your hosting plan as your business grows with our flexible and scalable solutions.",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: 19,
    features: ["Single Website", "25 GB SSD Storage", "Unlimited Bandwidth"],
    popular: false,
  },
  {
    name: "Pro",
    price: 49,
    features: ["Unlimited Websites", "100 GB SSD Storage", "Free SSL Certificate", "Daily Backups"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    features: ["Unlimited Websites", "200 GB SSD Storage", "Advanced Security", "Priority Support"],
    popular: false,
  },
];

export default function BlackFridayPage() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-32 sm:py-48">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>

        <div className="container relative text-left">
          <div className="max-w-3xl">
            <h1 className="font-headline text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Premium Hosting Solutions for Your Business
            </h1>
            <p className="mt-6 text-lg text-foreground/80">
              Reliable, secure, and high-performance hosting services designed to elevate your online presence.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/pedido">
                  GET STARTED
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/planos-de-hospedagem">
                  VIEW PLANS
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 sm:py-32 bg-background border-y border-white/10">
        <div className="container text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">OUR SERVICES</p>
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mt-2">
            Premium Hosting Services Tailored to Your Needs
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="overflow-hidden bg-card text-left">
                <CardContent className="p-8">
                  {feature.icon}
                  <h3 className="mt-6 text-xl font-bold font-headline">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  <Button variant="link" className="mt-6 p-0 text-primary">LEARN MORE</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-10 bg-no-repeat bg-center"
          style={{ backgroundImage: `url('https://picsum.photos/seed/golddust/1920/1080')`, backgroundSize: 'cover' }}
          data-ai-hint="gold dust"
        ></div>
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">OUR PRICING PLANS</p>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mt-2">
              Choose the Perfect Plan for Your Business
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col text-center bg-card ${plan.popular ? 'border-primary ring-2 ring-primary scale-105' : 'border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-4 py-1 rounded-full">Popular</div>
                  </div>
                )}
                <CardHeader className="pt-12">
                  <CardTitle className="font-headline text-2xl uppercase tracking-wider">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow my-8">
                  <ul className="space-y-4 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6">
                  <Button className="w-full" size="lg">
                    GET STARTED
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}