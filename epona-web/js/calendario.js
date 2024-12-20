    const sair = document.getElementById("sair");
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
    const userName = document.getElementById("usuario");
    const userOptions = document.getElementById("user-options");
    const closeBtn = document.querySelector(".close-btn");
    const darkModeIcon = document.getElementById("dark-mode-icon");
    const termsLink = document.getElementById('termos');
    const termsModal = document.getElementById('terms-modal');
    const closeModalTermos = document.querySelector('.close-modalTermos');


    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.classList.remove('hidden');
    });

    // Fechar o modal
    closeModalTermos.addEventListener('click', () => {
        termsModal.classList.add('hidden');
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            termsModal.classList.add('hidden');
        }
    });

    const moonIcon = "../images/moon.png"; // Caminho do ícone da lua
    const sunIcon = "../images/sun.png";
    // Mostrar o menu lateral
    userName.addEventListener("click", () => {
        userOptions.classList.add("active");
        userOptions.classList.remove("hidden");
    });
    // Fechar o menu lateral
    closeBtn.addEventListener("click", () => {
        userOptions.classList.add("hidden");
        userOptions.classList.remove("active");
    });

    darkModeIcon.addEventListener("click", () => {
        const isDarkMode = document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
        darkModeIcon.src = isDarkMode ? sunIcon : moonIcon; // Alterar o ícone
        darkModeIcon.alt = isDarkMode ? "Modo Claro" : "Modo Escuro";
    });

    // Carregar o estado do modo escuro e o ícone correspondente
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeIcon.src = sunIcon; // Ícone do sol para modo escuro
        darkModeIcon.alt = "Modo Claro";
    } else {
        darkModeIcon.src = moonIcon; // Ícone da lua para modo claro
        darkModeIcon.alt = "Modo Escuro";
    }


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
    }
}

const daysContainer = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

let currentDate = new Date();

function carregarCalendario() {
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
    fetchTodosEventos()
}



// Navegação entre meses
prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    carregarCalendario();
});

nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    carregarCalendario();
});

// Renderiza o calendário na inicialização
carregarCalendario();

//Relacionado aos modais

const modal = document.getElementById('modal');
const closeModalAdd = document.getElementById('close-modalAdd');
const eventForm = document.getElementById('event-form');

// Abrir o modal
let isoDate;
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
        selectedDate = e.target.dataset.date; // Ex: "2024-11-22"

        // Convertendo a data para o formato ISO (sem hora definida, será às 00:00:00)
        isoDate = new Date(selectedDate).toISOString();

        // Atualiza o título do modal
        document.getElementById('modal-title').textContent = `Adicionar Evento - ${selectedDate}`;

        // Remover a classe 'hidden' para mostrar o modal
        modal.classList.remove('hidden');
    }
});

// Fechar o modal

closeModalAdd.addEventListener('click', () => {
    modal.classList.add('hidden'); // Adiciona a classe 'hidden' para esconder o modal
});

// Enviar o formulário
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('event-title').value;
    const descricao = document.getElementById('event-description').value;
    const evento = { titulo, descricao, data: isoDate, usuarioId: usuario.id };
    await checarDados();

    try {
        await fetch(`http://localhost:3000/agenda`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(evento),
        });
        alert('Evento adicionado com sucesso!');
        window.location.reload();
    } catch (error) {
        console.error('Erro ao adicionar evento:', error);
    }
});

//Mostrar eventos
const eventsContainer = document.getElementById('events-container');

