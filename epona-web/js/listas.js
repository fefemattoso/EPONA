document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/lista'; // Substitua com o endereço correto do backend
    const addItemModal = document.getElementById('addItemModal');
    const editItemModal = document.getElementById('editItemModal');
    const addItemClose = document.getElementById('addItemClose');
    const editItemClose = document.getElementById('editItemClose');
    const addItemBtn = document.getElementById('addItemBtn');
    const editItemBtn = document.getElementById('editItemBtn');
    const newItemText = document.getElementById('newItemText');
    const editItemText = document.getElementById('editItemText');
    const removeCompletedBtn = document.querySelector(".btn.remove");
    const cardContainer = document.getElementById('cardContainer');
    let currentEditingCard = null;

    async function carregarLista() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erro ao carregar a lista.');
            const lista = await response.json();
            lista.forEach(item => {
                const card = createCard(item.descricao, item.concluida, item.id);
                cardContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar a lista:', error);
        }
    }

    async function adicionarItem(descricao) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao, usuarioId: 1 }) // Ajuste `usuarioId` conforme necessário
            });
            if (!response.ok) throw new Error('Erro ao adicionar item.');

            const newItem = await response.json();
            console.log('Item adicionado:', newItem);
            const card = createCard(newItem.descricao, newItem.concluida, newItem.id);
            cardContainer.appendChild(card);
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
        }
    }

    async function atualizarItem(id, descricao, concluida) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao, concluida })
            });
            if (!response.ok) throw new Error('Erro ao atualizar item.');
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
        }
    }

    async function removerItem(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao remover item.');
        } catch (error) {
            console.error('Erro ao remover item:', error);
        }
    }

    function createCard(descricao, concluida = false, id = null) {
        const card = document.createElement("div");
        card.classList.add("card");
        if (concluida) {
            card.classList.add("completed");
        }
        if (id) {
            card.dataset.id = id;
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = concluida;

        const label = document.createElement("label");
        label.textContent = descricao;

        card.appendChild(checkbox);
        card.appendChild(label);

        return card;
    }

    document.querySelector(".btn.add").addEventListener("click", () => {
        addItemModal.style.display = "block";
    });

    addItemClose.addEventListener("click", () => {
        addItemModal.style.display = "none";
    });

    addItemBtn.addEventListener("click", () => {
        const descricao = newItemText.value.trim();
        if (descricao) {
            adicionarItem(descricao);
            newItemText.value = ""; // Limpar campo
            addItemModal.style.display = "none";
        }
    });

    cardContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "LABEL") {
            currentEditingCard = e.target.parentElement;
            editItemText.value = e.target.textContent;
            editItemModal.style.display = "block";
        }
    });

    editItemClose.addEventListener("click", () => {
        editItemModal.style.display = "none";
    });

    editItemBtn.addEventListener("click", () => {
        if (currentEditingCard) {
            const newDescricao = editItemText.value.trim();
            const id = currentEditingCard.dataset.id;
            if (newDescricao) {
                const concluida = currentEditingCard.classList.contains("completed");
                atualizarItem(id, newDescricao, concluida);
                currentEditingCard.querySelector("label").textContent = newDescricao;
                editItemText.value = ""; // Limpar campo
                editItemModal.style.display = "none";
            }
        }
    });

    removeCompletedBtn.addEventListener("click", async () => {
        const completedCards = document.querySelectorAll(".card.completed");
        for (const card of completedCards) {
            const id = card.dataset.id;
            await removerItem(id);
            card.remove();
        }
    });

    cardContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const card = e.target.parentElement;
            const id = card.dataset.id;
            const concluida = e.target.checked;
            card.classList.toggle("completed", concluida);
            const descricao = card.querySelector("label").textContent;
            atualizarItem(id, descricao, concluida);
        }
    });

    carregarLista();
});
