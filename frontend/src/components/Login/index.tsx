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
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';

export function Login() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
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
        Bem-vindo de volta!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Não tem uma conta?{' '}
        <Anchor<'a'> href="/signup" size="sm" onClick={(event) => {
          event.preventDefault();
          router.push('/signup');
        }}>
          Cadastre-se
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              const response = await api.post('/api/login', values);
              const generatedToken = response.data.token;

              setCookie(null, 'token', generatedToken, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
              });

              showNotification({
                title: 'Autenticado com sucesso!',
                message: response.data.message,
                color: 'green',
              });

              router.push('/');
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
