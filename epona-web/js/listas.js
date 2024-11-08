document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/lista';

    const addItemModal = document.getElementById('addItemModal');

    // Função para obter usuarioId do localStorage
    function getUsuarioId() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    }

    async function carregarListas() {
        const usuarioId = getUsuarioId();
        const token = localStorage.getItem('token');
    
        if (usuarioId == null) {
            window.location.href = "./login.html";
        } else {
            try {
                const response = await fetch(`${API_URL}usuario/${usuarioId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.status == 403) {
                    window.location.href = "./login.html";
                } else if (!response.ok) {
                    throw new Error('Erro ao carregar a lista.');
                } else {
                    const listas = await response.json();
                    listas.forEach(item => {
                        console.log(item);
    
                        // Criar o card para cada lista
                        let card = document.createElement('div');
                        card.setAttribute('id', item.id);
                        card.classList.add('card');
                        card.innerHTML = `
                            <h3>${item.titulo}</h3>
                            <p style="color:red; display:none; cursor:pointer" id="deletarLista" onclick="deletarLista(${item.id})">&#128465;</p>
                        `;
    
                        // Adicionar o evento mouseover para mostrar o botão de excluir
                        card.addEventListener('mouseover', () => {
                            let deletarLista = card.querySelector("#deletarLista");
                            deletarLista.style.display = 'block';  // Torna o botão visível
                        });
    
                        // Adicionar o evento mouseout para esconder o botão de excluir
                        card.addEventListener('mouseout', () => {
                            let deletarLista = card.querySelector("#deletarLista");
                            deletarLista.style.display = 'none';  // Torna o botão invisível novamente
                        });
    
                        // Adicionar o card ao contêiner de listas
                        document.getElementById('listas').appendChild(card);
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar a lista:', error);
            }
        }
    }
    
    //Evento de abrir um modal do card ao clicar neles ou nos textos dentre
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('card')) {
            let idLista = e.target.id; //pega o id do card (lista)
            let titulo = e.target.querySelector('h3').innerText;
            console.log(idLista, titulo)
            abrirModal(idLista, titulo);
        }
    });

    //função de abrirModal
    async function abrirModal(idLista, titulo) {
        addItemModal.style.display = 'block';
        const tituloLista = document.getElementById('titulo')
        tituloLista.innerHTML = titulo;

        //Carregar as informações das listas 
        let response = await fetch(`http://localhost:3000/itemLista/lista/${idLista}`)
        let itensLista = await response.json()
        document.getElementById('itens').innerHTML = ''
        itensLista.forEach(item => {
            let itemCard = document.createElement('div');
            itemCard.classList.add('itemCard');
            itemCard.style.display = 'flex';
            itemCard.innerHTML = `
            <input type="checkbox" id="concluido"}>
                <p>${item.descricao}</p>
                <div class="acoes">
                    <button class="editar" onclick="editarItem(${item.id}, '${item.descricao}')">Editar</button>
                    <button class="deletar" onclick="deletarItem(${item.id})">Deletar</button>
                    `
            document.getElementById('itens').appendChild(itemCard);
        });
    }

    //fechar addItemModal
    const addItemClose = document.getElementById('addItemClose');
    addItemClose.addEventListener('click', () => {
        addItemModal.style.display = 'none';
    });

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

    carregarListas()
    preencherNome()
});
