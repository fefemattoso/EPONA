const form = document.getElementById('formCadastro')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
        if(form.senha.value == form.senhaconfirmada.value){
            const response = await cadastrarUsuario(form.email.value, form.nome.value, form.nascimento.value, form.senha.value)
            if(response == 201){
                alert('Usuário cadastrado com sucesso!')
                window.location.href = "./login.html"
            } else {
                alert('Ocorreu um erro ao cadastrar o usuário.')
                window.location.reload();
            }
        } else {
            alert('As senhas não conferem.')
        }
});

async function cadastrarUsuario(email, nome, nascimento, senha){

    const response = await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nome, nascimento, senha })
    });
    return response.status;
}