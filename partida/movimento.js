export let tabuleiroInvertido = false;

export function setTabuleiroInvertido(valor) {
  tabuleiroInvertido = valor;
}

function isMesmoTime(peca1, peca2) {
  const pecasBrancas = ["♙", "♖", "♘", "♗", "♕", "♔"];
  const pecasPretas = ["♟", "♜", "♞", "♝", "♛", "♚"];

  if (peca2 === " ") return false;

  return (pecasBrancas.includes(peca1) && pecasBrancas.includes(peca2)) ||
    (pecasPretas.includes(peca1) && pecasPretas.includes(peca2));
}

function capturaRei(pecaDestino) {
  return pecaDestino === "♔" || pecaDestino === "♚";
}

export function moverPeao(orig, dest, matriz, peca) {
  const [oi, oj] = orig;
  const [di, dj] = dest;

  const dir = peca === "♙" ? -1 : 1;
  const linhaInicial = peca === "♙" ? 6 : 1;

  // Movimento simples para frente
  if (dj === oj && di === oi + dir && matriz[di][dj] === " ") {
    return true;
  }

  // Movimento duplo do início
  if (dj === oj && di === oi + 2 * dir && oi === linhaInicial &&
    matriz[di][dj] === " " && matriz[oi + dir][oj] === " ") {
    return true;
  }

  // Captura na diagonal
  if (Math.abs(dj - oj) === 1 && di === oi + dir &&
    matriz[di][dj] !== " " && !isMesmoTime(peca, matriz[di][dj])) {
    return true;
  }

  return false;
}

export function moverTorre(orig, dest, matriz) {
  const [oi, oj] = orig;
  const [di, dj] = dest;

  if (oi !== di && oj !== dj) return false;

  if (oi === di) {
    const passo = dj > oj ? 1 : -1;
    for (let j = oj + passo; j !== dj; j += passo) {
      if (matriz[oi][j] !== " ") return false;
    }
  } else if (oj === dj) {
    const passo = di > oi ? 1 : -1;
    for (let i = oi + passo; i !== di; i += passo) {
      if (matriz[i][oj] !== " ") return false;
    }
  }

  return true;
}

export function moverBispo(orig, dest, matriz) {
  const [oi, oj] = orig;
  const [di, dj] = dest;

  const deltaI = Math.abs(di - oi);
  const deltaJ = Math.abs(dj - oj);
  if (deltaI !== deltaJ) return false;

  const passoI = di > oi ? 1 : -1;
  const passoJ = dj > oj ? 1 : -1;

  let i = oi + passoI;
  let j = oj + passoJ;

  while (i !== di && j !== dj) {
    if (matriz[i][j] !== " ") return false;
    i += passoI;
    j += passoJ;
  }

  return true;
}

export function moverCavalo(orig, dest, matriz) {
  const [oi, oj] = orig;
  const [di, dj] = dest;

  const deltaI = Math.abs(di - oi);
  const deltaJ = Math.abs(dj - oj);

  return (deltaI === 2 && deltaJ === 1) || (deltaI === 1 && deltaJ === 2);
}

export function moverRainha(orig, dest, matriz) {
  return moverTorre(orig, dest, matriz) || moverBispo(orig, dest, matriz);
}

export function moverRei(orig, dest, matriz) {
  const [oi, oj] = orig;
  const [di, dj] = dest;

  const deltaI = Math.abs(di - oi);
  const deltaJ = Math.abs(dj - oj);

  return deltaI <= 1 && deltaJ <= 1 && (deltaI !== 0 || deltaJ !== 0);
}

export function validarMovimento(orig, dest, matriz) {
  const [oi, oj] = orig;
  const [di, dj] = dest;

  if (oi === di && oj === dj) return false;

  const peca = matriz[oi][oj];
  const pecaDestino = matriz[di][dj];

  if (peca === " ") return false;

  if (pecaDestino !== " " && isMesmoTime(peca, pecaDestino)) {
    return false;
  }

  switch (peca) {
    case "♙": case "♟": return moverPeao(orig, dest, matriz, peca);
    case "♖": case "♜": return moverTorre(orig, dest, matriz);
    case "♘": case "♞": return moverCavalo(orig, dest, matriz);
    case "♗": case "♝": return moverBispo(orig, dest, matriz);
    case "♕": case "♛": return moverRainha(orig, dest, matriz);
    case "♔": case "♚": return moverRei(orig, dest, matriz);
    default: return false;
  }
}

export function obterMovimentosPossiveisPeca(i, j, matriz) {
  const movimentos = [];
  const peca = matriz[i][j];

  if (peca === " ") return movimentos;

  for (let di = 0; di < 8; di++) {
    for (let dj = 0; dj < 8; dj++) {
      if (validarMovimento([i, j], [di, dj], matriz)) {
        movimentos.push([di, dj]);
      }
    }
  }

  return movimentos;
}

export function movimentoCapturaRei(orig, dest, matriz) {
  const [oi, oj] = orig;
  const [di, dj] = dest;
  const pecaDestino = matriz[di][dj];

  return capturaRei(pecaDestino);
}

export function peaoChegouFinal(i, j, peca) {
  return (peca === "♙" && i === 0) || (peca === "♟" && i === 7);
}