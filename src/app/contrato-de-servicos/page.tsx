export default function ServiceAgreementPage() {
  return (
    <div className="container py-16 sm:py-24">
      <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
        Contrato de Serviços
      </h1>
      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        <p>
          Este Contrato de Prestação de Serviços ("Contrato") é celebrado entre a Dresbach Hosting do Brasil LTDA ("Contratada") e o cliente ("Contratante"), que adere a este contrato ao contratar qualquer um dos nossos serviços.
        </p>
        <h2>1. Objeto do Contrato</h2>
        <p>
          O objeto deste contrato é a prestação de serviços de hospedagem de sites e outros serviços relacionados, conforme detalhado no plano contratado pelo Contratante no momento da compra.
        </p>
        <h2>2. Obrigações da Contratada</h2>
        <p>
          A Contratada se compromete a:
        </p>
        <ul>
          <li>Prover os serviços contratados com a qualidade e o uptime acordados no plano.</li>
          <li>Prestar suporte técnico para questões relacionadas à infraestrutura de hospedagem.</li>
          <li>Manter a segurança e a confidencialidade dos dados do Contratante.</li>
        </ul>
        <h2>3. Obrigações do Contratante</h2>
        <p>
          O Contratante se compromete a:
        </p>
        <ul>
          <li>Efetuar os pagamentos nas datas de vencimento.</li>
          <li>Utilizar os serviços de acordo com os <a href="/termos-de-uso">Termos de Uso</a>.</li>
          <li>Manter seus dados cadastrais atualizados.</li>
        </ul>
        <h2>4. Rescisão</h2>
        <p>
          Este contrato pode ser rescindido por qualquer uma das partes, a qualquer momento, mediante aviso prévio. Detalhes sobre reembolsos e penalidades estão descritos nos Termos de Uso.
        </p>
        <h2>5. Disposições Gerais</h2>
        <p>
          Este contrato constitui o acordo integral entre as partes com relação ao seu objeto. Fica eleito o foro da Comarca de São Paulo, SP, para dirimir quaisquer controvérsias oriundas do presente contrato.
        </p>
      </div>
    </div>
  );
}
