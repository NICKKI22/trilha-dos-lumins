# Ranking global

O endpoint usa o Apps Script como serviço público e guarda os melhores 50 tempos nas propriedades do próprio projeto. O jogo consulta os 10 primeiros.

## Publicar o endpoint

1. Acesse [script.google.com](https://script.google.com/) com a conta Google que será dona do ranking e crie um projeto independente.
2. Copie o conteúdo de `Code.gs` deste diretório para o editor do Apps Script e salve.
3. Selecione **Implantar → Nova implantação → Aplicativo da Web**.
4. Escolha **Executar como: eu** e **Quem pode acessar: qualquer pessoa**. Isso permite que jogadores sem login consultem e registrem tempos.
5. Autorize o script e conclua a implantação. Copie o URL terminado em `/exec`.

O ranking é público e aceita nomes e tempos enviados por qualquer visitante. O endpoint limita tamanho do nome, faixa de tempo e envios repetidos com o mesmo nome. Como o jogo é público e não exige conta, não há como garantir que um tempo enviado corresponda a uma partida legítima.

## Conectar o jogo

Substitua `PASTE_APPS_SCRIPT_WEB_APP_URL_HERE` em `index.html` pelo URL `/exec` da implantação. Depois publique a atualização do GitHub Pages.
