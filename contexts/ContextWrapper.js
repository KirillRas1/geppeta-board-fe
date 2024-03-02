'use client';
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from 'contexts/Auth';

export default function GlobalContextProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
