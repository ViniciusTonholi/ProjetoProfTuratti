import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';

const API_URL = 'http://192.168.1.206:3000'; // Substitua pelo IP do backend

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'dashboard'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(''); // 'income' or 'expense'
  const [userId, setUserId] = useState(null);
  const [isLoggingOff, setIsLoggingOff] = useState(false); // Evitar múltiplos cliques no logoff

  // Carregar transações do backend quando o usuário estiver logado
  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId]);

  // Função para login
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Erro no login');
      const data = await response.json();
      setUserId(data.id);
      setCurrentScreen('dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas.');
    }
  };

  // Função para registro
  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error('Erro no registro');
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');
      setCurrentScreen('login');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao realizar o cadastro.');
    }
  };

  // Buscar transações para um usuário
  const fetchTransactions = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as transações.');
    }
  };

  // Adicionar uma transação
  const handleAddTransaction = async () => {
    if (!description.trim() || !amount || !type) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Erro', 'Digite um valor válido para a transação.');
      return;
    }

    try {
      await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          description: description.trim(),
          amount: parseFloat(amount),
          type,
        }),
      });
      fetchTransactions(userId);
      setDescription('');
      setAmount('');
      setType('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar transação.');
    }
  };

  // Excluir uma transação
  const handleDeleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions(userId);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir transação.');
    }
  };

  // Função para logoff
  const handleLogoff = () => {
    if (isLoggingOff) return; // Prevenir múltiplos cliques
    setIsLoggingOff(true);

    setTimeout(() => {
      setUserId(null);
      setTransactions([]);
      setEmail('');
      setPassword('');
      setDescription('');
      setAmount('');
      setType('');
      setIsLoggingOff(false);
      setCurrentScreen('login');
    }, 300); // Evita que múltiplos cliques causem problemas
  };

  // Calcular totais de ganhos e gastos
  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += parseFloat(t.amount);
      } else if (t.type === 'expense') {
        totalExpenses += parseFloat(t.amount);
      }
    });

    return { totalIncome, totalExpenses };
  };

  const { totalIncome, totalExpenses } = calculateTotals();

  // Renderização das telas
  if (currentScreen === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Entrar" onPress={handleLogin} />
        <Button title="Cadastrar" onPress={() => setCurrentScreen('register')} />
      </View>
    );
  }

  if (currentScreen === 'register') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Cadastrar" onPress={handleRegister} />
        <Button title="Voltar" onPress={() => setCurrentScreen('login')} />
      </View>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoffButton} onPress={handleLogoff}>
          <Text style={styles.logoffButtonText}>Logoff</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Dashboard</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
            onPress={() => setType('income')}
          >
            <Text style={styles.typeButtonText}>Ganho (C)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={styles.typeButtonText}>Gasto (D)</Text>
          </TouchableOpacity>
        </View>
        <Button title="Adicionar Transação" onPress={handleAddTransaction} />

        <Text style={styles.totals}>Total de Ganhos: R${totalIncome.toFixed(2)}</Text>
        <Text style={styles.totals}>Total de Gastos: R${totalExpenses.toFixed(2)}</Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text>
                {item.description} ({item.type === 'income' ? 'C' : 'D'}): R${item.amount.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteTransaction(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }

  return null;
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoffButton: {
    position: 'absolute',
    top: 25,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 3,
  },
  logoffButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#cccccc',
  },
  typeButtonActive: {
    backgroundColor: '#007BFF',
  },
  typeButtonText: {
    color: '#333', // Cinza escuro
    fontWeight: 'bold',
  },
  totals: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  transactionItem: {
    padding: 10,
    backgroundColor: '#eee',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
});
