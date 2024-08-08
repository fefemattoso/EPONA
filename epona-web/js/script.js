// script.js

// Sistema de Login Simples
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "usuario" && password === "senha") {
        window.location.href = 'index.html';
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
}

// Lista de Tarefas e Pontuação
let points = 0;

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value;
    if (taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        const doneButton = document.createElement('button');
        doneButton.textContent = "✔️";
        doneButton.onclick = function() {
            listItem.classList.add('completed');
            points += 10;
            updatePoints();
        };

        listItem.appendChild(doneButton);
        document.getElementById('taskList').appendChild(listItem);
        input.value = '';
    }
}

function updatePoints() {
    document.getElementById('points').textContent = points;
}

// Personalização do Tema
function changeThemeColor() {
    const color = document.getElementById('themeColor').value;
    document.documentElement.style.setProperty('--theme-color', color);
}

// Aplicação da cor ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const color = document.getElementById('themeColor').value;
    document.documentElement.style.setProperty('--theme-color', color);
});
