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

const divPontuacao = document.getElementById('ranking')

// Função para carregar o ranking
async function carregarRanking() {
    try{
        let response = await fetch('http://localhost:3000/ranking', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        let ranking = await response.json();
        ranking.forEach(usuario => {
            let div = document.createElement('div')
            div.className = 'pessoa';
            div.innerHTML = `<h2>${usuario.nome}</h2><p>Pontuação: ${usuario.pontuacao}`

            divPontuacao.appendChild(div)
        })


    } catch (e) {
        console.error('Erro ao carregar ranking:', e)
    }
}

function preencherNome() {
    const nomeUsuario = document.getElementById("usuario")
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    nomeUsuario.innerHTML = `${usuario.nome}`
}

preencherNome();
carregarRanking();