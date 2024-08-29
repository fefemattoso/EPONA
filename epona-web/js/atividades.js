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
                <span class="remove-atividade">&#9747;</span>
            </div>
            <p class="descricao">${descricao}</p>
            <button class="concluido-btn">Concluído</button>
        `;

        // Evento para remover a atividade
        card.querySelector('.remove-atividade').addEventListener('click', () => {
            atividadeParaRemover = card;
            overlayIndividual.classList.remove('hidden');
        });

        // Evento para marcar a atividade como concluída ou restaurada
        card.querySelector('.concluido-btn').addEventListener('click', () => {
            if (card.classList.contains('concluida')) {
                // Restaurar atividade
                card.classList.remove('concluida');
                card.querySelector('.concluido-btn').textContent = 'Concluído';
                // Remover botão de restaurar
                const restaurarBtn = card.querySelector('.restaurar-btn');
                if (restaurarBtn) restaurarBtn.remove();
            } else {
                // Concluir atividade
                card.classList.add('concluida');
                card.querySelector('.concluido-btn').textContent = 'Concluída';

                // Adicionar botão de restaurar se não existir
                if (!card.querySelector('.restaurar-btn')) {
                    const restaurarBtn = document.createElement('button');
                    restaurarBtn.className = 'restaurar-btn';
                    restaurarBtn.textContent = 'Restaurar';
                    card.appendChild(restaurarBtn);

                    restaurarBtn.addEventListener('click', () => {
                        card.classList.remove('concluida');
                        card.querySelector('.concluido-btn').textContent = 'Concluído';
                        restaurarBtn.remove(); // Remove o botão de restaurar após a restauração
                    });
                }
            }
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
