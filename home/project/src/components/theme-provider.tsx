'use client';

import { useEffect } from 'react';

/*
* ===================================================================
* CONTROLE DE MODO (LIGHT/DARK)
* ===================================================================
*
* Este arquivo controla se o site deve usar o modo claro ou escuro.
*
* - Para TEMAS ESCUROS: Mantenha a linha `document.documentElement.classList.add('dark');`
*   Isso ativa as variáveis de cor definidas dentro do `.dark { ... }` no arquivo de tema.
*
* - Para TEMAS CLAROS: Comente ou remova a linha `document.documentElement.classList.add('dark');`
*   e descomente a linha `document.documentElement.classList.remove('dark');`.
*   Isso fará o site usar as variáveis de cor padrão (`:root`).
*
* ===================================================================
*/
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Para temas escuros, mantenha esta linha:
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';

        // Para temas claros, comente a linha acima e descomente as duas abaixo:
        // document.documentElement.classList.remove('dark');
        // document.documentElement.style.colorScheme = 'light';
    }, []);

    return <>{children}</>;
}
