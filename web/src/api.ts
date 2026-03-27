import { AuthRequest, AuthResponse, RegisterRequest, RegisterResponse, Post } from './types';

const API_BASE = import.meta.env.DEV ? '' : 'https://shiny-yodel-5gxvp9qj9r9w2495q-8080.app.github.dev';

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  console.log('=== Регистрация ===');
  console.log('Логин:', data.username);
  console.log('Запрос на:', `${API_BASE}/register`);
  
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const responseData = await response.json();
  console.log('Ответ сервера:', response.status, responseData);
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Ошибка регистрации');
  }
  
  return responseData;
}

export async function login(data: AuthRequest): Promise<AuthResponse> {
  console.log('=== Авторизация ===');
  console.log('Логин:', data.username);
  console.log('Запрос на:', `${API_BASE}/login`);
  
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const responseData = await response.json();
  console.log('Ответ сервера:', response.status);
  
  if (!response.ok) {
    throw new Error('Неверный логин или пароль');
  }
  
  console.log('Токен получен и сохранен');
  return responseData;
}

export async function getProtectedPosts(token: string): Promise<Post[]> {
  console.log('=== Запрос защищенного API ===');
  console.log('URL:', `${API_BASE}/api/posts`);
  console.log('Токен:', token.substring(0, 50) + '...');
  
  const response = await fetch(`${API_BASE}/api/posts`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      console.log('Токен недействителен');
      throw new Error('UNAUTHORIZED');
    }
    throw new Error(`Ошибка: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Ответ сервера:', response.status);
  console.log(`Получено ${data.length} записей`);
  return data;
}
