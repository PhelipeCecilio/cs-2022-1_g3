import { Paper, Title, Container, Card, Text, Anchor } from '@mantine/core';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

function Chat(props: any) {
  const router = useRouter();

  const chatId = router.query.id;

  const [chat, setChat] = useState<any>(null);

  const [loading, setLoading] = useState<any>(true);

  useEffect(() => {
    if (!chatId) {
      router.push('/');
    }

    const cookies = parseCookies();
    const token = cookies.token;

    setLoading(true);

    api
      .get(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setChat(response.data);
      })
      .catch((error) => {
        console.log(error);
        setChat(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [chatId]);

  return (
    <Container size={420} my={40}>
      <Anchor
        href="/"
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Voltar ao início
      </Anchor>

      {loading ? null : (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title
            align="center"
            sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          >
            {loading ? 'Buscando chat...' : chat?.name}
          </Title>

          {chat.messages.length === 0 && (
            <Text size="sm" color="dimmed" align="center" mt={16}>
              Esse chat ainda não tem mensagens.
            </Text>
          )}

          {chat.messages.map((message: any) => {
            return (
              <Card key={message.id} shadow="sm" p="lg" radius="md" mt={16} withBorder>
                <Card.Section>
                  <Text size="sm" color="dimmed" align="center" mt={16}>
                    {message.text}
                  </Text>
                </Card.Section>
              </Card>
            );
          })}
        </Paper>
      )}
    </Container>
  );
}

export default Chat;
