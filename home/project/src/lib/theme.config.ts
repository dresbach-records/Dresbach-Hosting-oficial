// src/lib/theme.config.ts

/**
 * ===================================================================
 * CONFIGURAÇÃO DO TEMA ATIVO
 * ===================================================================
 *
 * Este arquivo controla qual "site" ou "template" está ativo.
 * Alterar o valor desta variável mudará a estrutura da página
 * inicial e de outros componentes dinâmicos, como o rodapé.
 *
 * Opções disponíveis:
 * - 'german-dark': Tema corporativo, sóbrio, com foco em tecnologia e segurança.
 * - 'black-friday': Tema premium, com dourado, focado em vendas e promoções.
 *
 * Lembre-se que, ao alterar o tema aqui, você também deve
 * garantir que o CSS correspondente esteja sendo importado
 * no arquivo `src/app/globals.css`.
 *
 * ===================================================================
 */
export const ACTIVE_THEME: "german-dark" | "black-friday" = "german-dark";
