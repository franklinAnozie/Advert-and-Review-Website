import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import styles from '../style/LoginPage.module.css';
import Modal from '../components/AdminPanelModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_ROOT_URL}/token`, qs.stringify({
        username: email,
        password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/user');
      window.location.reload();
    } catch (error) {
      if (error.status === 401)
      {
        setMessage(error.response.data.detail);
        setIsModalOpen(true);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h1>User Login</h1>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
      {isModalOpen && <Modal message={message} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LoginPage;
