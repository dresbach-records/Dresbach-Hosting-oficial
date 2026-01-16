export default function PrivacyPolicyPage() {
  return (
    <div className="container py-16 sm:py-24">
      <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
        Política de Privacidade
      </h1>
      <div className="prose prose-lg dark:prose-invert mt-8 max-w-none">
        <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        <p>
          A Dresbach Hosting ("nós", "nosso" ou "nossos") opera o site dresbach.hosting (o "Serviço"). Esta página informa sobre nossas políticas relativas à coleta, uso e divulgação de dados pessoais quando você usa nosso Serviço e as opções que você associou a esses dados.
        </p>
        <h2>1. Coleta e Uso de Informações</h2>
        <p>
          Coletamos vários tipos diferentes de informações para diversos fins, para fornecer e melhorar nosso Serviço para você.
        </p>
        <h3>Tipos de Dados Coletados</h3>
        <ul>
          <li><strong>Dados Pessoais:</strong> Ao usar nosso Serviço, podemos pedir que você nos forneça certas informações de identificação pessoal que podem ser usadas para contatá-lo ou identificá-lo ("Dados Pessoais").</li>
          <li><strong>Dados de Uso:</strong> Podemos também coletar informações sobre como o Serviço é acessado e usado ("Dados de Uso").</li>
        </ul>
        <h2>2. Uso dos Dados</h2>
        <p>
          A Dresbach Hosting usa os dados coletados para diversos fins:
        </p>
        <ul>
          <li>Para fornecer e manter nosso Serviço</li>
          <li>Para notificá-lo sobre alterações em nosso Serviço</li>
          <li>Para permitir que você participe de recursos interativos do nosso Serviço quando você optar por fazê-lo</li>
          <li>Para fornecer suporte ao cliente</li>
        </ul>
        <h2>3. Segurança dos Dados</h2>
        <p>
          A segurança de seus dados é importante para nós, mas lembre-se de que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
        </p>
        {/* Adicionar mais seções conforme necessário */}
        <h2>4. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco.
        </p>
      </div>
    </div>
  );
}
