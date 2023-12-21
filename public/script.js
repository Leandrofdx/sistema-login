// script.js
function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Substitua a URL abaixo pelo seu endpoint de login
    const loginEndpoint = 'https://localhost/login';

    // Realiza a chamada de login usando o Axios
    axios.post(loginEndpoint, { email, senha })
        .then(response => {
            // Exibe o resultado na página
            document.getElementById('result').innerHTML = `<p>${response.data.message}</p>`;
        })
        .catch(error => {
            // Exibe mensagens de erro na página
            document.getElementById('result').innerHTML = `<p>Error: ${error.response.data.message}</p>`;
        });
}
