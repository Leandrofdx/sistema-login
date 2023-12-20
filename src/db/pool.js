const { Pool } = require('pg');

const pool = new Pool({
    user: 'usuario',
    host: 'localhost',
    database: 'postgres',
    password: 'usuario',
    port: 5432,
    max: 20, // Ajuste o tamanho do pool conforme necessário
});

//console.log("Detalhes do Pool de Conexão:", pool.options);

module.exports = pool;