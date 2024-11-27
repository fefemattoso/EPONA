document.addEventListener('DOMContentLoaded', () => {
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
        } else {
            console.log('Você está autenticado');
        }
    }

    async function carregarnotas() {
        checarDados();
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

    //Abrir modal de adicionar notas
    const addnotaModal = document.getElementById('addnotaModal');

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

    function preencherNome() {
        const nomeUsuario = document.getElementById("usuarioNome")
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        nomeUsuario.innerHTML = `${usuario.nome}`
    }

    carregarnotas();
    preencherNome();

});
const token = localStorage.getItem('token');

    function abrirModalDeletar(id){
        const confirmModal = document.getElementById('confirmModal');
        confirmModal.style.display = 'block';
        const notaId = document.getElementById("notaId");
        notaId.value = id;
        console.log(id);
    }

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
