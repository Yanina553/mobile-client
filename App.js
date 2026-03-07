import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

// ⚠️ ЭТОТ URL НУЖНО БУДЕТ ЗАМЕНИТЬ НА ВАШ СЕРВЕР ИЗ ЛР №1
const SERVER_URL = 'https://ваш-сервер-8080.app.github.dev';

export default function App() {
  const [clientId, setClientId] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleLogin = async () => {
    if (!clientId || !secretKey) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/login`, {
        client_id: clientId,
        secret_key: secretKey
      });
      
      if (response.data.token) {
        Alert.alert('Успех', 'Токен получен!');
      }
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JWT Авторизация</Text>
      
      <Text>Client ID:</Text>
      <TextInput
        style={styles.input}
        value={clientId}
        onChangeText={setClientId}
        placeholder="client2"
      />
      
      <Text>Secret Key:</Text>
      <TextInput
        style={styles.input}
        value={secretKey}
        onChangeText={setSecretKey}
        secureTextEntry
        placeholder="secret-key-2"
      />
      
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
