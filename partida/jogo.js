import {
  criarTabuleiro
} from './tabuleiro.js';
import {
  validarMovimento,
  obterMovimentosPossiveisPeca,
  peaoChegouFinal,
  setTabuleiroInvertido
} from './movimento.js';
import showToast from '../toast/toast.js';

const matrizInicial = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

let matriz = JSON.parse(JSON.stringify(matrizInicial));
let turno = "branca";
let selecionada = null;
let casasPossiveis = [];
let jogoAtivo = true;
let usuarioId = null;
let jogandoComoPretas = false;

async function obterUsuarioId() {
  try {
    const response = await fetch('../componentes/perfil.php');
    const data = await response.json();

    if (!data.error && data.user && data.user.email) {
      return 'user_' + btoa(data.user.email).replace(/[^a-zA-Z0-9]/g, '');
    }

    alert("Você precisa estar logado para jogar.");
    window.location.href = "../login/index.html";
    return null;

  } catch (error) {
    alert("Erro ao verificar usuário. Faça login novamente.");
    window.location.href = "../login/index.html";
    return null;
  }
}

function getChaveJogo() {
  return `xadrez_jogo_${usuarioId}`;
}

function getChaveConfig() {
  return `xadrez_config_${usuarioId}`;
}

function salvarEstadoJogo() {
  if (jogoAtivo) {
    const estado = {
      matriz: matriz,
      turno: turno,
      usuario: usuarioId,
      jogandoComoPretas: jogandoComoPretas
    };
    localStorage.setItem(getChaveJogo(), JSON.stringify(estado));
  }
}

function carregarEstadoJogo() {
  const estadoSalvo = localStorage.getItem(getChaveJogo());
  if (!estadoSalvo) return false;

  try {
    const estado = JSON.parse(estadoSalvo);
    if (estado.usuario !== usuarioId) return false;

    matriz = estado.matriz;
    turno = estado.turno;
    jogandoComoPretas = estado.jogandoComoPretas || false;
    return true;
  } catch (e) {
    return false;
  }
}

function salvarConfigUsuario(cor) {
  const config = {
    corEscolhida: cor,
    usuario: usuarioId,
  };
  localStorage.setItem(getChaveConfig(), JSON.stringify(config));
}

function carregarConfigUsuario() {
  const configSalva = localStorage.getItem(getChaveConfig());
  if (!configSalva) return null;

  try {
    const config = JSON.parse(configSalva);
    return config.usuario === usuarioId ? config : null;
  } catch (e) {
    return null;
  }
}

