import React from 'react';
import LoginPage from './login/page';
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Marong-login</title>
      </Head>
      <main>
        <LoginPage />
      </main>
    </>
  );
}