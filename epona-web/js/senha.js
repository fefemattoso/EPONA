const form = document.getElementById('trocarSenha')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if(form.senha.value == form.senhaconfirmada.value){
        const response = await trocarSenha(form.email.value, form.senha.value);
        if(response == 202) {
            alert('Senha alterada com sucesso!')
            window.location.href = "./login.html"
        } else {
            alert('Conta não registrada')
        } 
    } else {
        alert('As senhas não conferem.')
    }
} );
async function trocarSenha(email, senha){
    try{
        const response = await fetch(`http://localhost:3000/senha`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, senha })
        });
        return response.status;
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('voltar').addEventListener('click', (e) =>{
    e.preventDefault()
    window.location.href = "./login.html"
})