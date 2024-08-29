document.addEventListener('DOMContentLoaded', function() {
    const diasDoMes = document.getElementById('dias-do-mes');
    const diaSelecionado = document.getElementById('dia');
    const formLembrete = document.getElementById('form-lembrete');
    const dataLembreteInput = document.getElementById('data-lembrete');
    const textoLembreteInput = document.getElementById('texto-lembrete');
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
                    prepararModalDeletar(data, lembrete.texto);
                });
                divDia.appendChild(lembreteDiv);
            });
        }
    }

    function mostrarDetalhesDia(data) {
        const lembretesDia = lembretes[data] || [];
        diaSelecionado.innerHTML = `
            <h3>Detalhes de ${data}</h3>
            ${lembretesDia.map(l => `<div class="lembrete">${l.texto}</div>`).join('')}
        `;
    }

    function prepararModalDeletar(data, texto) {
        lembreteParaExcluir = { data, texto };
        lembreteDeleteTexto.textContent = texto;
        lembreteDeleteData.textContent = data;
        overlayDelete.classList.remove('hidden');
    }

    function excluirLembrete() {
        if (lembreteParaExcluir) {
            const { data, texto } = lembreteParaExcluir;
            lembretes[data] = lembretes[data].filter(l => l.texto !== texto);
            const diaDiv = diasDoMes.querySelector(`.dia[data-data="${data}"]`);
            if (diaDiv) {
                const lembretesDiv = diaDiv.querySelectorAll('.lembrete');
                lembretesDiv.forEach(l => {
                    if (l.textContent === texto) {
                        l.remove();
                    }
                });
            }
            mostrarDetalhesDia(data);
            lembreteParaExcluir = null;
        }
    }

    formLembrete.addEventListener('submit', function(event) {
        event.preventDefault();
        const data = dataLembreteInput.value;
        const texto = textoLembreteInput.value;

        if (!lembretes[data]) {
            lembretes[data] = [];
        }

        lembretes[data].push({ texto });

        // Atualiza o calendário com o novo lembrete
        const dias = diasDoMes.querySelectorAll('.dia');
        dias.forEach(dia => {
            if (dia.dataset.data === data) {
                const lembreteDiv = document.createElement('div');
                lembreteDiv.classList.add('lembrete');
                lembreteDiv.textContent = texto;
                lembreteDiv.addEventListener('click', (event) => {
                    event.stopPropagation();
                    prepararModalDeletar(data, texto);
                });
                dia.appendChild(lembreteDiv);
            }
        });

        mostrarDetalhesDia(data);
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

    confirmDeleteBtn.addEventListener('click', () => {
        excluirLembrete();
        overlayDelete.classList.add('hidden');
    });

    cancelDeleteBtn.addEventListener('click', () => {
        overlayDelete.classList.add('hidden');
    });

    // Inicializa o calendário com o mês e ano atuais
    gerarCalendario(anoAtual, mesAtual);
});
