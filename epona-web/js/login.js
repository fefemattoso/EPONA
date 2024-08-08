// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Exemplo de usuário e senha predefinidos
    const validUsername = 'usuario';
    const validPassword = 'senha123';

    if (username === validUsername && password === validPassword) {
        // Redirecionar para a home page
        window.location.href = 'index.html';
    } else {
        // Mostrar mensagem de erro
        document.getElementById('errorMessage').classList.remove('hidden');
    }
});
