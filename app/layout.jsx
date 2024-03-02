import GlobalContextProvider from 'contexts/ContextWrapper';
import Script from 'next/script';
import React from 'react';
import DefaultLayoutClientSide from 'layouts/DefaultLayout';

export const metadata = {
  title: 'Geppeta Board',
  description:
    'Engage in collaborative conversations with ChatGPT at our forum, where discussions organically branch out in a tree-like structure.',
  'google-adsense-account': 'ca-pub-9479755495142783'
};

export default function DefaultLayoutServerSide({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://kirillras.net"
          crossOrigin="true"
        />
        <link rel="preconnect" href="https://adservice.google.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="preconnect" href="https://www.googletagservices.com" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://accounts.google.com" />
        <meta name="google-adsense-account" content="ca-pub-9479755495142783" />
      </head>
      <body>
        <GlobalContextProvider>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9479755495142783"
            crossorigin="anonymous"
          />
          <DefaultLayoutClientSide>{children}</DefaultLayoutClientSide>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
