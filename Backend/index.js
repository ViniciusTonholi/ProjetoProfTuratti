const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurar SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabelas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

  db.run(query, [username, email, password], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
    res.status(201).json({ id: this.lastID, username, email });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ id: row.id, username: row.username, email: row.email });
  });
});

app.post('/transactions', (req, res) => {
  const { userId, description, amount, type } = req.body;
  const query = `INSERT INTO transactions (userId, description, amount, type) VALUES (?, ?, ?, ?)`;

  db.run(query, [userId, description, amount, type], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao adicionar transação.' });
    }
    res.status(201).json({ id: this.lastID, description, amount, type });
  });
});

app.get('/transactions/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `SELECT * FROM transactions WHERE userId = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar transações.' });
    }
    res.json(rows);
  });
});

app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM transactions WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir transação.' });
    }
    res.json({ success: true });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
