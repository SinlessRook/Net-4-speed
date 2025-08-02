import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // 🏰 your backend castle
  timeout: 10000,                         // optional: abort if server stalls
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`, // 🛡️ include token if available
  },
});

export default api;