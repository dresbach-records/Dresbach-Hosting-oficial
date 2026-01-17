import Link from "next/link";
import { Logo } from "./logo";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  </li>
);

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h4 className="font-headline font-semibold tracking-tight">Empresa</h4>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/sobre">Sobre</FooterLink>
              <FooterLink href="/#infraestrutura">Infraestrutura</FooterLink>
              <FooterLink href="/tech-ops">Tech Ops</FooterLink>
              <FooterLink href="/admin/login">Painel da Empresa</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold tracking-tight">Produtos</h4>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/planos-de-hospedagem">Hospedagem</FooterLink>
              <FooterLink href="/tech-ops">Consultoria Tech Ops</FooterLink>
              <FooterLink href="/area-do-cliente">Painel do Cliente</FooterLink>
              <FooterLink href="/app-android">App Android</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold tracking-tight">Suporte</h4>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/area-do-cliente">Área do Cliente</FooterLink>
              <FooterLink href="/suporte">WhatsApp</FooterLink>
              <FooterLink href="/suporte">Tickets</FooterLink>
              {/* <FooterLink href="/status">Status do Sistema</FooterLink> */}
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold tracking-tight">Legal</h4>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/termos-de-uso">Termos de Uso</FooterLink>
              <FooterLink href="/politica-de-privacidade">Política de Privacidade</FooterLink>
              <FooterLink href="/lgpd">LGPD</FooterLink>
              <FooterLink href="/contrato-de-servicos">Contrato de Serviços</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Logo />
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dresbach Hosting do Brasil LTDA
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              CNPJ: 63.187.175/0001-70
            </p>
            <p className="text-sm text-muted-foreground">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
