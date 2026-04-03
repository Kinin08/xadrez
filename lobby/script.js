const criar = document.querySelector('#criar');

async function loadUser() {
  try {
    const res = await fetch('../componentes/perfil.php');
    const data = await res.json();

    if (data.error || !data.user || !data.user.email) {
      alert("Você precisa estar logado para acessar esta página.");
      window.location.href = "../login/index.html";
      return;
    }

  } catch (err) {
    console.error("Erro ao carregar usuário:", err);
    alert("Erro ao verificar login. Faça login novamente.");
    window.location.href = "../login/index.html";
  }
}

criar.addEventListener('click', () => {
        location.href = "../partida/";
});

loadUser()