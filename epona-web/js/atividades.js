document.addEventListener('DOMContentLoaded', () => {
    const atividadesList = document.getElementById('atividadesList');
    const addAtividadeModal = document.getElementById('addAtividadeModal');
    const overlayAll = document.getElementById('overlayAll');
    const overlayIndividual = document.getElementById('overlayIndividual');
    const confirmAllBtn = document.getElementById('confirmAllBtn');
    const cancelAllBtn = document.getElementById('cancelAllBtn');
    let atividadeParaRemover = null;

    // Abrir o modal de adicionar atividade
    document.getElementById('addAtividadeBtn').addEventListener('click', () => {
        addAtividadeModal.classList.remove('hidden');
    });

    // Fechar o modal de adicionar atividade
    document.getElementById('cancelAddBtn').addEventListener('click', () => {
        addAtividadeModal.classList.add('hidden');
    });

    // Adicionar atividade através do formulário
    document.getElementById('addAtividadeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        adicionarAtividade(titulo, descricao);
        addAtividadeModal.classList.add('hidden');
        e.target.reset(); // Limpar o formulário
    });

    // Remover todas as atividades
    document.getElementById('removeAllAtividadesBtn').addEventListener('click', () => {
        overlayAll.classList.remove('hidden');
    });

    // Confirmar remoção de todas as atividades
    confirmAllBtn.addEventListener('click', () => {
        atividadesList.innerHTML = '';
        overlayAll.classList.add('hidden');
    });

    // Cancelar remoção de todas as atividades
    cancelAllBtn.addEventListener('click', () => {
        overlayAll.classList.add('hidden');
    });

    // Adicionar atividade
    function adicionarAtividade(titulo, descricao) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="headerCard">
                <h2 class="titulo">${titulo}</h2>
                <span>&#9747;</span>
            </div>
            <p class="descricao">${descricao}</p>
            <button class="concluido-btn">Concluído</button>
        `;

        card.querySelector('span').addEventListener('click', () => {
            atividadeParaRemover = card;
            overlayIndividual.classList.remove('hidden');
        });

        card.querySelector('.concluido-btn').addEventListener('click', () => {
            card.classList.add('concluida');
            card.classList.add('fade-out');
            setTimeout(() => {
                card.remove();
            }, 1000); // Tempo para animação de desaparecimento
        });

        atividadesList.appendChild(card);
    }

    // Confirmar remoção de uma atividade individual
    document.getElementById('confirmIndividualBtn').addEventListener('click', () => {
        if (atividadeParaRemover) {
            atividadeParaRemover.remove();
            overlayIndividual.classList.add('hidden');
            atividadeParaRemover = null; // Limpar a variável
        }
    });

    // Cancelar remoção de uma atividade individual
    document.getElementById('cancelIndividualBtn').addEventListener('click', () => {
        overlayIndividual.classList.add('hidden');
        atividadeParaRemover = null; // Limpar a variável
    });
});
