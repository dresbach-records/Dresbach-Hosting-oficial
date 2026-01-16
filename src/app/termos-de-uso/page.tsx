export default function TermsOfUsePage() {
  return (
    <div className="container py-16 sm:py-24">
      <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
        Termos de Uso
      </h1>
      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        <p>
          Bem-vindo à Dresbach Hosting. Ao utilizar nossos serviços, você concorda com os seguintes termos e condições. Por favor, leia-os com atenção.
        </p>
        <h2>1. Contas</h2>
        <p>
          Quando você cria uma conta conosco, você deve nos fornecer informações que sejam precisas, completas e atuais em todos os momentos. A falha em fazer isso constitui uma violação dos Termos, o que pode resultar na rescisão imediata da sua conta em nosso Serviço.
        </p>
        <h2>2. Conteúdo</h2>
        <p>
          Nosso serviço permite que você poste, vincule, armazene, compartilhe e, de outra forma, disponibilize certas informações, textos, gráficos, vídeos ou outros materiais. Você é responsável pelo Conteúdo que posta no Serviço, incluindo sua legalidade, confiabilidade e adequação.
        </p>
        <h2>3. Uso Aceitável</h2>
        <p>
          Você concorda em não usar o Serviço para quaisquer fins ilegais ou não autorizados. Você concorda em cumprir todas as leis, regras e regulamentos aplicáveis ao seu uso do Serviço.
        </p>
        {/* Adicionar mais seções conforme necessário */}
        <h2>4. Alterações nos Termos</h2>
        <p>
          Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso de pelo menos 30 dias antes de quaisquer novos termos entrarem em vigor.
        </p>
        <h2>5. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco através da nossa página de suporte.
        </p>
      </div>
    </div>
  );
}
