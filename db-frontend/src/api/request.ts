import axios from 'axios';
import { message } from 'antd';
import type { Result } from '@/types';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
}

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const res = response.data as Result<unknown>;
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const data = error.response.data as Result<unknown> | undefined;
      const msg = data?.message || `服务器错误（${error.response.status}）`;
      message.error(msg);
      if (error.response.status === 401) {
        clearAuthStorage();
        window.location.replace('/login');
      }
    } else if (error.request) {
      message.error('网络连接失败，请确认后端服务已启动');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default request;
