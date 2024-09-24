document.addEventListener('DOMContentLoaded', () => {
    const atividadesList = document.getElementById('atividadesList');
    const addAtividadeModal = document.getElementById('addAtividadeModal');
    const editAtividadeModal = document.getElementById('editAtividadeModal');
    const overlayAll = document.getElementById('overlayAll');
    const overlayIndividual = document.getElementById('overlayIndividual');
    const addAtividadeBtn = document.getElementById('addAtividadeBtn');
    let atividadeParaRemover = null;
    let atividadeParaEditar = null;

    const API_URL = 'http://localhost:3000/atividade';

    const getUsuarioId = () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    };

    async function carregarAtividades() {
        const usuarioId = getUsuarioId();
        const token = localStorage.getItem('token')
        if(usuarioId == null){
            window.location.href = "./login.html"
        }  else {
            try {
                const response = await fetch(`${API_URL}usuario/${usuarioId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(response.status == 403) {
                    window.location.href = "./login.html"
                }
               else if (!response.ok) {
                throw new Error('Falha na resposta da API');
            } else{
                const atividades = await response.json();
                atividades.forEach(atividade => adicionarAtividade(atividade));
            }
            } catch (error) {
                console.error('Erro ao carregar atividades:', error);
            }
        }
    
    }


    document.getElementById('addAtividadeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const usuarioId = getUsuarioId();
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;

        if(usuarioId == null){
            window.location.href = "./login.html"
        } else {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ titulo, descricao, usuarioId })
                });
                if(response.status == 403){
                    window.location.href = "./login.html"
                } else if (!response.ok) {
                    throw new Error('Falha ao adicionar atividade');
                } else {
                const newAtividade = await response.json();
                adicionarAtividade(newAtividade);
                }
            } catch (error) {
                console.error('Erro ao adicionar atividade:', error);
            }

            addAtividadeModal.classList.add('hidden');
            e.target.reset();
        }
    });

    //Editar atividade
    document.getElementById('editAtividadeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const usuarioId = getUsuarioId();
        const titulo = document.getElementById('newTitulo').value; // Usar IDs corretos
        const descricao = document.getElementById('newDescricao').value;
        const atividadeId = parseInt(e.target.dataset.id);

        if(usuarioId == null){
            window.location.href = "./login.html"
        } else {
            try {
                const response = await fetch(`${API_URL}/${atividadeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ titulo, descricao, usuarioId })
                });
                if(response.status == 403){
                    window.location.href = "./login.html"
                }
                else if (!response.ok) {
                    throw new Error('Erro ao atualizar atividade');
                } else {
                const updatedAtividade = await response.json();

                // Atualize o card existente com os novos dados
                atividadeParaEditar.titulo = updatedAtividade.titulo;
                atividadeParaEditar.descricao = updatedAtividade.descricao;

                const card = document.querySelector(`[data-id="${atividadeId}"]`);
                card.querySelector('.titulo').textContent = updatedAtividade.titulo;
                card.querySelector('.descricao').textContent = updatedAtividade.descricao;
                }
            } catch (error) {
                console.error('Erro ao editar atividade:', error);
            }

            editAtividadeModal.classList.add('hidden');
            e.target.reset();
        }
    });

    addAtividadeBtn.addEventListener('click', () => {
        addAtividadeModal.classList.remove('hidden');
        atividadeParaEditar = null; // Reseta a atividade para edição ao abrir o modal
    });

    function adicionarAtividade(atividade) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = atividade.id;
        if (atividade.concluido) {
            card.classList.toggle('concluida');
            card.innerHTML = `
                <div class="headerCard">
                    <h2 class="titulo">${atividade.titulo}</h2>
                    <div class="botoes">
                        <span class="remove-atividade">&#9747;</span>
                        <span class="edit-atividade">&#9998;</span>
                    </div>
                </div>
                <p class="descricao">${atividade.descricao}</p>
                <button class="concluido-btn">Concluído</button>
            `;
        } else {
            card.innerHTML = `
                    <div class="headerCard">
                        <h2 class="titulo">${atividade.titulo}</h2>
                        <div class="botoes">
                            <span class="remove-atividade">&#9747;</span>
                            <span class="edit-atividade">&#9998;</span>
                        </div>
                    </div>
                    <p class="descricao">${atividade.descricao}</p>
                    <button class="concluido-btn">Concluir</button>
                `;
        }

        card.querySelector('.edit-atividade').addEventListener('click', () => {
            atividadeParaEditar = atividade; // Mantenha referência ao objeto atividade
            document.getElementById('newTitulo').value = atividade.titulo; // Usar IDs corretos
            document.getElementById('newDescricao').value = atividade.descricao;
            editAtividadeModal.classList.remove('hidden');

            // Armazena o ID da atividade a ser editada
            document.getElementById('editAtividadeForm').dataset.id = atividade.id;
        });



        card.querySelector('.remove-atividade').addEventListener('click', async () => {
            atividadeParaRemover = card;
            overlayIndividual.classList.remove('hidden');
        });

        card.querySelector('.concluido-btn').addEventListener('click', async () => {
            const concluido = card.classList.toggle('concluida');
            const token = localStorage.getItem('token')
            const usuarioId = getUsuarioId();

            if(usuarioId == null){
                window.location.href = "./login.html"
            }  else {
                card.querySelector('.concluido-btn').textContent = concluido ? 'Concluída' : 'Concluído';
                if (concluido) {
                    try {
                        const response = await fetch(`${API_URL}/${atividade.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ id: atividade.id, concluido: true })
                        });
                        if(response.status == 403){
                            window.location.href = "./login.html"
                        }
                        if (!response.ok) {
                            throw new Error(`Erro ao atualizar: ${response.status} ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error('Erro ao atualizar atividade:', error);
                    }
                } else {
                    try {
                        const response = await fetch(`${API_URL}/${atividade.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ id: atividade.id, concluido: false })
                        });
                        if(response.status == 403){
                            window.location.href = "./login.html"
                        }
                        if (!response.ok) {
                            throw new Error(`Erro ao atualizar: ${response.status} ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error('Erro ao atualizar atividade:', error);
                    }
                }
            }
        });

        atividadesList.appendChild(card);
    }

    document.getElementById('confirmIndividualBtn').addEventListener('click', async () => {
        const token = localStorage.getItem('token')
        const usuarioId = getUsuarioId();
        if(usuarioId == null){
            window.location.href = "./login.html"
        } else {
            if (atividadeParaRemover) {
                const id = atividadeParaRemover.dataset.id;
                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ usuarioId: getUsuarioId() })
                    });
                    if(response.status == 403){
                        window.location.href = "./login.html"
                    }
                    atividadeParaRemover.remove();
                } catch (error) {
                    console.error('Erro ao remover atividade:', error);
                }
                overlayIndividual.classList.add('hidden');
                atividadeParaRemover = null;
            }
        }
    });

    document.getElementById('cancelUm').addEventListener('click', async () => {
        overlayIndividual.classList.add('hidden');
    })

    document.getElementById('cancel').addEventListener('click', async () => {
        editAtividadeModal.classListadd('hidden');
        addAtividadeModal.classList.add('hidden');
    })

    document.getElementById('cancelEdit').addEventListener('click', async () => {
        editAtividadeModal.classList.add('hidden');
    })

    carregarAtividades();


    //Fazer logoff e exibir nome do usuario
    const sair = document.getElementById("sair");
    const nomeUsuario = document.getElementById("usuario")

    sair.addEventListener("click", () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        localStorage.removeItem(usuario);

        window.location.href = "./login.html";
        });


    function preencherNome() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
            nomeUsuario.innerHTML = `${usuario.nome}`
    }

    preencherNome()
});
