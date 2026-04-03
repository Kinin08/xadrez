import showToast from "../toast/toast.js";

const form = document.querySelector('form');
const toggleSenha = document.querySelector('#toggleSenha');
const toggleConfirmarSenha = document.querySelector('#toggleConfirmarSenha');
const senhaInput = document.querySelector('#senha');
const confirmarSenhaInput = document.querySelector('#confirmarSenha');

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

toggleConfirmarSenha.addEventListener('click', () => {
    togglePassword(confirmarSenhaInput, toggleConfirmarSenha);
});

form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const fd = new FormData(form);

    try {
        const res = await fetch('../componentes/add.php', {
            method: 'POST',
            body: fd
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.message, 'error')
        } else {
            form.reset();
            showToast(data.message, 'success');
            setTimeout(() => {
                location.href = '../lobby/';
            }, 1000);
        }
    }
    catch (err) {
        showToast('Erro ao se conectar com o servidor', 'warning');
        console.error(err);
    }
});