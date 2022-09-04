import nookies from 'nookies';
import { Chats } from '../components/Chats';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { api } from '../services/api';
import { Button, Container } from '@mantine/core';
import Router from 'next/router';
import { IconLogout } from '@tabler/icons';

export default function HomePage(props: any) {
  function handleLogout() {
    nookies.destroy(null, 'token');

    Router.push('/login');
  }

  return (
    <>
      <Container fluid>
        <Button leftIcon={<IconLogout />} variant="subtle" onClick={handleLogout}>
          Sair
        </Button>
      </Container>
      <Chats chats={props.chats} />
      <ColorSchemeToggle />
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (token) {
    const response = await api.get('/api/chats', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const allChats = response.data;

    return { props: { chats: allChats } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }
}
