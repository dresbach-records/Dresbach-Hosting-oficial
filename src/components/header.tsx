"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MessageCircle, LogOut } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/planos-de-hospedagem", label: "Planos" },
  { href: "/tech-ops", label: "Tech Ops" },
  { href: "/suporte", label: "Suporte" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === link.href ? "text-foreground" : "text-foreground/60",
          isMobile ? "text-lg py-2" : "text-sm"
        )}
      >
        {link.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {renderNavLinks()}
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="mb-4">
                <Logo />
              </Link>
              {renderNavLinks(true)}
            </nav>
          </SheetContent>
        </Sheet>
        {/* End Mobile Nav */}

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can be used for a command menu later */}
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            {!isUserLoading && (
              <>
                {user ? (
                  <>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href="/area-do-cliente">Área do Cliente</Link>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button size="sm" asChild>
                    <Link href="/login">Área do Cliente</Link>
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
