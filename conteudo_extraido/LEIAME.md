# Conteúdo extraído — "Conheça a REPAR" (jogo_como_funciona.swf, 2007)

> Os arquivos da versão antiga (ASP, SWF/FLA, XML, telas de bloqueio, e-mail) estão em `../_legado/`.

Textos decodificados direto do SWF (fontes + registros DefineText) e mecânica confirmada
rodando o SWF no Ruffle.

- `../js/perguntas.js` — as 10 etapas prontas para uso (pergunta, 3 alternativas, índice da correta,
  explicação, rótulos da cena). Pequenos erros de digitação do original foram corrigidos.
- `textos_brutos_swf.txt` — todos os textos do SWF, sem edição, na ordem do arquivo.
- `imagens_swf/` — os 13 bitmaps que o SWF usava para montar as cenas (PNG com transparência):
  personagem, tanque, forno (+ janela do fogo), torre, reator, esfera de GLP, botijão, caminhões,
  carro, fábrica Fosfértil e logos do rodapé. São de baixa resolução (feitos para a tela de
  640×520). A `esfera_glp.png` não tem transparência nem no original (JPEG sem canal alfa).
  Setas, chamas, mar, navio, satélite, dutos, posto e o fundo da refinaria eram vetores e
  não existem como imagem no SWF.

## Telas e fluxo

1. **Cabeçalho fixo**: "CONHEÇA A REPAR" + caixa "PONTUAÇÃO 0pts".
2. **Barra de etapas**: ETAPA 01…10, FIM DE JOGO, ETAPA FINAL. A etapa atual fica destacada (cinza).
   Durante o jogo os botões não navegam; "ETAPA FINAL" abria `geral.html` (infográfico, hoje em `_legado/`; a versão nova não tem esse botão).
3. **Cada etapa**: ilustração animada da unidade (setas de entrada/saída com rótulos) + personagem
   (técnico com capacete) com balão contendo a pergunta, 3 alternativas (radio) e **RESPONDER >>**.
4. **Após responder**: o balão troca para a explicação (texto com rolagem) + **PRÓXIMA ETAPA >>**.
   Não há indicação visual de certo/errado — só a pontuação muda.
5. **Fim de jogo**: "Obrigado por participar!", "sua pontuação: N", **JOGAR NOVAMENTE >**,
   **CONHEÇA TODO O PROCESSO >** (abria `geral.html`) e formulário **ENVIAR À UM AMIGO**
   (Nome do Amigo, Chave do Amigo + "@petrobras.com.br", botão Enviar).
6. Rodapé: logos "Refinaria Presidente Getúlio Vargas 30 anos" e "BR Petrobras".

## Pontuação

- Acerto: **+100** · Erro: **−50** (não fica abaixo de 0) · Máximo: **1000**.
- O SWF também conta `totcerto` / `toterro` (respostas certas/erradas), mas não exibe na tela final.

## Observações

- Etapas 8 e 9 tinham duas versões da explicação no SWF (uma curta e uma longa); usei a mais completa.
- Correções aplicadas em `perguntas.js`: "Quais sãos" → "Quais são", "Residuo" → "Resíduo",
  "vibilizar" → "viabilizar", "às distribuidores" → "às distribuidoras", "da origem" → "dá origem",
  "à vácuo … para a Unidade" → "a vácuo … na Unidade".
- A arte (cenas, personagem, logos) é vetorial dentro do SWF; ainda não foi exportada.
