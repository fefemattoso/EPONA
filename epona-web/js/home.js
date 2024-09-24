document.addEventListener('DOMContentLoaded', () => {
    const sair = document.getElementById("sair");


    sair.addEventListener("click", () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        localStorage.removeItem(usuario);

        window.location.href = "./login.html";
        });

    const nomeUsuario = document.getElementById("usuario")

    function preencherNome() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
            nomeUsuario.innerHTML = `${usuario.nome}`
    }

    preencherNome()
})