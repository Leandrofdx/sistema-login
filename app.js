const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./src/middlewares/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const http2Express = require('http2-express-bridge')
const http2 = require('http2')

const options = {
    key: fs.readFileSync(path.resolve('./certs/server.key')),
    cert: fs.readFileSync(path.resolve('./certs/server.crt')),
    allowHTTP1: true,
};

//const app = express();
const app = http2Express(express)
const port = 3000;

app.use(bodyParser.json());

// Configuração do rate limit (10 requisições por segundo)
const limiter = rateLimit({
    windowMs: 1000, // 1 segundo
    max: 10, // 10 requisições por segundo
    message: 'Limite de requisições excedido. Tente novamente mais tarde.',
});

// Aplica o rate limit a todas as rotas
app.use(limiter);

// Rota de autenticação
app.use(authRoutes);

// Rotas protegidas com autenticação JWT (deve vir após as rotas de autenticação)
app.use(authenticateToken);

// Rota de boas-vindas
app.get('/', (req, res) => {
    res.send('Bem-vindo');
    console.log(`Versão do Protocolo HTTP: ${req.httpVersion}`);
});

// Rota de cadastro de usuário (sem autenticação)
app.use('/usuarios', userRoutes);

// Rotas retorno usuários (protegida com autenticação JWT)
app.use('/usuarios', authenticateToken, userRoutes);

// Tratamento de erro para rotas inexistentes
app.use((req, res) => {
    res.status(404).send('Rota não encontrada!');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

const server = http2.createSecureServer(options, app)

app.server = server;

server.listen(port, () => {
    console.log(`Servidor rodando em https://localhost:${port}`);
});
