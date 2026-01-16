export default function LgpdPage() {
  return (
    <div className="container py-16 sm:py-24">
      <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
        Conformidade com a LGPD
      </h1>
      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        <p>
          A Dresbach Hosting está comprometida em proteger a privacidade e os dados pessoais de seus usuários, em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
        <h2>1. Direitos do Titular dos Dados</h2>
        <p>
          Conforme a LGPD, você, como titular dos dados, possui os seguintes direitos:
        </p>
        <ul>
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade dos dados a outro fornecedor de serviço ou produto;</li>
          <li>Eliminação dos dados pessoais tratados com o consentimento do titular;</li>
          <li>Informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados;</li>
          <li>Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;</li>
          <li>Revogação do consentimento.</li>
        </ul>
        <h2>2. Como Exercer Seus Direitos</h2>
        <p>
          Para exercer qualquer um dos seus direitos, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através do e-mail: dpo@dresbach.hosting.
        </p>
        <h2>3. Segurança dos Dados</h2>
        <p>
          Adotamos medidas de segurança, técnicas e administrativas, aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.
        </p>
        <h2>4. Contato</h2>
        <p>
          Para mais informações sobre como tratamos seus dados, por favor, consulte nossa <a href="/politica-de-privacidade">Política de Privacidade</a> ou entre em contato conosco.
        </p>
      </div>
    </div>
  );
}
