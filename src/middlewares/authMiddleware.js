const jwt = require('jsonwebtoken');
const secretKey = 'seu_segredo_jwt';

const authenticateToken = (req, res, next) => {
    // Excluir a verificação do token para a rota de criação de usuários
    if (req.path === '/usuarios' && req.method === 'POST') {
        return next();
    }

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
