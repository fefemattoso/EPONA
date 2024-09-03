// Fetch para usar login do banco de dados
async function login(email, senha) {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
  
      const data = await response.json();
  
      if (data.token) {
        // Store the JWT token in local storage
        localStorage.setItem('token', data.token);
  
        console.log('Login successful!');
        window.location.href = './index.html';
      } else {
        console.log('Login ou senha errados');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // Eventos do formulário para realizar o login
  const form = document.querySelector('form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Pega email e senha
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;
  
    await login(email , senha)
  });