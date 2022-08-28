import { Paper, Title, Container, Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { api } from '../../services/api';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';

export function Home() {
  const router = useRouter();

  const [token] = useLocalStorage({ key: 'token', defaultValue: '' });

  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);

      api
        .get('/api/chats', {
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
        Chats
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {isLoading ? (
          <h1>Carregando...</h1>
        ) : (
          chats.map((chat: any) => (
            <Card shadow="sm" p="lg" radius="md" mt={16} withBorder key={chat.id}>
              <Card.Section>
                <Text size="sm" color="dimmed" align="center" mt={16}>
                  {chat.name}
                </Text>
              </Card.Section>

              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  router.push(`/chats/${chat.id}`);
                }}
              >
                Abrir
              </Button>
            </Card>
          ))
        )}
      </Paper>
    </Container>
  );
}
