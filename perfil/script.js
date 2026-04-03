const avatar = document.getElementById('avatar');
const fileInput = document.getElementById('file-input');
const avatarImg = document.getElementById('avatar-img');
const nomeUsuario = document.getElementById('nome-usuario');
const emailUsuario = document.getElementById('email-usuario');

async function loadUser() {
  try {
    const res = await fetch('../componentes/perfil.php');
    const data = await res.json();

    if (data.error || !data.user || !data.user.email) {
      alert("Você precisa estar logado para acessar esta página.");
      window.location.href = "../index.html";
      return;
    }

    nomeUsuario.textContent = data.user.name;
    emailUsuario.textContent = data.user.email;
    
    if (data.user.avatar) {
      avatarImg.src = data.user.avatar + '?t=' + Date.now();
    }

  } catch (err) {
    console.error("Erro ao carregar usuário:", err);
    alert("Erro ao verificar login. Faça login novamente.");
    window.location.href = "../index.html";
  }
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const res = await fetch('../componentes/avatar.php', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (!data.error) {
      avatarImg.src = data.avatar + '?t=' + Date.now();
      alert('✅ ' + data.message);
    } else {
      alert('❌ ' + data.message);
    }

  } catch (err) {
    console.error('Erro:', err);
    alert('❌ Erro de conexão');
  }
});

avatar.addEventListener('click', () => fileInput.click());

loadUser();