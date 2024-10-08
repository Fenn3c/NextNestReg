import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'



interface Props {
  login: string,
  email: string
}

export default function Home({ login, email }: Props) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Главная страница</h1>
      <p>
        Добро пожаловать, {login}
      </p>
      <p>
        Ваша почта: {email}
      </p>

    </>
  )


}

export const getServerSideProps: GetServerSideProps<Props | {}> = async (context: GetServerSidePropsContext) => {
  try {
    return {
      props: {
        login: 'Test',
        email: 'test@mial.ri'
      }
    }
  } catch (e) {
    context.res.setHeader('Location', '/signin');
    context.res.statusCode = 302
    return {
      props: {}
    }
  }

}