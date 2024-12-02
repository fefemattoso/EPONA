document.addEventListener('DOMContentLoaded', () => {
    const sair = document.getElementById("sair");
    const userName = document.getElementById("usuario");
    const userOptions = document.getElementById("user-options");
    const closeBtn = document.querySelector(".close-btn");
    const darkModeIcon = document.getElementById("dark-mode-icon");
    const termsLink = document.querySelector('#user-options li a[href="./termos.html"]');
    const termsModal = document.getElementById('terms-modal');
    const closeModal = document.querySelector('.close-modal');
    const usuario = JSON.parse(localStorage.getItem('usuario'));  
    const token = localStorage.getItem('token');  

    function verificarTokenExpirado(token) {
        if (!token) return true; // Se o token não existe, consideramos expirado  
    
        // Decodificar o token JWT  
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica a parte 'payload' do token  
        const expTimestamp = payload.exp * 1000; // A expiração vem em segundos, então multiplicamos por 1000 para converter para milissegundos  
        const now = Date.now(); // Obtém a data atual em milissegundos  
    
        // Retorna true se o token estiver expirado  
        return expTimestamp < now;
    }
    
    // Função para checar dados e redirecionar caso necessário  
    async function checarDados() {
        if (!usuario || !token) {
            alert('Por Favor, realize login no sistema');
            window.location.href = "./login.html";
        } else if (verificarTokenExpirado(token)) {
            alert('O seu token expirou, por favor, faça login novamente.');
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');
            window.location.href = "./login.html"; // Redireciona para a página de login  
        }
    }
    
    // Abrir o modal
    termsLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o redirecionamento padrão
        termsModal.classList.remove('hidden');
    });

    // Fechar o modal
    closeModal.addEventListener('click', () => {
        termsModal.classList.add('hidden');
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            termsModal.classList.add('hidden');
        }
    });

    const moonIcon = "../images/moon.png"; // Caminho do ícone da lua
    const sunIcon = "../images/sun.png";
    // Mostrar o menu lateral
    userName.addEventListener("click", () => {
        userOptions.classList.add("active");
        userOptions.classList.remove("hidden");
    });

    // Fechar o menu lateral
    closeBtn.addEventListener("click", () => {
        userOptions.classList.add("hidden");
        userOptions.classList.remove("active");
    });

    darkModeIcon.addEventListener("click", () => {
        const isDarkMode = document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
        darkModeIcon.src = isDarkMode ? sunIcon : moonIcon; // Alterar o ícone
        darkModeIcon.alt = isDarkMode ? "Modo Claro" : "Modo Escuro";
    });

    // Carregar o estado do modo escuro e o ícone correspondente
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeIcon.src = sunIcon; // Ícone do sol para modo escuro
        darkModeIcon.alt = "Modo Claro";
    } else {
        darkModeIcon.src = moonIcon; // Ícone da lua para modo claro
        darkModeIcon.alt = "Modo Escuro";
    }


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
    checarDados()
})