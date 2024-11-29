const users = []; // Simulação de banco de dados

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Usuário já existe' });
    }
    users.push({ username, email, password });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    res.status(200).json({ message: 'Login bem-sucedido', username: user.username });
};
