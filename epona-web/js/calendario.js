document.addEventListener('DOMContentLoaded', function () {
    const diasDoMes = document.getElementById('dias-do-mes');
    const diaSelecionado = document.getElementById('dia');
    const formLembrete = document.getElementById('form-lembrete');
    const dataLembreteInput = document.getElementById('data-lembrete');
    const textoLembreteInput = document.getElementById('texto-lembrete');
    const descricaoTextoInput = document.getElementById('descricao-texto');
    const anoSpan = document.getElementById('ano');
    const mesSpan = document.getElementById('mes');
    const antBtn = document.getElementById('antBtn');
    const proxBtn = document.getElementById('proxBtn');
    const overlayDelete = document.getElementById('overlay-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const lembreteDeleteTexto = document.getElementById('lembrete-delete-texto');
    const lembreteDeleteData = document.getElementById('lembrete-delete-data');

    // Modais de edição
    const overlayEdit = document.getElementById('overlay-edit');
    const formEditLembrete = document.getElementById('form-edit-lembrete');
    const editTextoLembreteInput = document.getElementById('edit-texto-lembrete');
    const editDescricaoTextoInput = document.getElementById('edit-descricao-texto');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const confirmEditbtn = document.getElementById('confirm-edit')

    let lembretes = {}; // Armazena lembretes por data
    let anoAtual = new Date().getFullYear();
    let mesAtual = new Date().getMonth(); // 0 = Janeiro, 1 = Fevereiro, etc.
    let lembreteParaExcluir = null; // Lembrete selecionado para exclusão
    let lembreteParaEditar = null; // Lembrete selecionado para edição

    function getUsuarioId() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return usuario ? usuario.id : null;
    }



    const API_URL = 'http://localhost:3000/agenda'; // URL da API

    //Essa função está dando erro e o calendario não abre se filtrar por id

    async function carregarLembretes() {
        const usuarioId = getUsuarioId();
        const token = localStorage.getItem('token');

        if (usuarioId == null) {
            window.location.href = "./login.html"
        } else {
            try {
                const response = await fetch(`${API_URL}usuario/${usuarioId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status == 403) {
                    window.location.href = "./login.html"
                } else if (!response.ok) throw new Error('Falha na resposta da API');
                const agendas = await response.json();
                lembretes = agendas.reduce((acc, lembrete) => {
                    const data = lembrete.data.split('T')[0]; // Formata data para yyyy-mm-dd
                    if (!acc[data]) acc[data] = [];
                    acc[data].push({ texto: lembrete.titulo, descricao: lembrete.descricao, id: lembrete.id });
                    return acc;
                }, {});
                gerarCalendario(anoAtual, mesAtual);
            } catch (error) {
                console.error('Erro ao carregar lembretes:', error);
            }
        }
    }

    async function salvarLembrete(data, texto, descricao) {
        const usuarioId = getUsuarioId();
        const token = localStorage.getItem('token')
        if (usuarioId == null) {
            window.location.href = "./login.html"
        } else {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        titulo: texto,
                        descricao: descricao,
                        data: new Date(data).toISOString(),
                        usuarioId: usuarioId
                    }),
                });
                if (response.status == 403) {
                    window.location.href = "./login.html"
                } else if (!response.ok) throw new Error('Falha ao salvar lembrete');

                const novoLembrete = await response.json();
                lembretes[data] = lembretes[data] || [];
                lembretes[data].push({ texto: novoLembrete.titulo, descricao: novoLembrete.descricao, id: novoLembrete.id });

                gerarCalendario(anoAtual, mesAtual);
            } catch (error) {
                console.error('Erro ao salvar lembrete:', error);
            }
        }
    }

    async function excluirLembreteAPI(id) {
        const usuarioId = getUsuarioId()
        const token = localStorage.getItem('token')

        if (usuarioId == null) {
            window.location.href = "./login.html"
        } else {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(response.status == 403){
                    window.location.href = "./login.html"
                } else if (!response.ok) throw new Error('Falha ao excluir lembrete');
            } catch (error) {
                console.error('Erro ao excluir lembrete:', error);
            }
        }
    }

    async function excluirLembrete() {
        if (lembreteParaExcluir) {
            const { data, id } = lembreteParaExcluir;
            await excluirLembreteAPI(id);
            lembretes[data] = (lembretes[data] || []).filter(l => l.id !== id);
            gerarCalendario(anoAtual, mesAtual);
            lembreteParaExcluir = null;
        }
    }

    function gerarCalendario(ano, mes) {
        diasDoMes.innerHTML = '';
        const primeiroDia = new Date(ano, mes, 1).getDay();
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();

        // Ajustar primeiroDia para o calendário começar na segunda-feira
        const ajusteDia = (primeiroDia === 0) ? 6 : primeiroDia - 1;

        for (let i = 0; i < ajusteDia; i++) {
            const vazio = document.createElement('div');
            diasDoMes.appendChild(vazio);
        }

        for (let i = 1; i <= diasNoMes; i++) {
            criarDia(i, `${ano}-${(mes + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`);
        }

        // Atualiza os detalhes do mês e ano
        mesSpan.textContent = new Date(ano, mes).toLocaleString('pt-BR', { month: 'long' });
        anoSpan.textContent = ano;
    }

    function criarDia(dia, data) {
        const divDia = document.createElement('div');
        divDia.classList.add('dia');
        divDia.textContent = dia;
        divDia.dataset.data = data;

        divDia.addEventListener('click', () => {
            dataLembreteInput.value = data;
            mostrarDetalhesDia(data);
        });

        diasDoMes.appendChild(divDia);

        if (lembretes[data]) {
            lembretes[data].forEach(lembrete => {
                const lembreteDiv = document.createElement('div');
                lembreteDiv.classList.add('lembrete');
                lembreteDiv.textContent = lembrete.texto;
                lembreteDiv.addEventListener('click', (event) => {
                    event.stopPropagation();
                    prepararModalDeletar(data, lembrete.texto, lembrete.id);
                });
                divDia.appendChild(lembreteDiv);
            });
        }
    }


    function mostrarDetalhesDia(data) {
        const lembretesDia = lembretes[data] || [];
        diaSelecionado.innerHTML = `
            <h3>Detalhes de ${data}</h3>
            ${lembretesDia.map(l => `
                <div class="lembrete">
                    <strong>${l.texto}</strong>
                    <p>${l.descricao}</p>
                    <button class="edit-btn" data-id="${l.id}" data-data="${data}">Editar</button>
                </div>
            `).join('')}
        `;
        adicionarEventosEditar();
    }

    function prepararModalDeletar(data, texto, id) {
        lembreteParaExcluir = { data, texto, id };
        lembreteDeleteTexto.textContent = texto;
        lembreteDeleteData.textContent = data;
        overlayDelete.classList.remove('hidden');
    }

    async function editarLembrete() {
        const usuarioId = getUsuarioId(); // Obtendo o usuarioId
        const token = localStorage.getItem('token')
        if (usuarioId == null) {
            window.location.href = "./login.html"
        } else {
            if (lembreteParaEditar) {
                const { id, data } = lembreteParaEditar;
                const texto = editTextoLembreteInput.value;
                const descricao = editDescricaoTextoInput.value;

                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            id,
                            titulo: texto,
                            descricao: descricao,
                            data: new Date(data).toISOString(),
                            usuarioId: usuarioId
                        }),
                    });
                    if (response.status == 403) {
                        window.location.href = "./login.html"
                    } else if (!response.ok) throw new Error('Falha ao atualizar lembrete');

                    const atualizado = await response.json();
                    lembretes[data] = (lembretes[data] || []).map(l => l.id === id ? { ...l, texto: atualizado.titulo, descricao: atualizado.descricao } : l);

                    gerarCalendario(anoAtual, mesAtual);
                    overlayEdit.classList.add('hidden');
                    lembreteParaEditar = null;
                } catch (error) {
                    console.error('Erro ao atualizar lembrete:', error);
                }

            }
        }
    }

    function adicionarEventosEditar() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                const data = event.target.dataset.data;

                if (lembretes[data]) {

                    const lembrete = lembretes[data].find(l => String(l.id) === String(id));

                    overlayEdit.classList.remove('hidden');
                    if (lembrete) {
                        lembreteParaEditar = { ...lembrete, data };
                        editTextoLembreteInput.value = lembrete.texto;
                        editDescricaoTextoInput.value = lembrete.descricao;
                    }
                }
            });
        });
    }





    formLembrete.addEventListener('submit', async function (event) {
        event.preventDefault();
        const data = dataLembreteInput.value;
        const texto = textoLembreteInput.value;
        const descricao = descricaoTextoInput.value;

        await salvarLembrete(data, texto, descricao);
        formLembrete.reset();
    });

    antBtn.addEventListener('click', function () {
        if (mesAtual === 0) {
            mesAtual = 11;
            anoAtual--;
        } else {
            mesAtual--;
        }
        gerarCalendario(anoAtual, mesAtual);
    });

    proxBtn.addEventListener('click', function () {
        if (mesAtual === 11) {
            mesAtual = 0;
            anoAtual++;
        } else {
            mesAtual++;
        }
        gerarCalendario(anoAtual, mesAtual);
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        await excluirLembrete();
        overlayDelete.classList.add('hidden');
    });

    formEditLembrete.addEventListener('submit', async () => {
        await editarLembrete();
        overlayEdit.classList.add('hidden');
    })

    cancelDeleteBtn.addEventListener('click', () => {
        overlayDelete.classList.add('hidden');
    });

    cancelEditBtn.addEventListener('click', () => {
        overlayEdit.classList.add('hidden');
    });


    carregarLembretes();

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