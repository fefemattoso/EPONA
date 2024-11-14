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
        } else {
            console.log('Você está autenticado');
        }
    }

    async function carregarAtividades() {
        checarDados();
        try {
            let response = await fetch('http://localhost:3000/atividade', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            let atividades = await response.json()

            document.getElementById('atividadesList').innerHTML = ''
            atividades.forEach(atividade => {
                let atividadeCard = document.createElement('div');
                atividadeCard.classList.add('atividadeCard');
                atividade.concluido ? 'atividadeCard.classList.add("concluido")' : ''
                atividadeCard.innerHTML = `
                    <div class="headerCard">
                        <h3>${atividade.titulo}</h3>
                        <div class="botoes">
                            <p style="color:red; display:none; cursor:pointer" id="deletarAtividadeBtn" onclick="deletarAtividade(${atividade.id})">&#128465;</p>
                            <p style="display:none; cursor:pointer" id="editarAtividadeBtn" onclick="editarAtividade(${atividade.id})">&#9998;</p>
                        </div>
                    </div>
                    <p>${atividade.descricao}</p>
                    <button onclick="concluirAtividade(${atividade.id})">Concluir</button>
                `;
                // Adicionar o evento mouseover para mostrar o botão de excluir
                atividadeCard.addEventListener('mouseover', () => {
                    let deletarAtividade = atividadeCard.querySelector("#deletarAtividadeBtn");
                    let editarAtividade = atividadeCard.querySelector("#editarAtividadeBtn");
                    deletarAtividade.style.display = 'block';  // Torna o botão visível
                    editarAtividade.style.display = 'block';  // Torna o botão visível
                });

                // Adicionar o evento mouseout para esconder o botão de excluir
                atividadeCard.addEventListener('mouseout', () => {
                    let deletarAtividade = atividadeCard.querySelector("#deletarAtividadeBtn");
                    deletarAtividade.style.display = 'none';  // Torna o botão invisível novamente
                    let editarAtividade = atividadeCard.querySelector("#editarAtividadeBtn");
                    editarAtividade.style.display = 'none';  // Torna o botão visível
                });
                document.getElementById('atividadesList').appendChild(atividadeCard);
            })
        } catch (e) {
            console.error("Erro ao carregar atividades:", e)
        }

    }

    //Abrir modal de adicionar atividades
    const addAtividadeModal = document.getElementById('addAtividadeModal')

    const addAtividadeBtn = document.getElementById('addAtividadeBtn')
    addAtividadeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addAtividadeModal.style.display = 'flex';
    })

    //Formulario de adicionar atividade
    const addAtividadeForm = document.getElementById('addAtividadeForm');
    addAtividadeForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        let titulo = addAtividadeForm.titulo.value;
        let descricao = addAtividadeForm.descricao.value;
        let usuarioId = usuario.id;

        try{
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
            })
            if(!response.ok) {
                throw new Error('Erro ao adicionar atividade')
            }
            alert('Atividade adicionada!')
            window.location.reload()
        } catch (e) {
            console.error("Erro ao adicionar atividade:", e)
        }
    })

    function preencherNome() {
        const nomeUsuario = document.getElementById("usuarioNome")
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        nomeUsuario.innerHTML = `${usuario.nome}`
    }

    carregarAtividades();
    preencherNome();

});
const token = localStorage.getItem('token');

//Abrir confirmação de exclusão de atividade
const deleteAtividadeModal = document.getElementById('deleteAtividadeModal');

const deletarAtividadeBtn = document.getElementById('deletarAtividadeBtn');
    deletarAtividadeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteAtividadeModal.style.display = 'flex';
    })

function deletarAtividade(id) {
    try{
        fetch(`http://localhost:3000/atividade/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Erro ao excluir atividade')
            }
            alert('Atividade excluída!')
            window.location.reload()
        })
    } catch(e) {
            console.error("Erro ao excluir atividade:", e)
        }
    }
