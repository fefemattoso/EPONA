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


    async function carregarListas() {
        checarDados();
        const usuarioId = usuario.id

        if (usuarioId == null) {
            window.location.href = "./login.html";
        } else {
            try {
                const response = await fetch(`http://localhost:3000/listausuario/${usuarioId}`, {
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
                            <p style="color:red; display:none; cursor:pointer" id="deletarLista" onclick="abrirModalDeletar(${item.id})">&#128465;</p>
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

    const confirmModal = document.getElementById('confirmModal');


    //Evento de abrir um modal do card ao clicar neles ou nos textos dentre
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('card')) {
            let idLista = e.target.id; // pega o id do card (lista)
            let titulo = e.target.querySelector('h3').innerText;
            console.log(idLista, titulo);

            abrirModalLista(idLista, titulo);

            // Define o valor do input hidden (idDaLista) dentro do modal
            const idDaListaInput = document.getElementById('idDaLista');
            idDaListaInput.value = idLista; // Atribui o id da lista ao input hidden
        }
    });


    //função de exibirItensDasListas
    const exibirItensModal = document.getElementById('exibirItensModal');

    async function abrirModalLista(idLista, titulo) {
        checarDados();
        exibirItensModal.style.display = 'block';
        const tituloLista = document.getElementById('tituloLista')
        tituloLista.innerHTML = titulo;

        //Carregar as informações das listas 
        try {

            let response = await fetch(`http://localhost:3000/itemLista/lista/${idLista}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            let itensLista = await response.json()
            document.getElementById('itensLista').innerHTML = ''
            itensLista.forEach(item => {
                let itemCard = document.createElement('div');
                itemCard.classList.add('itemCard');
                itemCard.style.display = 'flex';

                const isChecked = item.concluido ? 'checked' : '';

                itemCard.innerHTML = `
           <input type="checkbox" ${isChecked} onclick="atualizarItemConcluido(${item.id}, this.checked)" id="concluido${item.id}">
        <p>${item.descricao}</p>
        <div class="acoes">
            <button class="deletar" onclick="deletarItem(${item.id})">Deletar</button>
        </div>
            `
            
                document.getElementById('itensLista').appendChild(itemCard);
            });
        } catch (e) {
            console.error("Erro ao carregar itens da lista", e)
        }
    }
    //Adicionando itens a lista, e carregando 
    const formAddItem = document.getElementById('formAddItem');
    formAddItem.addEventListener('submit', async (e) => {
        checarDados();
        e.preventDefault();
        const novoItem = formAddItem.novoItem.value;
        const usuarioId = usuario.id
        const listaId = parseInt(document.getElementById('idDaLista').value)
        console.log(novoItem, listaId, usuarioId)

        if (!novoItem){
            alert('Por favor, preencha a descrição do item')
            return;
        }
        else{

        try {
            let response = await fetch(`http://localhost:3000/itemLista`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ usuarioId, listaId, descricao: novoItem })
            });
            if (!response.ok) {
                throw new Error('Não foi possível adicionar o item.')
            }
            alert('Item Adicionado')
            window.location.reload()
        } catch (e) {
            console.error("Erro ao adicionar novo item", e)
        }}
    })

    const exibirItensClose = document.getElementById('exibirItensClose');
    exibirItensClose.addEventListener('click', () => {
        exibirItensModal.style.display = 'none';
    });

    // Exibir modal addLista
    addListaModal = document.getElementById('addListaModal');

    const btnExibirAddLista = document.getElementById('btnExibirAddLista');
    btnExibirAddLista.addEventListener('click', () => {
        addListaModal.style.display = 'block';
    });

    // Formulario de criar lista 
    const formAddLista = document.getElementById('formAddLista');
    formAddLista.addEventListener('submit', async (e) => {
        e.preventDefault()
        const titulo = formAddLista.novaLista.value
        const usuarioId = usuario.id

        if (!titulo){
            alert('Por favor, preencha o título da lista.')
            return;
        }
        else{
        try{
            let response = await fetch(`http://localhost:3000/lista`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ usuarioId, titulo })
            });
            if (!response.ok) {
                throw new Error('Não foi possível adicionar a lista.')
            }
            alert('Lista Adicionada')
            window.location.reload()
        } catch (e) {
            console.error("Erro ao adicionar nova lista", e)
        }
    }
    })


    const addListaClose = document.getElementById('addListaClose');
    addListaClose.addEventListener('click', () => {
        addListaModal.style.display = 'none';
    });

    const confirmListaClose = document.getElementById('confirmListaClose');
    confirmListaClose.addEventListener('click', () => {
        confirmModal.style.display = 'none';
    });




    //Fazer logoff e exibir nome do usuario
    const sair = document.getElementById("sair");

    sair.addEventListener("click", () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        localStorage.removeItem(usuario);

        window.location.href = "./login.html";
    });


    function preencherNome() {
        const nomeUsuario = document.getElementById("usuario")
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        nomeUsuario.innerHTML = `${usuario.nome}`
    }


    carregarListas()
    preencherNome()


});

const token = localStorage.getItem('token');

const confirmModal = document.getElementById('confirmModal');
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
    confirmModal.style.display = 'none';
});

const btnConfirm = document.getElementById("btnConfirm");
btnConfirm.addEventListener("click", () => {
    deletarLista();
});


function abrirModalDeletar(id){
    confirmModal.style.display = 'block';
    const listaId = document.getElementById("listaId");
    listaId.value = id;
    console.log(id);
}


//Deletar lista
async function deletarLista() {
    const listaId = document.getElementById("listaId").value;

    try {
        let response = await fetch(`http://localhost:3000/lista/${listaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status == 403) {
            window.location.href = "./login.html"
        }
        else if (!response.ok) {
            throw new Error('Falha ao deletar lista')
        }
        window.location.reload()
    } catch (e) {
        console.error('Erro ao deletar lista:', e)
    }
}

async function deletarItem(id) {
    try {
        let response = await fetch(`http://localhost:3000/itemLista/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status == 403) {
            window.location.href = "./login.html"
        }
        else if (!response.ok) {
            throw new Error('Falha ao deletar item')
        }
        alert('Item deletado')
        window.location.reload()

    } catch (e) {
        console.error('Erro ao deletar item:', e)

    }
}

async function atualizarItemConcluido(id, concluido) {
    try {
        const response = await fetch(`http://localhost:3000/itemLista/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ concluido }) // Certifique-se de que `concluido` é um booleano
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o status do item.');
        }
        let item = await response.json();
        console.log('Item atualizado com sucesso:', item);
    } catch (e) {
        console.error('Erro ao atualizar o item:', e);
    }
}
