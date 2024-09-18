document.addEventListener('DOMContentLoaded', () => {
    const atividadesList = document.getElementById('atividadesList');
    const addAtividadeModal = document.getElementById('addAtividadeModal');
    const overlayAll = document.getElementById('overlayAll');
    const overlayIndividual = document.getElementById('overlayIndividual');
    const confirmAllBtn = document.getElementById('confirmAllBtn');
    const cancelAllBtn = document.getElementById('cancelAllBtn');
    const addAtividadeBtn = document.getElementById('addAtividadeBtn');
    let atividadeParaRemover = null;

    // URL do backend
    const API_URL = 'http://localhost:3000/atividade';

    // Função para obter o usuarioId do token
    const getUsuarioIdFromToken = () => {
        // Implementar a lógica para extrair o usuarioId do token
        // Exemplo: return JSON.parse(localStorage.getItem('userToken')).id;
    };

    // Carregar atividades do backend
    async function carregarAtividades() {
        const usuarioId = getUsuarioIdFromToken();
        try {
            const response = await fetch(`${API_URL}?usuarioId=${usuarioId}`);
            if (!response.ok) throw new Error('Falha na resposta da API');
            const atividades = await response.json();
            console.log('Atividades carregadas:', atividades);
            atividades.forEach(atividade => adicionarAtividade(atividade));
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
        }
    }

    // Adicionar atividade através do formulário
    document.getElementById('addAtividadeForm').addEventListener('submit', async (e) => { 
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const usuarioId = getUsuarioIdFromToken(); // Obtendo o usuarioId

        console.log('Adicionando atividade:', { titulo, descricao });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, descricao, usuarioId }) // Incluindo o usuarioId
            });

            if (!response.ok) throw new Error('Falha na resposta da API');

            const newAtividade = await response.json();
            console.log('Atividade adicionada:', newAtividade);
            adicionarAtividade(newAtividade);
        } catch (error) {
            console.error('Erro ao adicionar atividade:', error);
        }

        addAtividadeModal.classList.add('hidden');
        e.target.reset(); // Limpar o formulário
    });

    // Evento para abrir o modal de adicionar atividade
    addAtividadeBtn.addEventListener('click', () => {
        addAtividadeModal.classList.remove('hidden');
    });

    // Remover todas as atividades
    document.getElementById('removeAllAtividadesBtn').addEventListener('click', () => {
        overlayAll.classList.remove('hidden');
    });

    // Confirmar remoção de todas as atividades
    confirmAllBtn.addEventListener('click', async () => {
        const usuarioId = getUsuarioIdFromToken(); // Obtendo o usuarioId
        try {
            const response = await fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuarioId }) // Enviando o usuarioId
            });
            if (response.ok) {
                atividadesList.innerHTML = '';
            }
        } catch (error) {
            console.error('Erro ao remover todas as atividades:', error);
        }
        overlayAll.classList.add('hidden');
    });

    // Cancelar remoção de todas as atividades
    cancelAllBtn.addEventListener('click', () => {
        overlayAll.classList.add('hidden');
    });

    // Adicionar atividade ao DOM
    function adicionarAtividade(atividade) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = atividade.id; // Armazena o ID da atividade
        card.innerHTML = `
            <div class="headerCard">
                <h2 class="titulo">${atividade.titulo}</h2>
                <span class="remove-atividade">&#9747;</span>
            </div>
            <p class="descricao">${atividade.descricao}</p>
            <button class="concluido-btn">Concluído</button>
        `;

        // Evento para remover a atividade
        card.querySelector('.remove-atividade').addEventListener('click', async () => {
            atividadeParaRemover = card;
            overlayIndividual.classList.remove('hidden');
        });

        // Evento para marcar a atividade como concluída ou restaurada
        card.querySelector('.concluido-btn').addEventListener('click', async () => {
            const concluida = card.classList.toggle('concluida');
            card.querySelector('.concluido-btn').textContent = concluida ? 'Concluída' : 'Concluído';
            // Se a atividade for concluída, envie uma solicitação PATCH para atualizar seu estado
            try {
                await fetch(`${API_URL}/${atividade.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ concluida, usuarioId: getUsuarioIdFromToken() }) // Incluindo o usuarioId
                });
            } catch (error) {
                console.error('Erro ao atualizar atividade:', error);
            }
        });

        atividadesList.appendChild(card);
    }

    // Confirmar remoção de uma atividade individual
    document.getElementById('confirmIndividualBtn').addEventListener('click', async () => {
        if (atividadeParaRemover) {
            const id = atividadeParaRemover.dataset.id;
            try {
                await fetch(`${API_URL}/${id}`, { 
                    method: 'DELETE', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuarioId: getUsuarioIdFromToken() }) // Incluindo o usuarioId
                });
                atividadeParaRemover.remove();
            } catch (error) {
                console.error('Erro ao remover atividade:', error);
            }
            overlayIndividual.classList.add('hidden');
            atividadeParaRemover = null; // Limpar a variável
        }
    });

    // Cancelar remoção de uma atividade individual
    document.getElementById('cancelIndividualBtn').addEventListener('click', () => {
        overlayIndividual.classList.add('hidden');
        atividadeParaRemover = null; // Limpar a variável
    });

    // Carregar atividades ao iniciar
    carregarAtividades();
});
