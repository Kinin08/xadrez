const logoutBtn = document.querySelector('#logout-btn');

logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('../componentes/logout.php');
    const data = await res.json();

    if (!data.error) {
      window.location.href = '../cadastro/';
    } else {
      alert('Erro ao sair: ' + data.message);
    }
  } catch (error) {
    console.error('Erro ao realizar logout:', error);
  }
});
