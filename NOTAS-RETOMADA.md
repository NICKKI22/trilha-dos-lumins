# Retomada: Trilha dos Lumins

## Estado atual — 2026-11-24

- Branch `main`, sincronizada com `origin/main`.
- Jogo publicado em https://nickki22.github.io/trilha-dos-lumins/.
- Ranking global ativo pelo Apps Script. O script está em `apps-script/Code.gs`; o URL `/exec` está configurado em `index.html`.
- A página usa GitHub Pages Actions. O workflow foi dividido entre envio do artefato e publicação; o job de publicação precisa de `actions: read`.
- Commit mais recente: `6f54d09` (`Separa upload e publicação do Pages`).

## Mudanças recentes

- Ranking global conectado ao Apps Script, com placar compartilhado e validação básica dos envios.
- WASD não move o personagem quando o foco está em campos de texto ou controles.
- Três travessias bloqueadas até o reparo: ponte de madeira no bosque, ponte de tábuas e corda no riacho, passagem de pedra na caverna. Reparar com `E` ou pelo botão contextual.
- Cenários 2D e 3D diferenciam floresta, riacho e caverna; personagem e câmera 3D se movem suavemente.
- Corrigido o botão de desafio invisível após as escolhas da estrela e reposicionado o seletor de visão 2D/3D.

## Verificações

- JavaScript inline passou na checagem de sintaxe.
- GitHub Actions concluiu o deploy do commit `6f54d09`.
- A página publicada foi consultada e contém as mudanças mais recentes.
- Não houve conferência manual em navegador neste ambiente.

## Próximo passo

Continuar com o próximo ajuste solicitado pelo usuário. Não há alterações pendentes de publicação.
