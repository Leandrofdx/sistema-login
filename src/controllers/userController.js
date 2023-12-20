const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const secretKey = 'seu_segredo_jwt';

const createUser = async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;

        // Verifica se o usuário já existe pelo email
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'O usuário com este email já está cadastrado.' });
        }

        // Criptografa a senha antes de armazenar no banco de dados
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Insere o novo usuário no banco de dados, excluindo a senha do resultado
        const result = await pool.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email', [nome, email, hashedPassword]);

        // Remove a senha do resultado antes de retornar
        const userWithoutPassword = { id: result.rows[0].id, nome: result.rows[0].nome, email: result.rows[0].email };

        res.json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;

        // Atualiza o usuário no banco de dados
        const result = await pool.query('UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email', [nome, email, id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        next(error);
    }
};


const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Exclui o usuário do banco de dados
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        } else {
            res.status(204).send();  // Retorna uma resposta vazia com status 204 (No Content)
        }
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        // Seleciona apenas as colunas desejadas, excluindo a senha
        const result = await pool.query('SELECT id, nome, email FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

module.exports = { createUser, updateUser, deleteUser, getUsers };
