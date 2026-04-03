export function criarTabuleiro(containerId, matriz, casasPossiveis = []) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  container.classList.add("tabuleiro");

  for (let i = 0; i < 8; i++) {
    const row = document.createElement("div");
    row.classList.add("linha");
    for (let j = 0; j < 8; j++) {
      const casa = document.createElement("div");
      casa.classList.add("casa");

      const cor = (i + j) % 2 === 0 ? "clara" : "escura";
      casa.classList.add(cor);

      casa.dataset.i = i;
      casa.dataset.j = j;

      const isPossivel = casasPossiveis.some(([ci, cj]) => ci === i && cj === j);
      if (isPossivel) {
        casa.classList.add("possivel");
      }

      const peca = matriz[i][j];
      if (peca !== " ") {
        const pecaDiv = document.createElement("div");
        pecaDiv.textContent = peca;
        pecaDiv.style.width = "100%";
        pecaDiv.style.height = "100%";
        pecaDiv.style.display = "flex";
        pecaDiv.style.alignItems = "center";
        pecaDiv.style.justifyContent = "center";
        pecaDiv.style.fontSize = "40px";
        pecaDiv.style.cursor = "pointer";

        const pecasBrancas = ["♙", "♖", "♘", "♗", "♕", "♔"];
        const pecasPretas = ["♟", "♜", "♞", "♝", "♛", "♚"];

        if (pecasBrancas.includes(peca)) {
          pecaDiv.classList.add("peca-branca");
        } else if (pecasPretas.includes(peca)) {
          pecaDiv.classList.add("peca-preta");
        }

        casa.appendChild(pecaDiv);
      }

      row.appendChild(casa);
    }
    container.appendChild(row);
  }
}