import { ACTIVE_THEME } from "../lib/theme.config";
import BlackFridayPage from "./themes/black-friday";
import GermanDarkPage from "./themes/german-dark";

/**
 * ===================================================================
 * ROTEADOR DE TEMA DA PÁGINA INICIAL
 * ===================================================================
 *
 * Este componente funciona como um roteador. Ele lê a configuração
 * do tema ativo no arquivo `src/theme.config.ts` e renderiza
 * a página inicial correspondente.
 *
 * Para editar o conteúdo de uma página inicial específica,
 * vá para a pasta `/src/app/themes/`.
 *
 * ===================================================================
 */
export default function Page() {
  if (ACTIVE_THEME === "black-friday") {
    return <BlackFridayPage />;
  }

  // O tema 'german-dark' é o padrão.
  return <GermanDarkPage />;
}
