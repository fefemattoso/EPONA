
// Exemplo de função para realizar o login
async function realizarLogin(email, senha) {
  try {
      const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
      });

      if (!response.ok) throw new Error('Erro ao realizar login.');

      const usuario = await response.json();
      // Armazenar o usuarioId e o token no localStorage
      localStorage.setItem('usuario', JSON.stringify({ id: usuario.id, nome: usuario.nome, email: usuario.email }));
      localStorage.setItem('token', usuario.token);

      window.location.href = './index.html'
  } catch (error) {
      console.error('Erro no login:', error);
  }
}

// Chame esta função quando o usuário clicar no botão de login
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  realizarLogin(email, senha);
});
