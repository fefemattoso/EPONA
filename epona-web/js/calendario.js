// Pegar data atual
let diaAtual = new Date();
let mesAtual = diaAtual.getMonth();
let anoAtual = diaAtual.getFullYear();

// Mostrar ano e mês atual ao iniciar a página
document.getElementById('ano').textContent = anoAtual;
document.getElementById('mes').textContent = nomeMes(mesAtual);

// Pegando o nome dos meses
function nomeMes(mes) {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return meses[mes];
}

// Função para gerar o calendário
function gerarCalendario(mes, ano) {
  const corpoCalendario = document.getElementById('dia');
  const diasNoMes = obterDiasNoMes(mes, ano);
  let contadorDias = 1;
  let primeiraSemana = new Date(ano, mes, 1).getDay();
  
  // Limpar o corpo do calendário
  corpoCalendario.innerHTML = '';

  // Criar uma tabela para exibir os dias
  const tabela = document.createElement('table');
  tabela.innerHTML = '';

  // Criar os cabeçalhos da tabela
  const cabecalhos = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const linhaCabecalho = document.createElement('tr');
  cabecalhos.forEach((cabecalho) => {
    const th = document.createElement('th');
    th.textContent = cabecalho;
    linhaCabecalho.appendChild(th);
  });
  tabela.appendChild(linhaCabecalho);

  // Criar as linhas da tabela
  for (let i = 0; i < 6; i++) {
    const linha = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const celula = document.createElement('td');
      if (i === 0 && j < primeiraSemana) {
        // Adicionar células vazias para os dias antes do primeiro dia do mês
        celula.textContent = '';
      } else if (contadorDias <= diasNoMes) {
        celula.textContent = contadorDias;
        contadorDias++;
      } else {
        // Adicionar células vazias para os dias após o último dia do mês
        celula.textContent = '';
      }
      linha.appendChild(celula);
    }
    tabela.appendChild(linha);
  }

  // Adicionar a tabela ao corpo do calendário
  corpoCalendario.appendChild(tabela);
}

// Função para obter o número de dias em um mês
function obterDiasNoMes(mes, ano) {
  return new Date(ano, mes + 1, 0).getDate();
}

// Gerar o calendário inicial
gerarCalendario(mesAtual, anoAtual);

// Adicionar ouvintes de eventos aos botões de navegação
document.getElementById('antBtn').addEventListener('click', () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  document.getElementById('mes').textContent = nomeMes(mesAtual);
  document.getElementById('ano').textContent = anoAtual;
  gerarCalendario(mesAtual, anoAtual);
});

document.getElementById('proxBtn').addEventListener('click', () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  document.getElementById('mes').textContent = nomeMes(mesAtual);
  document.getElementById('ano').textContent = anoAtual;
  gerarCalendario(mesAtual, anoAtual);
});