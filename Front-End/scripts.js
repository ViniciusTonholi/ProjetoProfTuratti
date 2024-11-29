document.addEventListener('DOMContentLoaded', () => {
    // Mostra a seção de login e oculta outras seções
    document.getElementById('show-login').addEventListener('click', () => {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
    });

    document.getElementById('show-register').addEventListener('click', () => {
        document.getElementById('register-section').style.display = 'block';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
    });

    // Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('user-name').innerText = data.username;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
        } else {
            alert('Erro ao fazer login.');
        }
    });

    // Cadastro
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        } else {
            alert('Erro ao cadastrar.');
        }
    });

    // Logout
    document.getElementById('logout').addEventListener('click', () => {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    });
});
