document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
    let atividadeIdParaDeletar;

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

    // Função para checar dados e redirecionar caso necessário  
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

    async function carregarAtividades() {
        let usuarioid = parseInt(usuario.id);
        await checarDados();
        try {
            let response = await fetch(`http://localhost:3000/atividadeusuario/${usuarioid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            let atividades = await response.json();

            document.getElementById('atividadesList').innerHTML = '';
            atividades.forEach(atividade => {
                let atividadeCard = document.createElement('div');
                atividadeCard.classList.add('atividadeCard');
                if (atividade.concluido == true) {
                    atividadeCard.classList.add("concluido");
                    atividadeCard.innerHTML = `  
                    <div class="headerCard">  
                        <h3>${atividade.titulo}</h3>  
                        <div class="botoes">  
                            <p style="color:red;display:none;cursor:pointer" class="deletarAtividadeBtn" data-id="${atividade.id}">&#128465;</p>  
                            <p style="display:none; cursor:pointer" class="editarAtividadeBtn" data-id="${atividade.id}" data-titulo="${atividade.titulo}" data-descricao="${atividade.descricao}">&#9998;</p>  
                        </div>  
                    </div>  
                    <p>${atividade.descricao}</p>  
                    <button id="btn${atividade.id}" onclick="concluirAtividade(${atividade.id})" disabled>Concluir</button>  
                    `;
                } else {
                    atividadeCard.innerHTML = `  
                    <div class="headerCard">  
                        <h3>${atividade.titulo}</h3>  
                        <div class="botoes">  
                            <p style="color:red;display:none; cursor:pointer" class="deletarAtividadeBtn" data-id="${atividade.id}">&#128465;</p>  
                            <p style="display:none; cursor:pointer" class="editarAtividadeBtn" data-id="${atividade.id}" data-titulo="${atividade.titulo}" data-descricao="${atividade.descricao}">&#9998;</p>  
                        </div>  
                    </div>  
                    <p>${atividade.descricao}</p>  
                    <button id="btn${atividade.id}" onclick="concluirAtividade(${atividade.id})">Concluir</button>  
                    `;
                }

                // Eventos de hover para mostrar os botões  
                atividadeCard.addEventListener('mouseover', () => {
                    let deletarAtividade = atividadeCard.querySelector(".deletarAtividadeBtn");
                    let editarAtividade = atividadeCard.querySelector(".editarAtividadeBtn");
                    deletarAtividade.style.display = 'block';
                    editarAtividade.style.display = 'block';
                });

                atividadeCard.addEventListener('mouseout', () => {
                    let deletarAtividade = atividadeCard.querySelector(".deletarAtividadeBtn");
                    let editarAtividade = atividadeCard.querySelector(".editarAtividadeBtn");
                    deletarAtividade.style.display = 'none';
                    editarAtividade.style.display = 'none';
                });

                document.getElementById('atividadesList').appendChild(atividadeCard);
            });

    
            //abrir o modal de exclusão  
            document.querySelectorAll('.deletarAtividadeBtn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const atividadeId = e.target.getAttribute('data-id');
                    deleteAtividadeModal.classList.remove('hidden');
                    atividadeIdParaDeletar = atividadeId;
                });
            });

            //abrir o modal de edição  
            document.querySelectorAll('.editarAtividadeBtn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const atividadeId = e.target.getAttribute('data-id');
                    const titulo = e.target.getAttribute('data-titulo');
                    const descricao = e.target.getAttribute('data-descricao');
                    openEditModal(atividadeId, titulo, descricao);
                });
            });

        } catch (e) {
            console.error("Erro ao carregar atividades:", e);
        }
    }

    // Modal de Exclusão  
    const deleteAtividadeModal = document.getElementById('deleteAtividadeModal');
    const deleteAtividadeBtn = document.getElementById('confirmIndividualBtn');

    deleteAtividadeBtn.addEventListener('click', () => {
        deletarAtividade(atividadeIdParaDeletar);
        deleteAtividadeModal.classList.add('hidden');
    });

    // Modal de Edição  
    const editAtividadeModal = document.getElementById('editAtividadeModal');
    const editAtividadeForm = document.getElementById('editAtividadeForm');
    let atividadeIdParaEditar;

    function openEditModal(id, titulo, descricao) {
        atividadeIdParaEditar = id;
        document.getElementById('newTitulo').value = titulo;
        document.getElementById('newDescricao').value = descricao;
        editAtividadeModal.classList.remove('hidden');
    }

    editAtividadeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await checarDados();
        const titulo = document.getElementById('newTitulo').value
        const descricao = document.getElementById('newDescricao').value

        try {
            let response = await fetch(`http://localhost:3000/atividade/${atividadeIdParaEditar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ titulo, descricao })
            });
            if (response.ok) {
                let atividade = await response.json();
                console.log(atividade)
                alert('Atividade atualizada!');
                window.location.reload();
            }
        } catch (e) {
            console.error("Erro ao editar atividade:", e);
        }
    });

    // Fechar os modais  
    document.querySelectorAll('.cancelar').forEach((btn) => {
        btn.addEventListener('click', () => {
            deleteAtividadeModal.classList.add('hidden');
            editAtividadeModal.classList.add('hidden');
        });
    });

    // Abrir modal de adicionar atividades  
    const addAtividadeModal = document.getElementById('addAtividadeModal');
    const addAtividadeBtn = document.getElementById('addAtividadeBtn');
    addAtividadeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addAtividadeModal.style.display = 'flex';
    });

    // Formulário de adicionar atividade  
    const addAtividadeForm = document.getElementById('addAtividadeForm');
    addAtividadeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let titulo = addAtividadeForm.titulo.value;
        let descricao = addAtividadeForm.descricao.value;
        let usuarioId = usuario.id;

        await checarDados();
        try {
            let response = await fetch('http://localhost:3000/atividade', {
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
            });
            if (!response.ok) {
                throw new Error('Erro ao adicionar atividade');
            }
            alert('Atividade adicionada!');
            window.location.reload();
        } catch (e) {
            console.error("Erro ao adicionar atividade:", e);
        }
    });

    function preencherNome() {
        const nomeUsuario = document.getElementById("usuario");
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        nomeUsuario.innerHTML = `${usuario.nome}`;
    }

    const sair = document.getElementById("sair");
    sair.addEventListener("click", () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        window.location.href = "./login.html";
    });

    checarDados()
    carregarAtividades();
    preencherNome();
    carregarPontuacao();

});
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

async function deletarAtividade(id) {
    await checarDados();
    try {
        fetch(`http://localhost:3000/atividade/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir atividade')
                }
                alert('Atividade excluída!')
                window.location.reload()
            })
    } catch (e) {
        console.error("Erro ao excluir atividade:", e)
    }
}

async function concluirAtividade(id) {
    let btn = document.getElementById(`btn${id}`);
    btn.disabled = true;
    await checarDados();
    try {
        let response = await fetch(`http://localhost:3000/atividade/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ concluido: true })
        });

        if (response.ok) {
            let result = await response.json();
            console.log(result.message); // Mensagem de sucesso
            window.location.reload()
        } else {
            console.error("Erro ao concluir a atividade");
        }
    } catch (error) {
        console.error("Erro ao concluir a atividade:", error);
    }
}

function abrirRanking() {
    window.location.href = "./pontuacao.html"
}

async function carregarPontuacao() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    let usuarioId = usuario.id;
    await checarDados();
    try {

        let response = await fetch(`http://localhost:3000/ranking/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        let pontuacao = await response.json();
        document.getElementById('pontuacao').innerHTML = `${pontuacao.pontuacao}`
    } catch (e) {
        console.error("Erro ao carregar pontuação:", e)
    }

}