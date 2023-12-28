function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Substitua a URL abaixo pelo seu endpoint de login
    const loginEndpoint = 'https://localhost:3000/login';

    // Configuração do cabeçalho para enviar Content-Type como "application/json"
    const headers = {
        'Content-Type': 'application/json',
    };

    // Realiza a chamada de login usando o Axios com o cabeçalho configurado
    axios.post(loginEndpoint, { email, senha }, { headers })
        .then(response => {
            // Exibe o resultado na página
            document.getElementById('result').innerHTML = `<p>Realizado com sucesso</p>`;
            document.getElementById("loginForm").reset();
        })
        .catch(error => {
            // Exibe mensagens de erro na página
            document.getElementById('result').innerHTML = `<p>Error: ${error.response.data.error}</p>`;
        });
}
