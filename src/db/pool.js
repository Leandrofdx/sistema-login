const { Pool } = require('pg');

const pool = new Pool({
    user: 'usuario',
    host: 'localhost',
    database: 'postgres',
    password: 'usuario',
    port: 5432,
    max: 20, // Ajuste o tamanho do pool conforme necessário,
    idleTimeoutMillis: 30000, // Tempo máximo (em milissegundos) que uma conexão pode ficar inativa no pool
});

console.log("Detalhes do Pool de Conexão:", pool.options);

module.exports = pool;