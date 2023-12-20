const express = require('express');
const { createUser, updateUser, deleteUser, getUsers } = require('../controllers/userController');
const router = express.Router();

// Rota de cadastro de usuário (sem autenticação)
router.post('/', createUser);

// Rota atualiza usuario (adicionada autenticação)
router.put('/:id', updateUser);

// Rota exclui usuario (adicionada autenticação)
router.delete('/:id', deleteUser);

// Rotas retorno usuários (adicionada autenticação)
router.get('/', getUsers);

module.exports = router;
