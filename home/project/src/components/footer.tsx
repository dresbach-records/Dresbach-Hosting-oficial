import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { ACTIVE_THEME } from "@/theme.config";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  </li>
);

const VisaIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-6 w-auto fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M7.161 16.237l-1.442-8.322h2.742l1.442 8.322h-2.742zm8.749 0l.89-4.992c.113-.627.428-1.045.99-1.258.115-.044.2-.07.31-.088l.115.684c-.087.03-.217.072-.347.114-.504.188-.78.495-.98.981l-1.205 5.56H13.1l2.094-8.322h2.654l-2.094 8.322h-2.79zM24 13.565c0-.92-.505-1.51-1.39-1.827-.61-.22-1.01-.42-1.01-.684 0-.251.284-.47.817-.47.452 0 .8.134 1.01.22l.218-.934c-.26-.09-.7-.25-1.25-.25-.91 0-1.53.5-1.53 1.258 0 .834.627 1.288 1.442 1.587.7.279.924.47.924.714 0 .318-.428.53-1.026.53-.59 0-1.05-.14-1.25-.237l-.234.949c.3.114.89.293 1.514.293.99 0 1.773-.53 1.773-1.33zm-17.65-5.32l-2.03-4.38h2.89l1.22 3.125.29-1.442L8.52 3.865h2.4l-1.6 8.322h-2.58l-1.4-6.645z"/></svg>
)

const MastercardIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="12" r="7" className="fill-[#EA001B]"/>
        <circle cx="16" cy="12" r="7" className="fill-[#F79E1B]"/>
        <path d="M12 12a7 7 0 0 1-3.1-5.74 7 7 0 0 0 0 11.48A7 7 0 0 1 12 12z" className="fill-[#FF5F00]"/>
    </svg>
)

const AmexIcon = () => (
     <svg role="img" viewBox="0 0 24 24" className="h-6 w-auto rounded-[3px] bg-[#006FCF]" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.417 11.185h11.166v1.629H6.417zm.304-2.833l1.83 3.195-1.83 3.18h2.32l.71-1.232h1.68v1.232h2.206V8.352H9.761v3.21h-1.68zm2.34 1.584h1.68V9.936h-1.68zM15.417 15.15h2.16v-4.9h-2.16v-.972h4.52V8.35h-4.52v.925h2.152v4.9h2.154v.975h-4.52z" fill="#fff"/>
    </svg>
)

const PaypalIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg"><path d="M3.34 2.463h6.13c4.373 0 6.644 1.59 5.863 5.43-.59 2.842-2.78 4.34-5.636 4.34H6.896l-1.205 3.966H2.1L4.44 2.463h-.02zm16.538 0h3.122L19.508 16.2h-3.56l2.35-13.737zm-12.06 7.42c2.2 0 3.55-1.045 3.966-3.21.39-2.05-.75-3.07-2.89-3.07H5.21L4.12 10.93a1.43 1.43 0 0 0-.014.137c.013.014.027.027.027.014v-.001z" fill="#0070BA"/></svg>
)

const PaymentIcons = () => (
    <div className="flex items-center space-x-2">
        <VisaIcon />
        <MastercardIcon />
        <AmexIcon />
        <PaypalIcon />
    </div>
)

const BlackFridayFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="relative border-t bg-card text-foreground overflow-hidden">
            <div 
                className="absolute inset-x-0 bottom-0 h-48 z-0 opacity-10 bg-no-repeat bg-cover bg-bottom"
                style={{ backgroundImage: `url('https://picsum.photos/seed/golddust/1920/1080')` }}
                data-ai-hint="gold dust"
            ></div>
            
            <div className="container relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                    <div className="flex flex-col gap-4">
                        <h4 className="font-headline font-semibold tracking-tight text-primary uppercase">Contato</h4>
                        <div className="flex items-center space-x-3">
                            <a href="mailto:contato@dresbach.hosting" aria-label="Email" className="text-muted-foreground hover:text-foreground"><Mail className="h-5 w-5"/></a>
                            <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5"/></a>
                            <a href="#" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5"/></a>
                            <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5"/></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-headline font-semibold tracking-tight text-primary uppercase">Empresa</h4>
                        <ul className="mt-4 space-y-2">
                        <FooterLink href="/sobre">Sobre Nós</FooterLink>
                        <FooterLink href="#">Nossa Equipe</FooterLink>
                        <FooterLink href="#">Blog</FooterLink>
                        <FooterLink href="#">Afiliados</FooterLink>
                        <FooterLink href="/suporte">Contato</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-headline font-semibold tracking-tight text-primary uppercase">Serviços</h4>
                        <ul className="mt-4 space-y-2">
                        <FooterLink href="/planos-de-hospedagem">Hospedagem</FooterLink>
                        <FooterLink href="/planos-de-hospedagem">VPS</FooterLink>
                        <FooterLink href="/planos-de-hospedagem">Servidores Dedicados</FooterLink>
                        <FooterLink href="/pedido">Registro de Domínios</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-headline font-semibold tracking-tight text-primary uppercase">Suporte</h4>
                        <ul className="mt-4 space-y-2">
                        <FooterLink href="/suporte">Base de Conhecimento</FooterLink>
                        <FooterLink href="#">Status da Rede</FooterLink>
                        <FooterLink href="/area-do-cliente/tickets?new=true">Abrir Chamado</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center sm:text-left">
                        &copy; {currentYear} Dresbach Hosting. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4">
                        <PaymentIcons />
                        <a href="#" target="_blank" rel="noreferrer" aria-label="Youtube" className="text-muted-foreground hover:text-foreground">
                            <Youtube className="h-5 w-5"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const GermanDarkFooter = () => {
    const currentYear = new Date().getFullYear();
    const FooterEmailLink = ({ email, label }: { email: string; label: string }) => (
        <li>
            <a href={`mailto:${email}`} className="text-sm text-muted-foreground transition-colors hover:text-link">
                {label}
            </a>
        </li>
    );

    return (
        <footer className="border-t bg-card text-foreground">
            <div className="container py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="font-headline font-semibold tracking-tight text-primary uppercase">Dresbach Hosting</h4>
                        <p className="text-sm text-muted-foreground mt-4">
                            Infraestrutura de alta performance para missões críticas.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-headline font-semibold tracking-tight uppercase">Produtos</h4>
                        <ul className="mt-4 space-y-2">
                            <FooterLink href="/planos-de-hospedagem">Hospedagem</FooterLink>
                            <FooterLink href="/tech-ops">Consultoria Tech Ops</FooterLink>
                            <FooterLink href="/pedido">Domínios</FooterLink>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-headline font-semibold tracking-tight uppercase">Empresa</h4>
                        <ul className="mt-4 space-y-2">
                            <FooterLink href="/sobre">Sobre</FooterLink>
                            <FooterLink href="/suporte">Suporte</FooterLink>
                            <FooterLink href="/admin/login">Acesso Admin</FooterLink>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-headline font-semibold tracking-tight uppercase">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            <FooterLink href="/termos-de-uso">Termos de Uso</FooterLink>
                            <FooterLink href="/politica-de-privacidade">Privacidade</FooterLink>
                            <FooterLink href="/lgpd">LGPD</FooterLink>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-headline font-semibold tracking-tight uppercase">Contato</h4>
                        <ul className="mt-4 space-y-2">
                            <FooterEmailLink email="financeiro@dresbachhosting.com.br" label="Financeiro" />
                            <FooterEmailLink email="suporte@dresbachhosting.com.br" label="Suporte" />
                            <FooterEmailLink email="techops@dresbachhosting.com.br" label="Tech Ops" />
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border/50 pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} Dresbach Hosting do Brasil LTDA | CNPJ: 63.187.175/0001-70
                    </p>
                    <div className="flex items-center space-x-3">
                        <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-link"><Facebook className="h-5 w-5"/></a>
                        <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-link"><Twitter className="h-5 w-5"/></a>
                        <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-link"><Linkedin className="h-5 w-5"/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export function Footer() {
    if (ACTIVE_THEME === 'black-friday') {
        return <BlackFridayFooter />;
    }
    
    return <GermanDarkFooter />;
}
