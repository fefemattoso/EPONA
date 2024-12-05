document.addEventListener('DOMContentLoaded', () => {
    const sair = document.getElementById("sair");
    const userName = document.getElementById("usuario");
    const userOptions = document.getElementById("user-options");
    const closeBtn = document.querySelector(".close-btn");
    const darkModeIcon = document.getElementById("dark-mode-icon");
    const termsLink = document.querySelector('#termos');
    const termsModal = document.getElementById('terms-modal');
    const closeModal = document.querySelector('.close-modal');
    const usuario = JSON.parse(localStorage.getItem('usuario'));  
    const token = localStorage.getItem('token');  
    
    checarDados()
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

    // Função para verificar se o token está expirado
    function verificarTokenExpirado(token) {
        if (!token) return true; // Se o token não existe, consideramos expirado

        // Decodificar o token JWT
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica a parte 'payload' do token
        const expTimestamp = payload.exp * 1000; // A expiração vem em segundos, então multiplicamos por 1000 para converter para milissegundos
        const now = Date.now(); // Obtém a data atual em milissegundos

        // Retorna true se o token estiver expirado
        return expTimestamp < now;
    }

    async function checarDados() {
        if (!usuario || !token) {
            alert('Por Favor, realize login no sistema');
            window.location.href = "./login.html";
        } else if (verificarTokenExpirado(token)) {
            alert('O seu token expirou, por favor, faça login novamente.');
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');
            window.location.href = "./login.html"; 
        }
    }

    async function carregarnotas() {
        await checarDados();
        try {
            let response = await fetch('http://localhost:3000/notas', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            let notas = await response.json()

            document.getElementById('notasList').innerHTML = ''
            notas.forEach(nota => {
                let notaCard = document.createElement('div');
                notaCard.classList.add('notaCard');
                nota.concluido ? 'notaCard.classList.add("concluido")' : ''
                notaCard.innerHTML = `
                    <div class="headerCard">
                        <h3>${nota.titulo}</h3>
                        <div class="botoes">
                            <p style="color:red; cursor:pointer" id="deletarnotaBtn" onclick="abrirModalDeletar(${nota.id})">&#128465;</p>
                        </div>
                    </div>
                    <p>${nota.descricao}</p>
                `;

                document.getElementById('notasList').appendChild(notaCard);
            })
        } catch (e) {
            console.error("Erro ao carregar notas:", e)
        }

    }

    const confirmNotaClose = document.getElementById('confirmNotaClose');
    confirmNotaClose.addEventListener('click', () => {
        confirmModal.style.display = 'none';
    });

    const addnotaBtn = document.getElementById('addnotaBtn')
    addnotaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const addnotaModal = document.getElementById('addnotaModal');
        addnotaModal.style.display = 'flex';
    })

    //Formulario de adicionar nota
    const addnotaForm = document.getElementById('addnotaForm');
    addnotaForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        await checarDados();
        let titulo = addnotaForm.titulo.value;
        let descricao = addnotaForm.descricao.value;
        let usuarioId = usuario.id;

        try{
            let response = await fetch('http://localhost:3000/notas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: titulo,
                    descricao: descricao,
                    usuarioId: usuarioId
                })
            })
            if(!response.ok) {
                throw new Error('Erro ao adicionar nota')
            }
            alert('nota adicionada!')
            window.location.reload()
        } catch (e) {
            console.error("Erro ao adicionar nota:", e)
        }
    })

    sair.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");


        window.location.href = "./login.html";
        });

    const nomeUsuario = document.getElementById("usuario")

    function preencherNome() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
            nomeUsuario.innerHTML = `${usuario.nome}`
    }


    preencherNome();
    
    carregarnotas();

});

const usuario = JSON.parse(localStorage.getItem('usuario'));
const token = localStorage.getItem('token');

// Função para verificar se o token está expirado
function verificarTokenExpirado(token) {
    if (!token) return true; // Se o token não existe, consideramos expirado

    // Decodificar o token JWT
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica a parte 'payload' do token
    const expTimestamp = payload.exp * 1000; // A expiração vem em segundos, então multiplicamos por 1000 para converter para milissegundos
    const now = Date.now(); // Obtém a data atual em milissegundos

    // Retorna true se o token estiver expirado
    return expTimestamp < now;
}

async function checarDados() {
    if (!usuario || !token) {
        alert('Por Favor, realize login no sistema');
        window.location.href = "./login.html";
    } else if (verificarTokenExpirado(token)) {
        alert('O seu token expirou, por favor, faça login novamente.');
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        window.location.href = "./login.html"; 
    }
}

    function abrirModalDeletar(id){
        const confirmModal = document.getElementById('confirmModal');
        confirmModal.style.display = 'block';
        const notaId = document.getElementById("notaId");
        notaId.value = id;
    }

    cancel = document.getElementById('cancel');

    cancel.addEventListener("click", () => {
        const addnotaModal = document.getElementById("addnotaModal");
        addnotaModal.style.display = 'none';
    });

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'none';
});
const btnConfirm = document.getElementById("btnConfirm");
btnConfirm.addEventListener("click", () => {
    deletarnota();
});


async function deletarnota() {
    const notaId = document.getElementById("notaId").value;
    await checarDados();

    try {
        let response = await fetch(`http://localhost:3000/notas/${notaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status == 403) {
            window.location.href = "./login.html"
        }
        else if (!response.ok) {
            throw new Error('Falha ao deletar nota')
        }
        window.location.reload()
    } catch (e) {
        console.error('Erro ao deletar nota:', e)
    }
}
