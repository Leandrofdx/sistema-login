const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const secretKey = 'seu_segredo_jwt';

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Consulta ao banco de dados para verificar as credenciais
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Verifica a senha usando bcrypt
            const passwordMatch = await bcrypt.compare(senha, user.senha);

            if (passwordMatch) {
                // Gera o token com expiração de 24 horas
                const token = jwt.sign({ email: user.email, nome: user.nome, id: user.id }, secretKey, { expiresIn: '24h' });

                res.json({ token });
            } else {
                res.status(401).json({ error: 'Credenciais inválidas' });
            }
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = { login };
