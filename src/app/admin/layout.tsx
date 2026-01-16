import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
       <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="font-semibold text-lg">Painel Administrativo</span>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Site
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-8 container">
        {children}
      </main>
      <footer className="py-4 mt-auto bg-card border-t">
        <div className="container flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            Painel Administrativo Dresbach Hosting
          </p>
        </div>
      </footer>
    </div>
  );
}
