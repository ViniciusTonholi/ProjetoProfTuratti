let transactions = []; // Simulação de banco de dados

exports.addTransaction = (req, res) => {
    const { description, amount } = req.body;
    const transaction = {
        id: transactions.length + 1,
        description,
        amount,
        date: new Date()
    };
    transactions.push(transaction);
    res.status(201).json(transaction);
};

exports.getTransactions = (req, res) => {
    res.status(200).json(transactions);
};

exports.deleteTransaction = (req, res) => {
    const { id } = req.params;
    transactions = transactions.filter(transaction => transaction.id !== parseInt(id));
    res.status(204).send();
};
