const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./src/middlewares/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const http2Express = require('http2-express-bridge');
const http2 = require('http2');

// Configuração do servidor HTTP/2
const options = {
    key: fs.readFileSync(path.resolve('./certs/server.key')),
    cert: fs.readFileSync(path.resolve('./certs/server.crt')),
    allowHTTP1: true,
};

const app = http2Express(express);
const port = 3000;
const server = http2.createSecureServer(options, app);

// Middlewares e configurações globais
app.use(bodyParser.json());
app.use(rateLimit({ windowMs: 1000, max: 10000, message: 'Limite de requisições excedido. Tente novamente mais tarde.' }));
app.use(authRoutes);

// Middleware para imprimir a versão do protocolo
app.use('/', (req, res, next) => {
    console.log(`Versão do Protocolo HTTP: ${req.httpVersion}`);
    next();
});

// Servir arquivos estáticos da pasta 'public'
app.use('/', express.static(path.join(__dirname, 'public')));

// Rotas protegidas com autenticação JWT (deve vir após as rotas de autenticação)
app.use(authenticateToken);

// Rotas
app.get('/', (req, res) => {
    res.send('Bem-vindo');
    console.log(`Versão do Protocolo HTTP: ${req.httpVersion}`);
});

// Rota de cadastro de usuário (sem autenticação)
app.use('/usuarios', userRoutes);

// Rotas de retorno de usuários (protegidas com autenticação JWT)
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

// Iniciar o servidor
server.listen(port, () => {
    console.log(`Servidor rodando em https://localhost:${port}`);
});