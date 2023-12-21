const jwt = require('jsonwebtoken');
const secretKey = 'seu_segredo_jwt';

const authenticateToken = (req, res, next) => {

    if (req.path === '/usuarios' && req.method === 'POST' || req.path === '/') {
        return next();
    }

    if (req.path === '/' && req.method === 'GET') {
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
