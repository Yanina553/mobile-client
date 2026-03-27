import React, { useState, useEffect } from 'react';
import { login, register, getProtectedPosts } from './api';
import { Post } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      loadPosts(savedToken);
    }
  }, []);

  const loadPosts = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await getProtectedPosts(authToken);
      setPosts(data);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        handleLogout();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({ username, password });
      alert('Регистрация успешна! Теперь войдите.');
      setIsRegisterMode(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Введите логин и пароль');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await login({ username, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      await loadPosts(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setToken('');
    setPosts([]);
    setUsername('');
    setPassword('');
    console.log('Пользователь вышел из системы');
  };

  if (loading && !isLoggedIn) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="app">
        <header className="header">
          <h1>Главная</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </header>

        <div className="welcome-card">
          <h2>Добро пожаловать!</h2>
          <p>Вы успешно авторизованы</p>
          <span className="token-badge">JWT токен активен</span>
        </div>

        <button className="refresh-btn" onClick={() => loadPosts(token)}>
          Обновить данные
        </button>

        <h3 className="section-title">Записи из API:</h3>
        
        {loading ? (
          <div className="loading-small">
            <div className="spinner-small"></div>
          </div>
        ) : (
          <div className="posts-list">
            {posts.slice(0, 10).map((post) => (
              <div key={post.id} className="post-card">
                <h4>{post.title}</h4>
                <p>{post.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="auth-container">
        <h1 className="auth-title">
          {isRegisterMode ? 'Регистрация' : 'Авторизация'}
        </h1>

        <input
          type="text"
          className="input"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          className="input"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {isRegisterMode && (
          <input
            type="password"
            className="input"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        )}

        {error && <div className="error-message">{error}</div>}

        <button
          className="auth-btn"
          onClick={isRegisterMode ? handleRegister : handleLogin}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : (isRegisterMode ? 'Зарегистрироваться' : 'Войти')}
        </button>

        <button
          className="switch-btn"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setError('');
          }}
          disabled={loading}
        >
          {isRegisterMode
            ? 'Уже есть аккаунт? Войти'
            : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
};

export default App;
