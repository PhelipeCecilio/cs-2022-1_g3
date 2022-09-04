import { Paper, Title, Container, Card, Text, Button } from '@mantine/core';
import { useRouter } from 'next/router';

export function Chats(props: any) {
  const router = useRouter();
  const allChats = props.chats;

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Chats
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {allChats.map((chat: any) => (
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
                router.push(`/chats?id=${chat.id}`);
              }}
            >
              Abrir
            </Button>
          </Card>
        ))}
      </Paper>
    </Container>
  );
}
