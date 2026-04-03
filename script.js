import showToast from "./toast/toast.js";
const form = document.querySelector('form');
const toggleSenha = document.querySelector('#toggleSenha');
const senhaInput = document.querySelector('#senha');

function togglePassword(input, button) {
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fa fa-eye"></i>';
    }
}
toggleSenha.addEventListener('click', () => {
    togglePassword(senhaInput, toggleSenha);
});


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    try {
        const res = await fetch('componentes/login.php', {
            method: 'POST',
            body: fd
        });

        const data = await res.json();
        console.log(data);

        if (data.error) {
            showToast(data.message, 'error');
        } else {
            showToast(data.message, 'success');
            setTimeout(() => {
                location.href = 'lobby/';
            }, 2000);
        }
    } catch (err) {
        showToast('Erro ao se conectar com o servidor', 'warning');
        console.error(err);
    }
});
