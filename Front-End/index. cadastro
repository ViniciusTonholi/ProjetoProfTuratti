import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('register'); // 'register', 'dashboard'
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const categories = ['Farmácia', 'Delivery', 'Academia', 'Supermercado', 'Salário', 'Bar'];

  // Calcula o saldo total
  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0).toFixed(2);
  };

  // Adiciona ou edita transação
  const handleAddTransaction = () => {
    if (!description || !amount || !category) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (isEditing) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === editId ? { id: editId, description, amount: parseFloat(amount), category } : transaction
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setTransactions((prev) => [
        ...prev,
        { id: Date.now().toString(), description, amount: parseFloat(amount), category },
      ]);
    }

    setDescription('');
    setAmount('');
    setCategory('');
  };

  // Exclui transação
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  // Prepara transação para edição
  const handleEditTransaction = (id) => {
    const transaction = transactions.find((item) => item.id === id);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setIsEditing(true);
    setEditId(id);
  };

  if (currentScreen === 'register') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput style={styles.input} placeholder="Nome de usuário" />
        <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
        <Button title="Cadastrar" onPress={() => setCurrentScreen('dashboard')} />
      </View>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Controle Financeiro</Text>

        {/* Formulário de transações */}
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor (positivo para entrada, negativo para saída)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Categoria"
          value={category}
          onChangeText={setCategory}
        />
        <Button title={isEditing ? 'Salvar Alteração' : 'Adicionar'} onPress={handleAddTransaction} />

        {/* Lista de transações */}
        <Text style={styles.subtitle}>Transações</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text>{item.description} ({item.category}): R${item.amount.toFixed(2)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEditTransaction(item.id)}>
                  <Text style={styles.edit}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)}>
                  <Text style={styles.delete}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Saldo */}
        <Text style={styles.balance}>Saldo Total: R${calculateBalance()}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  transactionItem: {
    padding: 10,
    backgroundColor: '#e9e9e9',
    marginBottom: 5,
    borderRadius: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  edit: {
    color: 'blue',
    marginRight: 10,
  },
  delete: {
    color: 'red',
  },
  balance: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
