document.addEventListener('DOMContentLoaded', () => {
    const atividadesList = document.getElementById('atividadesList');
    const addAtividadeModal = document.getElementById('addAtividadeModal');
    const overlayAll = document.getElementById('overlayAll');
    const overlayIndividual = document.getElementById('overlayIndividual');
    const confirmAllBtn = document.getElementById('confirmAllBtn');
    const cancelAllBtn = document.getElementById('cancelAllBtn');
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
        if (!usuarioId) {
            window.location.href = "./login.html";
        } else {
            try {
                const response = await fetch(`${API_URL}usuario/${usuarioId}`);
                console.log('Resposta ao carregar atividades:', response);
    
                if (!response.ok) throw new Error('Falha na resposta da API');
    
                const atividades = await response.json();
                console.log('Atividades carregadas:', atividades);
                atividades.forEach(atividade => adicionarAtividade(atividade));
            } catch (error) {
                console.error('Erro ao carregar atividades:', error);
            }
        }
    }
    

    document.getElementById('addAtividadeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const usuarioId = getUsuarioId();

        if (atividadeParaEditar) {
            try {
                const response = await fetch(`${API_URL}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: atividadeParaEditar.dataset.id, titulo, descricao })
                });
                if (!response.ok) throw new Error('Falha na resposta da API');

                const updatedAtividade = await response.json();
                atividadeParaEditar.querySelector('.titulo').textContent = updatedAtividade.titulo;
                atividadeParaEditar.querySelector('.descricao').textContent = updatedAtividade.descricao;
            } catch (error) {
                console.error('Erro ao atualizar atividade:', error);
            }
            atividadeParaEditar = null;
        } else {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo, descricao, usuarioId })
                });
                if (!response.ok) throw new Error('Falha na resposta da API');
                const newAtividade = await response.json();
                adicionarAtividade(newAtividade);
            } catch (error) {
                console.error('Erro ao adicionar atividade:', error);
            }
        }

        addAtividadeModal.classList.add('hidden');
        e.target.reset();
    });

    addAtividadeBtn.addEventListener('click', () => {
        addAtividadeModal.classList.remove('hidden');
        atividadeParaEditar = null; // Reseta a atividade para edição ao abrir o modal
    });

    document.getElementById('removeAllAtividadesBtn').addEventListener('click', () => {
        overlayAll.classList.remove('hidden');
    });

    confirmAllBtn.addEventListener('click', async () => {
        const usuarioId = getUsuarioId();
        try {
            const response = await fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuarioId })
            });
            if (response.ok) {
                atividadesList.innerHTML = '';
            }
        } catch (error) {
            console.error('Erro ao remover todas as atividades:', error);
        }
        overlayAll.classList.add('hidden');
    });

    cancelAllBtn.addEventListener('click', () => {
        overlayAll.classList.add('hidden');
    });

    function adicionarAtividade(atividade) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = atividade.id;
        card.innerHTML = `
            <div class="headerCard">
                <h2 class="titulo">${atividade.titulo}</h2>
                <span class="remove-atividade">&#9747;</span>
                <span class="edit-atividade">&#9998;</span>
            </div>
            <p class="descricao">${atividade.descricao}</p>
            <button class="concluido-btn">Concluído</button>
        `;

        card.querySelector('.edit-atividade').addEventListener('click', () => {
            atividadeParaEditar = card;
            document.getElementById('titulo').value = atividade.titulo;
            document.getElementById('descricao').value = atividade.descricao;
            addAtividadeModal.classList.remove('hidden');
        });

        card.querySelector('.remove-atividade').addEventListener('click', async () => {
            atividadeParaRemover = card;
            overlayIndividual.classList.remove('hidden');
        });

        card.querySelector('.concluido-btn').addEventListener('click', async () => {
            const concluida = !card.classList.toggle('concluida'); 
            card.querySelector('.concluido-btn').textContent = concluida ? 'Concluída' : 'Concluído';
        
            console.log('Atualizando atividade:', { id: atividade.id, concluida });
        
            try {
                const response = await fetch(`${API_URL}/${atividade.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: atividade.id, concluida })
                });
        
                console.log('Resposta da API:', response);
        
                if (!response.ok) {
                    throw new Error(`Erro ao atualizar: ${response.status} ${response.statusText}`);
                }
        
                const updatedAtividade = await response.json();
                console.log('Atividade atualizada:', updatedAtividade);
            } catch (error) {
                console.error('Erro ao atualizar atividade:', error);
            }
        });
        

        atividadesList.appendChild(card);
    }

    document.getElementById('confirmIndividualBtn').addEventListener('click', async () => {
        if (atividadeParaRemover) {
            const id = atividadeParaRemover.dataset.id;
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuarioId: getUsuarioId() })
                });
                atividadeParaRemover.remove();
            } catch (error) {
                console.error('Erro ao remover atividade:', error);
            }
            overlayIndividual.classList.add('hidden');
            atividadeParaRemover = null;
        }
    });

    document.getElementById('cancelIndividualBtn').addEventListener('click', () => {
        overlayIndividual.classList.add('hidden');
        atividadeParaRemover = null;
    });

    carregarAtividades();
});
