const mysql = require('mysql');
const { promisify }= require('util');

const pool = mysql.createConnection({
  host     : 'localhost',
  user     : 'sqluser',
  password: 'password',
  database: 'sicaal_db'
});

pool.connect(function(err) {
  if (err) {
    console.error('Error al Conectar a la Base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado con la ID ' + pool.threadId);
});


// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;


 

 

