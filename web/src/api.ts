const API_BASE = 'https://shiny-yodel-5gxvp9qj9r9w2495q-8080.app.github.dev';

export async function login(clientId: string, secretKey: string) {
  console.log('=== Авторизация ===');
  console.log('Client ID:', clientId);
  
  // Исправлено: /api/login вместо /login
  const response = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, secret_key: secretKey }),
  });
  
  const data = await response.json();
  console.log('Ответ сервера:', response.status);
  
  if (!response.ok) {
    throw new Error('Неверные учетные данные');
  }
  
  console.log('Токен получен');
  return data.token;
}

export async function getProtectedPosts(token: string) {
  console.log('=== Запрос защищенного API ===');
  
  // Защищенные маршруты идут через /api/proxy
  const response = await fetch(`${API_BASE}/api/proxy/posts`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`Получено ${data.length} записей`);
  return data;
}
