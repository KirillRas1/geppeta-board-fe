'use client';
import React, { createContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import LoginDialog from 'components/common/dataDisplay/modals/LoginModal';
import {
  apiClient,
  setTokenExpirationTimes
} from 'infrastructure/api/apiClient';
export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [displayName, setDisplayName] = useState('');
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  const signup = ({ username, password }) => {
    apiClient
      .post('auth/registration/', {
        username,
        password1: password,
        password2: password
      })
      .then(response => {
        setUserName(response.data.user.username);
      })
      .catch(() => {
        alert('Could not login, please login manually');
      });
  };

  const loginWithCredentials = ({ username, password }) => {
    apiClient
      .post('auth/login/', { username, password })
      .then(response => {
        apiClient.defaults.headers.common['Authorization'] = response.data
          .access
          ? `Bearer ${response.data.access}`
          : null;
        localStorage.setItem('displayName', response.data.user.name);
        localStorage.setItem('access', response.data.access);
        setDisplayName(response.data.user.name);
        setTokenExpirationTimes({
          accessExpirationTime: new Date(
            response.data.access_expiration
          ).getTime(),
          refreshExpirationTime: new Date(
            response.data.refresh_expiration
          ).getTime()
        });
        setLoginStatus(true);
      })
      .catch(e => {
        alert(`Failed to login: ${e}`);
      });
  };

  const login = jwtToken => {
    apiClient
      .post('token/', {
        jwt: jwtToken
      })
      .then(function (response) {
        apiClient.defaults.headers.common['Authorization'] = response.data
          .access
          ? `Bearer ${response.data.access}`
          : null;
        localStorage.setItem('displayName', response.data.user.name);
        setDisplayName(response.data.name);
        localStorage.setItem('user_id', response.data.id);
        setUserId(response.data.id);
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setTokenExpirationTimes();
        setLoginStatus(true);
      });
  };

  const logout = () => {
    //googleLogout();
    apiClient.post('auth/logout/').then(() => {
      localStorage.removeItem('displayName');
      localStorage.removeItem('user_id');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('accessTokenExpirationTime');
      localStorage.removeItem('refreshTokenExpirationTime');
      delete apiClient.defaults.headers.common['Authorization'];
      setDisplayName('');
      setUserId('');
      setLoginStatus(false);
    });
  };

  function loadUserInfo() {
    setDisplayName(localStorage.getItem('displayName'));
    setUserId(localStorage.getItem('user_id'));
  }
  useEffect(loadUserInfo, []);

  function loadAxiosInterceptors() {
    apiClient.interceptors.response.use(
      response => response,
      showAnonUserModal
    );
  }
  useEffect(loadAxiosInterceptors, [apiClient]);

  function showAnonUserModal(error) {
    const errorDetails = 'Authentication credentials were not provided.';
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.detail === errorDetails
    ) {
      window.localStorage.removeItem('displayName');
      setShowLoginModal(true);
      setDisplayName('');
      setUserId('');
    }
    return Promise.reject(error);
  }

  useEffect(() => {
    if (displayName) {
      setShowLoginModal(false);
    }
  }, [displayName]);

  const { Provider } = authContext;
  return (
    <Provider
      value={{
        login,
        loginStatus,
        logout,
        displayName,
        userId,
        setDisplayName,
        apiClient,
        loginWithCredentials
      }}
    >
      <LoginDialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      {children}
    </Provider>
  );
};
