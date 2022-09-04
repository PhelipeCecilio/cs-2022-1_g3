import {Button, Card, Container, Modal, Paper, Text, Title} from '@mantine/core';
import {useRouter} from 'next/router';
import {useState} from "react";
import {CreateChatModal} from "../CreateChatModal";


export function Chats(props: any) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
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
          <Card shadow="sm" p="lg" radius="md" mt={16} withBorder>
              <Modal
                  opened={opened}
                  onClose={() => setOpened(false)}
              >
                <CreateChatModal />
              </Modal>
              <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => setOpened(true)}
              >
                  Criar um novo Chat!
              </Button>
          </Card>
      </Paper>
    </Container>
  );
}
