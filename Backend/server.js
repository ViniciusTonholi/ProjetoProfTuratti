const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
