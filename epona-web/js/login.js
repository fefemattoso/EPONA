
// Exemplo de função para realizar o login
async function realizarLogin(email, senha) {
  try {
      const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
      });

      if (!response.ok){
        alert('Login ou senha inválidos');
        const senha = document.getElementById('senha').value = '';
      } else {
        const usuario = await response.json();
        // Armazenar o usuarioId e o token no localStorage
        localStorage.setItem('usuario', JSON.stringify({ id: usuario.id, nome: usuario.nome, email: usuario.email }));
        localStorage.setItem('token', usuario.token);
        window.location.href = './index.html'
      }

  } catch (error) {
      console.error('Erro no login:', error);
  }
}



document.getElementById('formLogin').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  realizarLogin(email, senha);
});
