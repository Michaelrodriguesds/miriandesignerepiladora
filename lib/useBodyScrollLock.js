'use client';

import { useEffect } from 'react';

// Antes, Certificacao.jsx e Gallery.jsx mexiam em document.body.style.overflow
// cada um de forma independente. Se dois modais fossem abertos/fechados em
// sequência rápida, um podia sobrescrever o valor que o outro tinha acabado
// de definir, arriscando travar a rolagem da página em "hidden".
//
// Este hook usa um contador global: só libera a rolagem quando o ÚLTIMO
// modal aberto for fechado, não importa a ordem.
let lockCount = 0;

export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return undefined;

    lockCount += 1;
    document.body.style.overflow = 'hidden';

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isLocked]);
}