function mostrarModalCor() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    modal.innerHTML = `
      <div class="container" style="max-width: 500px; width: 90%;">
        <h2 style="margin-bottom: 20px; font-size: 28px;"> Escolha Sua Cor</h2>
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 30px;">
          <div style="text-align: center;">
            <button class="btn" id="btnBrancas" style="
              padding: 20px 30px;
              background: white;
              color: black;
              border: none;
              border-radius: 15px;
              cursor: pointer;
              font-weight: bold;
              font-size: 18px;
              transition: all 0.3s ease;
              box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
            ">
              ♔<br>Brancas<br>
            </button>
          </div>
          <div style="text-align: center;">
            <button class="btn" id="btnPretas" style="
              padding: 20px 30px;
              background: #2c3e50;
              color: white;
              border: none;
              border-radius: 15px;
              cursor: pointer;
              font-weight: bold;
              font-size: 18px;
              transition: all 0.3s ease;
              box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
            ">
              ♚<br>Pretas<br>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const btnBrancas = document.getElementById('btnBrancas');
    const btnPretas = document.getElementById('btnPretas');

    btnBrancas.onclick = () => {
      document.body.removeChild(modal);
      resolve('branca');
    };

    btnPretas.onclick = () => {
      document.body.removeChild(modal);
      resolve('preta');
    };
  });
}

function mostrarModalPromocao(peca) {
  return new Promise((resolve) => {
    const pecasPromocao = peca === "♙"
      ? ["♕", "♖", "♗", "♘"]
      : ["♛", "♜", "♝", "♞"];

    const nomesPecas = ["Rainha", "Torre", "Bispo", "Cavalo"];

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    modal.innerHTML = `
      <div class="container">
        <h2 style="margin-bottom: 10px; font-size: 28px;">👑 Promoção de Peão</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          ${pecasPromocao.map((pecaSymbol, index) => `
            <button class="btn-promocao btn" data-peca="${pecaSymbol}" style="
              background: rgba(255, 255, 255, 0.1);
              border: 2px solid rgba(255, 255, 255, 0.3);
            ">
              <div style="font-size: 32px; margin-bottom: 8px;">${pecaSymbol}</div>
              <div style="font-size: 14px; opacity: 0.9;">${nomesPecas[index]}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.querySelectorAll('.btn-promocao').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.2)';
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = 'none';
      });

      btn.onclick = () => {
        const novaPeca = btn.dataset.peca;
        document.body.removeChild(modal);
        resolve(novaPeca);
      };
    });
  });
}

function inverterMatrizParaExibicao(matriz) {
  const matrizInvertida = [];
  for (let i = 7; i >= 0; i--) {
    matrizInvertida.push([...matriz[i]]);
  }
  return matrizInvertida;
}

function finalizarJogo(mensagem) {
  jogoAtivo = false;
  showToast(mensagem, "success");

  localStorage.removeItem(getChaveJogo());
  localStorage.removeItem(getChaveConfig());

  setTimeout(() => {
    if (confirm(`${mensagem}\n\nDeseja jogar novamente?`)) {
      window.location.reload();
    } else {
      window.location.href = "../lobby/index.html";
    }
  }, 2000);
}

function verificarReiCapturado(pecaDestino) {
  if (pecaDestino === "♔") {
    finalizarJogo("🏆 Xeque-mate! Pretas venceram!");
    return true;
  } else if (pecaDestino === "♚") {
    finalizarJogo("🏆 Xeque-mate! Brancas venceram!");
    return true;
  }
  return false;
}

function isPecaDoTurno(peca) {
  const pecasBrancas = ["♙", "♖", "♘", "♗", "♕", "♔"];
  const pecasPretas = ["♟", "♜", "♞", "♝", "♛", "♚"];
  return turno === "branca" ? pecasBrancas.includes(peca) : pecasPretas.includes(peca);
}

function atualizarTurno() {
  const turnoElement = document.getElementById("turnoAtual");
  if (turnoElement) {
    turnoElement.textContent = turno === "branca" ? "Brancas" : "Pretas";
    turnoElement.style.color = turno === "branca" ? "#fff" : "#000";
    turnoElement.style.backgroundColor = turno === "branca" ? "#000" : "#fff";
  }
}

function converterCoordenadaClickParaLogica(i, j) {
  if (jogandoComoPretas) {
    return [7 - i, j];
  }
  return [i, j];
}

function converterCoordenadasParaExibicao(coordenadas) {
  if (jogandoComoPretas) {
    return coordenadas.map(([i, j]) => [7 - i, j]);
  }
  return coordenadas;
}

function getMatrizParaExibicao() {
  if (jogandoComoPretas) {
    return inverterMatrizParaExibicao(matriz);
  }
  return matriz;
}

async function inicializarJogo() {
  usuarioId = await obterUsuarioId();

  let config = carregarConfigUsuario();

  if (!config) {
    const corEscolhida = await mostrarModalCor();
    salvarConfigUsuario(corEscolhida);
    config = { corEscolhida: corEscolhida };
  }

  const jogoCarregado = carregarEstadoJogo();
  
  if (!jogoCarregado) {
    matriz = JSON.parse(JSON.stringify(matrizInicial));
    
    // Configura se está jogando como pretas
    jogandoComoPretas = config.corEscolhida === 'preta';
    setTabuleiroInvertido(jogandoComoPretas);
    
    // Sempre começa com as brancas
    turno = "branca";
    salvarEstadoJogo();
  }

  criarTabuleiro("area", getMatrizParaExibicao());
  atualizarTurno();
  
  if (!jogoCarregado) {
    showToast(`Bem-vindo! Jogando com as ${config.corEscolhida === 'preta' ? 'pretas' : 'brancas'}`, 'success');
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  await inicializarJogo();

  const desistirBtn = document.getElementById("desistir");
  if (desistirBtn) {
    desistirBtn.addEventListener("click", function () {
      if (confirm("Tem certeza que deseja desistir?")) {
        const vencedor = turno === "branca" ? "Pretas" : "Brancas";
        finalizarJogo(`🏳️ ${vencedor} venceram por desistência!`);
      }
    });
  }

  const novoJogoBtn = document.getElementById("novoJogo");
  if (novoJogoBtn) {
    novoJogoBtn.addEventListener("click", function () {
      if (confirm("Iniciar um novo jogo? O progresso atual será perdido.")) {
        matriz = JSON.parse(JSON.stringify(matrizInicial));
        
        // Sempre começa com as brancas
        turno = "branca";

        const config = carregarConfigUsuario();
        if (config && config.corEscolhida === 'preta') {
          jogandoComoPretas = true;
          setTabuleiroInvertido(true);
        } else {
          jogandoComoPretas = false;
          setTabuleiroInvertido(false);
        }

        salvarEstadoJogo();
        criarTabuleiro("area", getMatrizParaExibicao());
        atualizarTurno();
        showToast("Novo jogo iniciado!", "success");
      }
    });
  }
});

document.addEventListener("click", async (e) => {
  if (!jogoAtivo) return;

  const casa = e.target.closest(".casa");
  if (!casa) return;

  let i = +casa.dataset.i;
  let j = +casa.dataset.j;

  // Converte coordenadas de exibição para coordenadas lógicas
  const [logicalI, logicalJ] = converterCoordenadaClickParaLogica(i, j);
  const peca = matriz[logicalI][logicalJ];

  if (!selecionada && peca !== " " && isPecaDoTurno(peca)) {
    selecionada = { 
      i: logicalI, 
      j: logicalJ, 
      peca
    };
    
    casasPossiveis = obterMovimentosPossiveisPeca(logicalI, logicalJ, matriz);
    
    // Converte casas possíveis para coordenadas de exibição
    const casasPossiveisExibicao = converterCoordenadasParaExibicao(casasPossiveis);
    
    criarTabuleiro("area", getMatrizParaExibicao(), casasPossiveisExibicao);
    document.querySelectorAll('.casa').forEach(c => c.classList.remove('sel'));
    casa.classList.add('sel');
    return;
  }

  if (selecionada) {
    const { i: oi, j: oj, peca: pecaOrigem } = selecionada;

    if (logicalI === oi && logicalJ === oj) {
      selecionada = null;
      casasPossiveis = [];
      criarTabuleiro("area", getMatrizParaExibicao());
      return;
    }

    const movimentoValido = validarMovimento([oi, oj], [logicalI, logicalJ], matriz);

    if (movimentoValido) {
      const pecaDestino = matriz[logicalI][logicalJ];

      if (verificarReiCapturado(pecaDestino)) {
        return;
      }

      let novaPeca = pecaOrigem;

      if (peaoChegouFinal(logicalI, logicalJ, pecaOrigem)) {
        novaPeca = await mostrarModalPromocao(pecaOrigem);
      }

      matriz[logicalI][logicalJ] = novaPeca;
      matriz[oi][oj] = " ";
      turno = turno === "branca" ? "preta" : "branca";
      salvarEstadoJogo();
    } else {
      showToast("Movimento inválido!", "error");
    }

    selecionada = null;
    casasPossiveis = [];
    criarTabuleiro("area", getMatrizParaExibicao());
    atualizarTurno();
  }
});