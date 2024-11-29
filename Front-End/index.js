import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Alert } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'dashboard'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const balance = transactions.reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2);

  const handleAddTransaction = () => {
    if (description && amount) {
      setTransactions([...transactions, { id: Date.now().toString(), description, amount: parseFloat(amount) }]);
      setDescription('');
      setAmount('');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos para adicionar uma transação.');
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setCurrentScreen('dashboard');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos para fazer login.');
    }
  };

  const handleRegister = () => {
    if (username && email && password) {
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      setCurrentScreen('login');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos para se cadastrar.');
    }
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setUsername('');
    setEmail('');
    setPassword('');
    setTransactions([]);
  };

  if (currentScreen === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
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
          keyboardType="email-address"
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
        <Text style={styles.title}>Bem-vindo, {username || 'Usuário'}</Text>
        <Button title="Sair" onPress={handleLogout} />

        <Text style={styles.subtitle}>Adicionar Transação</Text>
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
        <Button title="Adicionar" onPress={handleAddTransaction} />

        <Text style={styles.subtitle}>Transações</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.transactionItem}>
              {item.description}: R${item.amount.toFixed(2)}
            </Text>
          )}
        />

        <Text style={styles.balance}>Saldo: R${balance}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  transactionItem: {
    padding: 10,
    backgroundColor: '#e9e9e9',
    marginBottom: 5,
    borderRadius: 5,
  },
  balance: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
