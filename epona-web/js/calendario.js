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

const daysContainer = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Atualiza o cabeçalho do calendário
    monthYear.textContent = new Date(year, month).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });

    // Obtém o primeiro dia do mês e a quantidade de dias no mês
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Limpa os dias anteriores
    daysContainer.innerHTML = '';

    // Adiciona espaços em branco para os dias antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        daysContainer.appendChild(emptyDiv);
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
    
        // Adiciona a classe "day" para identificar os dias
        dayDiv.classList.add('day');
    
        // Marca o dia atual
        if (
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
        ) {
            dayDiv.classList.add('today');
        }

        // Adiciona o atributo data-date com o formato "YYYY-MM-DD"
        const dayString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dayDiv.setAttribute('data-date', dayString);

        daysContainer.appendChild(dayDiv);
    }
}

    

// Navegação entre meses
prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Renderiza o calendário na inicialização
renderCalendar();

//Detectar o dia clicado
document.addEventListener('click', (e) => {
    // Verifica se o elemento clicado tem a classe "day"
    if (e.target.classList.contains('day')) {
        console.log(`Dia clicado: ${e.target.textContent}`);
    }
});

//Relacionado aos modais

const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const eventForm = document.getElementById('event-form');
let selectedDate = null; // Para rastrear o dia clicado

// Abrir o modal
let isoDate;  // Declaração global da isoDate, para que possa ser acessada em qualquer lugar do código
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
        selectedDate = e.target.dataset.date; // Ex: "2024-11-22"
        
        // Convertendo a data para o formato ISO (sem hora definida, será às 00:00:00)
        isoDate = new Date(selectedDate).toISOString();

        // Exibe a data no console (no formato ISO)
        console.log('Data ISO:', isoDate);

        // Atualiza o título do modal
        document.getElementById('modal-title').textContent = `Adicionar Evento - ${selectedDate}`;
        
        // Remover a classe 'hidden' para mostrar o modal
        modal.classList.remove('hidden');
    }
});

// Fechar o modal

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden'); // Adiciona a classe 'hidden' para esconder o modal
});

// Enviar o formulário
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('event-title').value;
    const descricao = document.getElementById('event-description').value;

    if (!isoDate) {
        alert('Por favor, selecione uma data para o evento.');
        return;
    }

    const evento = { titulo, descricao, data: isoDate, usuarioId: usuario.id };

    try {
        await fetch(`http://localhost:3000/agenda`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evento),
        });
        alert('Evento adicionado com sucesso!');
        modal.classList.add('hidden');
        renderCalendar(); // Recarregar o calendário
    } catch (error) {
        console.error('Erro ao adicionar evento:', error);
    }
});

//Mostrar eventos
const eventsContainer = document.getElementById('events-container');

// Buscar e exibir eventos
async function fetchEvents() {
    let usuarioId = usuario.id
    console.log(usuarioId)
    const response = await fetch(`http://localhost:3000/agendausuario/${usuarioId}`);
    return await response.json();
}

// Exibir eventos próximos
async function displayUpcomingEvents() {
    const eventos = await fetchEvents('http://localhost:3000/agenda/proximos');
    renderEvents(eventos, 'Eventos Próximos');
}

// Exibir eventos de uma data específica
async function displayEventsForDate(date) {
    const eventos = await fetchEvents(`/agenda/by-date?usuarioId=${usuario.id}&data=${date}`);
    renderEvents(eventos, `Eventos de ${date}`);
}

// Renderizar eventos
function renderEvents(eventos, title) {
    eventsContainer.innerHTML = `<h3>${title}</h3>`;
    eventos.forEach((evento) => {
        eventsContainer.innerHTML += `
            <div class="event">
                <h4>${evento.titulo}</h4>
                <p>${evento.descricao}</p>
                <p>${new Date(evento.data).toLocaleDateString()}</p>
            </div>
        `;
    });
}

// Inicialização
displayUpcomingEvents();


function preencherNome() {  
    const nomeUsuario = document.getElementById("usuario");  
    const usuario = JSON.parse(localStorage.getItem('usuario'));  
    nomeUsuario.innerHTML = `${usuario.nome}`;  
}

preencherNome();  