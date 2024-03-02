'use client';
import {
  GoogleLogin,
  googleLogout,
  useGoogleOneTapLogin,
  useGoogleLogin
} from '@react-oauth/google';
import React, { useContext, useState } from 'react';
import { Box, Button } from '@mui/material';
import { authContext } from 'contexts/Auth';
import SignUpButton from 'components/auth/Signup';
import LoginModal from './auth/Login';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';
import apiClient from 'infrastructure/api/apiClient';
export default function GoogleLoginButton() {
  const { login, logout, displayName } = useContext(authContext);

  const responseMessage = responseFromGoogle => {
    console.log(responseFromGoogle);
    login(responseFromGoogle.credential);
    apiClient.post('auth/google/', {
      access_token: responseFromGoogle.credential
    });
  };

  const authCodeLogin = useGoogleLogin({
    onSuccess: async codeResponse => {
      await apiClient.post('auth/google/', { code: codeResponse.code });
    },
    flow: 'auth-code'
  });

  return (
    <div>
      {!displayName ? (
        <Box display="flex" flexDirection="row" gap="5px" alignItems="center">
          <LoginModal />
          <SignUpButton />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => authCodeLogin()}
          >
            Google
          </Button>
          <GoogleLogin onSuccess={responseMessage} />
        </Box>
      ) : (
        <Button variant="contained" color="secondary" onClick={logout}>
          Logout
        </Button>
      )}
    </div>
  );
}
