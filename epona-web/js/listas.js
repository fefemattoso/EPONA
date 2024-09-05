document.addEventListener('DOMContentLoaded', () => {
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

    // Carregar tarefas do localStorage
    function carregarLista() {
        const lista = JSON.parse(localStorage.getItem('tarefas')) || [];
        lista.forEach(item => {
            const card = createCard(item.texto, item.concluida);
            cardContainer.appendChild(card);
        });
    }

    // Salvar tarefas no localStorage
    function salvarLista() {
        const cards = Array.from(cardContainer.querySelectorAll('.card'));
        const lista = cards.map(card => ({
            texto: card.querySelector('label').textContent,
            concluida: card.classList.contains('completed')
        }));
        localStorage.setItem('tarefas', JSON.stringify(lista));
    }

    // Abre o modal de adicionar item
    document.querySelector(".btn.add").addEventListener("click", () => {
        addItemModal.style.display = "block";
    });

    // Fecha o modal de adicionar item
    addItemClose.addEventListener("click", () => {
        addItemModal.style.display = "none";
    });

    // Adiciona o novo item
    addItemBtn.addEventListener("click", () => {
        const text = newItemText.value.trim();
        if (text) {
            const card = createCard(text);
            cardContainer.appendChild(card);
            newItemText.value = ""; // Limpar campo
            addItemModal.style.display = "none";
            salvarLista();
        }
    });

    // Abre o modal de editar item ao clicar em um item
    cardContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "LABEL") {
            currentEditingCard = e.target.parentElement;
            editItemText.value = e.target.textContent;
            editItemModal.style.display = "block";
        }
    });

    // Fecha o modal de editar item
    editItemClose.addEventListener("click", () => {
        editItemModal.style.display = "none";
    });

    // Salva as edições do item
    editItemBtn.addEventListener("click", () => {
        if (currentEditingCard) {
            const newText = editItemText.value.trim();
            if (newText) {
                currentEditingCard.querySelector("label").textContent = newText;
                editItemText.value = ""; // Limpar campo
                editItemModal.style.display = "none";
                salvarLista();
            }
        }
    });

    // Remove itens concluídos
    removeCompletedBtn.addEventListener("click", () => {
        const completedCards = document.querySelectorAll(".card.completed");
        completedCards.forEach(card => card.remove());
        salvarLista();
    });

    // Adiciona funcionalidade para marcar itens como concluídos ao clicar
    cardContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const card = e.target.parentElement;
            card.classList.toggle("completed", e.target.checked);
            salvarLista();
        }
    });

    // Cria um novo card
    function createCard(text, completed = false) {
        const card = document.createElement("div");
        card.classList.add("card");
        if (completed) {
            card.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;

        const label = document.createElement("label");
        label.textContent = text;

        card.appendChild(checkbox);
        card.appendChild(label);

        return card;
    }

    // Carregar lista ao iniciar
    carregarLista();
});
