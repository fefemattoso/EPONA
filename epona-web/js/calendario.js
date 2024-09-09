document.addEventListener('DOMContentLoaded', function() {
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

    let lembretes = {}; // Armazena lembretes por data
    let anoAtual = new Date().getFullYear();
    let mesAtual = new Date().getMonth(); // 0 = Janeiro, 1 = Fevereiro, etc.
    let lembreteParaExcluir = null; // Lembrete selecionado para exclusão

    const API_URL = 'http://localhost:3000/agenda'; // URL da API

    async function carregarLembretes() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Falha na resposta da API');
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

    async function salvarLembrete(data, texto, descricao) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo: texto,
                    descricao: descricao,
                    data: new Date(data).toISOString(), // Formata data para ISO 8601
                    usuarioId: 1 // Substitua com o ID do usuário apropriado
                }),
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar lembrete');
            }

            const novoLembrete = await response.json();
            lembretes[data] = lembretes[data] || [];
            lembretes[data].push({ texto: novoLembrete.titulo, descricao: novoLembrete.descricao, id: novoLembrete.id });

            console.log('Lembrete salvo com sucesso:', novoLembrete);

            gerarCalendario(anoAtual, mesAtual);
        } catch (error) {
            console.error('Erro ao salvar lembrete:', error);
        }
    }

    async function excluirLembreteAPI(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao excluir lembrete');
        } catch (error) {
            console.error('Erro ao excluir lembrete:', error);
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
        divDia.addEventListener('click', () => mostrarDetalhesDia(data));
        diasDoMes.appendChild(divDia);

        if (lembretes[data]) {
            lembretes[data].forEach(lembrete => {
                const lembreteDiv = document.createElement('div');
                lembreteDiv.classList.add('lembrete');
                lembreteDiv.textContent = lembrete.texto;
                lembreteDiv.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede que o clique no lembrete abra o modal do dia
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
                </div>
            `).join('')}
        `;
    }

    function prepararModalDeletar(data, texto, id) {
        lembreteParaExcluir = { data, texto, id };
        lembreteDeleteTexto.textContent = texto;
        lembreteDeleteData.textContent = data;
        overlayDelete.classList.remove('hidden');
    }

    async function excluirLembrete() {
        if (lembreteParaExcluir) {
            const { data, texto, id } = lembreteParaExcluir;
            delete lembretes[data];
            await excluirLembreteAPI(id);
            gerarCalendario(anoAtual, mesAtual);
            lembreteParaExcluir = null;
        }
    }

    formLembrete.addEventListener('submit', async function(event) {
        event.preventDefault();
        const data = dataLembreteInput.value;
        const texto = textoLembreteInput.value;
        const descricao = descricaoTextoInput.value;

        await salvarLembrete(data, texto, descricao);
        formLembrete.reset();
    });

    antBtn.addEventListener('click', function() {
        if (mesAtual === 0) {
            mesAtual = 11;
            anoAtual--;
        } else {
            mesAtual--;
        }
        gerarCalendario(anoAtual, mesAtual);
    });

    proxBtn.addEventListener('click', function() {
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

    cancelDeleteBtn.addEventListener('click', () => {
        overlayDelete.classList.add('hidden');
    });

    // Inicializa o calendário com o mês e ano atuais
    carregarLembretes();
});
