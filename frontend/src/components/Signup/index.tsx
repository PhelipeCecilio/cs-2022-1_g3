import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { api } from '../../services/api';
import { showNotification } from '@mantine/notifications';
import {useRouter} from "next/router";

export function Signup() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Cadastre-se!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Tem uma conta?{' '}
        <Anchor<'a'> href="#" size="sm" onClick={(event) => {
          event.preventDefault();
          router.push('/login');
        }}>
          Conecte-se
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => {
            console.log(values);

            try {
              const response = await api.post('/api/signup', values);
              console.log(response.data);

              showNotification({
                title: 'Sucesso',
                message: response.data.message,
                color: 'green',
              });
            } catch (error: any) {
              console.log('erro', error);

              showNotification({
                title: 'Falha',
                color: 'red',
                message: error.response.data.message,
              });
            }
          })}
        >
          <TextInput
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="voce@foorum.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Senha"
            placeholder="Sua senha"
            required
            mt="md"
            {...form.getInputProps('password')}
          />

          <Button type="submit" fullWidth mt="xl">
            Entrar
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