// Exibir eventos próximos
async function fetchEventosProximos() {
    await checarDados();
    const eventos = await fetch(`http://localhost:3000/agendas/proximos/${usuario.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    let evento = await eventos.json();

    eventsContainer.innerHTML = `<h3>Eventos mais próximos</h3>`;
    evento.forEach((evento) => {
        let ano = evento.data.split('-')[0]
        let mes = evento.data.split('-')[1]
        let dia = evento.data.split('-')[2].split('T')[0]
        eventsContainer.innerHTML += `
            <div class="event">
            <p>${dia}/${mes}/${ano}</p>
                <h4>${evento.titulo}</h4>
                <p>${evento.descricao}</p>
            </div>
        `;
    })
}

async function fetchTodosEventos() {
    await checarDados();
    // Fetch todos os eventos do usuário
    const eventos = await fetch(`http://localhost:3000/agendausuario/${usuario.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    let todosEventos = await eventos.json();

    // Obtém todos os elementos com a classe 'day'
    const diasCalendario = document.querySelectorAll('.day');
    let hoje = document.querySelector('.today');
    hoje.style.backgroundColor = "lightblue";
    todosEventos.forEach(evento => {
        // Extraímos a data do evento no formato 'YYYY-MM-DD'
        const eventoDia = evento.data.split('T')[0];
        
        // Iteramos sobre todos os dias do calendário
        diasCalendario.forEach(diaCalendario => {
            // Comparando a data do evento com o atributo data-date do dia
            if (diaCalendario.getAttribute('data-date') === eventoDia) {
                // Muda o fundo do dia para azul
                diaCalendario.style.backgroundColor = "lightgreen";
                diaCalendario.id = evento.id
                diaCalendario.classList.add('temEvento');
                
            }
        });
    });
}

//adicionar função de deletar e editar eventos
const modalEditarEvento = document.getElementById('modalEditarEvento');
const closeModalEvento = document.getElementById('close-modalEdit')

closeModalEvento.addEventListener('click', () => {
    modalEditarEvento.classList.add('hidden')
})

//detectar evento clicando na div com um evento marcado
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('temEvento')) {
        modal.classList.add('hidden');
        let dataDia = e.target.dataset.date
        let dia = dataDia.split('-')[2];
        let mes = dataDia.split('-')[1];
        let ano = dataDia.split('-')[0];
        let dataComFormato = dia + '/' + mes + '/' + ano;

        let idEvento = e.target.id

        modalEditEvento(idEvento)
        modalEditarEvento.classList.remove('hidden');

        let tituloModal = document.getElementById('modal-titleEdit')
        tituloModal.textContent = `Editar Evento - ${dataComFormato}`;
    }
})

async function modalEditEvento(id) {
    await checarDados();
    let titulo = document.getElementById('event-titleEdit');
    let descricao = document.getElementById('event-descriptionEdit')
    let idEvento = document.getElementById('idEvento')
    idEvento.value = id

    try {
        let response = await fetch(`http://localhost:3000/agenda/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (response.ok) {
            let dados = await response.json();
            titulo.value = dados.titulo;
            descricao.value = dados.descricao;

        }
    } catch (e) {
        console.error(e)
    }
}

let formEditEvento = document.getElementById('editEvent-form')
formEditEvento.addEventListener('submit', async (e) => {
    e.preventDefault();
    let titulo = document.getElementById('event-titleEdit').value
    let descricao = document.getElementById('event-descriptionEdit').value
    let idEvento = document.getElementById('idEvento').value

    try {
        let response = await fetch(`http://localhost:3000/agenda/${idEvento}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, descricao })
        });
        if (response.ok) {
            alert('Evento alterado com sucesso')
            window.location.reload()
        }
    } catch (e) {
        console.error(e)
    }
})

async function deletarEvento(){
    let id = document.getElementById('idEvento').value
    let confirma = confirm('Deseja mesmo deletar este evento?')
    if(confirma){
        try {
            let response = await fetch(`http://localhost:3000/agenda/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                alert('Evento deletado com sucesso')
                window.location.reload()
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        alert('Operação cancelada')
    }
}

sair.addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    localStorage.removeItem(usuario);

    window.location.href = "./login.html";
    });

const nomeUsuario = document.getElementById("usuario")

function preencherNome() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
        nomeUsuario.innerHTML = `${usuario.nome}`
}

preencherNome()

preencherNome();
checarDados();
fetchEventosProximos();
fetchTodosEventos()