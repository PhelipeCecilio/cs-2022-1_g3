import {Container, Timeline, Title} from '@mantine/core';
import {api} from '../../services/api';
import {useLocalStorage} from '@mantine/hooks';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {showNotification} from '@mantine/notifications';

export function Mensagem() {

  const router = useRouter();

  const [token] = useLocalStorage({ key: 'token', defaultValue: '' });

  const [chats, setChats] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);

      api
        .get('/api/chats/', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);

          setChats(response.data);
        })
        .catch((err) => {
          console.log(err);

          showNotification({
            title: 'Erro',
            message: err.message,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token]);

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Chat Nome
      </Title>

      <Timeline>
        {isLoading ? (
          <h1>Carregando...</h1>
        ) : (

            <h1>Mensagem...</h1>
        )}
      </Timeline>
    </Container>
  );
}
