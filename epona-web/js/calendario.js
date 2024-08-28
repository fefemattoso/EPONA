// Definir constantes para os nomes dos meses
const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Obter data atual
let diaAtual = new Date();
let mesAtual = diaAtual.getMonth();
let anoAtual = diaAtual.getFullYear();

// Mostrar ano e mês atual ao iniciar a página
document.getElementById('ano').textContent = anoAtual;
document.getElementById('mes').textContent = nomesMeses[mesAtual];

// Função para gerar o calendário
function gerarCalendario(mes, ano) {
    const corpoCalendario = document.getElementById('dias-do-mes');
    corpoCalendario.innerHTML = ''; // Limpar o corpo do calendário
    const diasNoMes = obterDiasNoMes(mes, ano);
    const primeiraSemana = new Date(ano, mes, 1).getDay();
    
    // Criar dias do mês
    for (let i = 0; i < 42; i++) {
        const celula = document.createElement('div');
        if (i >= primeiraSemana && i < primeiraSemana + diasNoMes) {
            const dia = i - primeiraSemana + 1;
            celula.textContent = dia;
            celula.className = 'dia';
            celula.dataset.dia = dia;
            celula.dataset.mes = mes;
            celula.dataset.ano = ano;
            
            // Adicionar lembretes ao dia, se houver
            const lembretes = getLembretes(dia, mes, ano);
            lembretes.forEach(lembrete => {
                const lembreteElem = document.createElement('div');
                lembreteElem.textContent = lembrete;
                lembreteElem.className = 'lembrete';
                lembreteElem.onclick = () => {
                    if (confirm(`Deseja remover o lembrete: "${lembrete}"?`)) {
                        removerLembrete(dia, mes, ano, lembrete);
                        gerarCalendario(mes, ano); // Atualizar calendário
                    }
                };
                celula.appendChild(lembreteElem);
            });
            
            celula.onclick = () => mostrarDetalhesDia(dia, mes, ano);
        }
        corpoCalendario.appendChild(celula);
    }
}

// Função para obter o número de dias em um mês
function obterDiasNoMes(mes, ano) {
    return new Date(ano, mes + 1, 0).getDate();
}

// Função para mostrar detalhes do dia selecionado
function mostrarDetalhesDia(dia, mes, ano) {
    const diaSelecionado = document.getElementById('dia');
    diaSelecionado.innerHTML = `<h4>Dia ${dia}</h4><div id="lembretes-dia"></div>`;
    
    const lembretes = getLembretes(dia, mes, ano);
    lembretes.forEach(lembrete => {
        const lembreteElem = document.createElement('div');
        lembreteElem.textContent = lembrete;
        lembreteElem.className = 'lembrete';
        lembreteElem.onclick = () => {
            if (confirm(`Deseja remover o lembrete: "${lembrete}"?`)) {
                removerLembrete(dia, mes, ano, lembrete);
                mostrarDetalhesDia(dia, mes, ano); // Atualizar detalhes do dia
            }
        };
        document.getElementById('lembretes-dia').appendChild(lembreteElem);
    });
}

// Adicionar lembrete
document.getElementById('form-lembrete').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new Date(document.getElementById('data-lembrete').value);
    const dia = data.getUTCDate(); // Alterar para getUTCDate()
    const mes = data.getUTCMonth(); // Alterar para getUTCMonth()
    const ano = data.getUTCFullYear(); // Alterar para getUTCFullYear()
    const texto = document.getElementById('texto-lembrete').value;
    
    adicionarLembrete(dia, mes, ano, texto);
    gerarCalendario(mesAtual, anoAtual); // Atualizar calendário
    document.getElementById('form-lembrete').reset();
});

// Função para adicionar lembrete
function adicionarLembrete(dia, mes, ano, texto) {
    const lembretes = JSON.parse(localStorage.getItem('lembretes')) || {};
    const chave = `${ano}-${mes}-${dia}`;
    if (!lembretes[chave]) lembretes[chave] = [];
    lembretes[chave].push(texto);
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
}

// Função para obter lembretes
function getLembretes(dia, mes, ano) {
    const lembretes = JSON.parse(localStorage.getItem('lembretes')) || {};
    const chave = `${ano}-${mes}-${dia}`;
    return lembretes[chave] || [];
}

// Função para remover lembrete
function removerLembrete(dia, mes, ano, texto) {
    const lembretes = JSON.parse(localStorage.getItem('lembretes')) || {};
    const chave = `${ano}-${mes}-${dia}`;
    if (lembretes[chave]) {
        lembretes[chave] = lembretes[chave].filter(l => l !== texto);
        if (lembretes[chave].length === 0) delete lembretes[chave];
        localStorage.setItem('lembretes', JSON.stringify(lembretes));
    }
}

// Adicionar ouvintes de eventos aos botões de navegação
document.getElementById('antBtn').addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    document.getElementById('mes').textContent = nomesMeses[mesAtual];
    document.getElementById('ano').textContent = anoAtual;
    gerarCalendario(mesAtual, anoAtual);
});

document.getElementById('proxBtn').addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    document.getElementById('mes').textContent = nomesMeses[mesAtual];
    document.getElementById('ano').textContent = anoAtual;
    gerarCalendario(mesAtual, anoAtual);
});

// Gerar o calendário inicial
gerarCalendario(mesAtual, anoAtual);
