// "Conheça a REPAR" — lógica do jogo. Sem login e sem servidor:
// a pontuação vive só na página e o recorde fica no localStorage do navegador.

(() => {
  const CHAVE_RECORDE = "repar-como-funciona-recorde";
  const TOTAL = ETAPAS.length;

  const el = {
    pontos: document.getElementById("pontos"),
    delta: document.getElementById("placar-delta"),
    etapas: document.getElementById("etapas"),
    palco: document.getElementById("palco"),
    cena: document.getElementById("cena"),
    personagem: document.getElementById("personagem"),
    balao: document.getElementById("balao")
  };

  const estado = {
    indice: 0,        // etapa atual (0..9)
    pontos: 0,
    respostas: []     // true/false por etapa respondida
  };

  // ---------- utilidades ----------

  function esc(t) {
    return String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function lerRecorde() {
    try { return Number(localStorage.getItem(CHAVE_RECORDE)) || 0; } catch { return 0; }
  }

  function salvarRecorde(pontos) {
    try { if (pontos > lerRecorde()) localStorage.setItem(CHAVE_RECORDE, String(pontos)); } catch { /* sem storage */ }
  }

  // Parágrafos separados por linha em branco; uma primeira linha toda em maiúsculas vira subtítulo.
  function formatarExplicacao(texto) {
    return texto.split("\n\n").map(par => {
      const [primeira, ...resto] = par.split("\n");
      if (resto.length && primeira === primeira.toUpperCase()) {
        return `<p><strong>${esc(primeira)}</strong>${esc(resto.join(" "))}</p>`;
      }
      return `<p>${esc(par)}</p>`;
    }).join("");
  }

  // ---------- placar e barra de etapas ----------

  function mudarPontos(delta) {
    estado.pontos = Math.max(0, estado.pontos + delta);
    el.pontos.textContent = estado.pontos;
    el.delta.textContent = delta > 0 ? `+${delta}` : `${delta}`;
    el.delta.className = "placar-delta";
    void el.delta.offsetWidth; // reinicia a animação
    el.delta.classList.add(delta > 0 ? "mais" : "menos");
  }

  function desenharEtapas(atual) {
    const itens = ETAPAS.map((_, i) => {
      const classes = ["etapa"];
      if (i === atual) classes.push("atual");
      if (i < estado.respostas.length) classes.push("feita", estado.respostas[i] ? "certa" : "errada");
      const n = String(i + 1).padStart(2, "0");
      return `<span class="${classes.join(" ")}"${i === atual ? ' aria-current="step"' : ""}><small>Etapa</small><b>${n}</b></span>`;
    });
    itens.push(`<span class="etapa${atual === "fim" ? " atual" : ""}"><small>Fim de</small><b>JOGO</b></span>`);
    itens.push(`<a class="etapa" href="geral.html" target="_blank" rel="noopener" title="Ver o processo completo da refinaria"><small>Etapa</small><b>FINAL</b></a>`);
    el.etapas.innerHTML = itens.join("");
  }

  function mostrarCena(n) {
    el.palco.querySelector(".fim")?.remove();
    el.cena.innerHTML = Cenas.desenhar(n);
    el.personagem.hidden = false;
    el.balao.hidden = false;
  }

  function trocarBalao(html) {
    el.balao.innerHTML = html;
    // reinicia a animação de entrada do balão
    el.balao.style.animation = "none";
    void el.balao.offsetWidth;
    el.balao.style.animation = "";
  }

  // ---------- telas ----------

  function telaInicial() {
    estado.indice = 0;
    estado.pontos = 0;
    estado.respostas = [];
    el.pontos.textContent = "0";
    desenharEtapas(0);
    mostrarCena(1);
    const recorde = lerRecorde();
    trocarBalao(`
      <div class="intro">
        <h2>Olá! Vamos conhecer como funciona a Refinaria Presidente Getúlio Vargas?</h2>
        <p>Em ${TOTAL} etapas você acompanha o caminho do petróleo até virar GLP, gasolina, diesel,
        querosene de aviação e solventes. Acerto: <b>+100</b> · erro: <b>−50</b>.
        ${recorde ? `Seu recorde: <b>${recorde} pts</b>.` : ""}</p>
      </div>
      <div class="acoes"><button type="button" class="botao verde" id="btn-jogar">Começar &gt;&gt;</button></div>`);
    document.getElementById("btn-jogar").addEventListener("click", () => telaPergunta(0));
  }

  function telaPergunta(i) {
    estado.indice = i;
    const e = ETAPAS[i];
    desenharEtapas(i);
    mostrarCena(e.etapa);
    const opcoes = e.alternativas.map((alt, k) => `
      <label><input type="radio" name="resposta" value="${k}"> ${esc(alt)}</label>`).join("");
    trocarBalao(`
      <h2 id="pergunta">${esc(e.pergunta)}</h2>
      <form class="balao-corpo" id="form-resposta">
        <fieldset class="alternativas" aria-labelledby="pergunta">${opcoes}</fieldset>
        <button type="submit" class="botao" id="btn-responder" disabled>Responder &gt;&gt;</button>
      </form>`);

    const form = document.getElementById("form-resposta");
    const botao = document.getElementById("btn-responder");
    form.addEventListener("change", () => { botao.disabled = false; });
    form.addEventListener("submit", ev => {
      ev.preventDefault();
      const escolhida = Number(new FormData(form).get("resposta"));
      responder(i, escolhida);
    });
  }

  function responder(i, escolhida) {
    const e = ETAPAS[i];
    const acertou = escolhida === e.correta;
    estado.respostas[i] = acertou;
    mudarPontos(acertou ? REGRAS.pontosAcerto : REGRAS.pontosErro);
    desenharEtapas(i);

    const resultado = acertou
      ? `<p class="resultado certa">✓ Resposta certa! +${REGRAS.pontosAcerto} pontos</p>`
      : `<p class="resultado errada">✗ Não foi dessa vez. A resposta certa é: ${esc(e.alternativas[e.correta])}</p>`;
    const ultima = i === TOTAL - 1;

    trocarBalao(`
      ${resultado}
      <div class="explicacao" tabindex="0">${formatarExplicacao(e.explicacao)}</div>
      <div class="acoes">
        <button type="button" class="botao verde" id="btn-proxima">${ultima ? "Ver resultado" : "Próxima etapa"} &gt;&gt;</button>
      </div>`);
    const btn = document.getElementById("btn-proxima");
    btn.focus({ preventScroll: true });
    btn.addEventListener("click", () => ultima ? telaFinal() : telaPergunta(i + 1));
  }

  function telaFinal() {
    const certos = estado.respostas.filter(Boolean).length;
    const recordeAnterior = lerRecorde();
    salvarRecorde(estado.pontos);
    desenharEtapas("fim");

    el.personagem.hidden = true;
    el.balao.hidden = true;
    const fim = document.createElement("section");
    fim.className = "fim";
    fim.innerHTML = `
      <div class="fim-placar">
        <div class="fim-personagem">${Cenas.personagem()}</div>
        <div>
          <h2>Obrigado por participar!</h2>
          <p class="detalhe">sua pontuação:</p>
          <p class="numero">${estado.pontos}</p>
          <p class="detalhe">${certos} de ${TOTAL} respostas certas
            ${estado.pontos > recordeAnterior && recordeAnterior > 0 ? " · novo recorde!" : ""}</p>
        </div>
        <div class="fim-links">
          <button type="button" class="link-seta" id="btn-novamente">Jogar novamente</button>
          <a class="link-seta" href="geral.html" target="_blank" rel="noopener">Conheça todo o processo</a>
        </div>
      </div>`;
    el.palco.appendChild(fim);

    document.getElementById("btn-novamente").addEventListener("click", telaInicial);
  }

  el.personagem.innerHTML = Cenas.personagem();
  telaInicial();
})();
