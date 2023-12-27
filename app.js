const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const http2 = require('http2');
const http2Express = require('http2-express-bridge');
const path = require('path');
const rateLimit = require('express-rate-limit');
const glob = require('glob');
const mime = require('mime');
const compression = require('compression');
const sharp = require('sharp');

// Importar módulos locais
const { authenticateToken } = require('./src/middlewares/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Configuração do servidor HTTP/2
const options = {
    key: fs.readFileSync(path.resolve('./certs/server.key')),
    cert: fs.readFileSync(path.resolve('./certs/server.crt')),
    allowHTTP1: true,
};

const app = http2Express(express);
const port = 3000;
const server = http2.createSecureServer(options, app);

// Middleware global para imprimir a versão do protocolo
app.use((req, res, next) => {
    console.log(`Versão do Protocolo HTTP: ${req.httpVersion}`);
    next();
});

// Middlewares e configurações globais
app.use(bodyParser.json());
app.use(rateLimit({ 
    windowMs: 1000, 
    max: 10000, 
    message: 'Limite de requisições excedido. Tente novamente mais tarde.' 
}));

// Compressão de resposta (com verificação para HTTP/2)
app.use((req, res, next) => {
    if (req.httpVersion !== '2.0') {
        compression()(req, res, next);
    } else {
        next();
    }
});

// Servir arquivos estáticos da pasta 'public' usando HTTP/2
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31536000 })); // Cache de recursos estáticos por 1 ano

app.use(authRoutes);

// Rotas protegidas com autenticação JWT (deve vir após as rotas de autenticação)
app.use(authenticateToken);

// Rota de boas-vindas
app.get('/', (req, res) => {
    pushStaticResourcesDynamic(res, 'styles'); // Empurrar arquivos CSS
    pushStaticResourcesDynamic(res, 'scripts'); // Empurrar arquivos JavaScript
    res.send('Bem-vindo');
});

// Rotas de usuário (protegidas com autenticação JWT)
app.use('/usuarios', userRoutes);

// Função para empurrar arquivos estáticos de um diretório
function pushStaticResourcesDynamic(res, folder) {
    const files = glob.sync(`./public/${folder}/*.*`);
    files.forEach(file => {
        const relativePath = path.relative(path.join(__dirname, 'public'), file);
        const contentType = mime.getType(file) || 'application/octet-stream';
        res.push(`/${relativePath}`, {
            request: { accept: '*/*' },
            response: { 'content-type': contentType },
        }).end(fs.readFileSync(file));
    });
}

// Iniciar o servidor
server.listen(port, () => {
    console.log(`Servidor rodando em https://localhost:${port}`);
});