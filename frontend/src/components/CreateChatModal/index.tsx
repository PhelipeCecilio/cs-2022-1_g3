import {Button, Container, Paper, TextInput, Title,} from '@mantine/core';
import {useForm} from '@mantine/form';
import {api} from '../../services/api';
import {showNotification} from '@mantine/notifications';
import {useRouter} from 'next/router';
import {parseCookies} from "nookies";

export function CreateChatModal() {
    const router = useRouter();

    const cookies = parseCookies();
    const token = cookies.token;

    const form = useForm({
        initialValues: {
            name: '',
        }
    });
    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
               Criar chat
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form
                    onSubmit={form.onSubmit(async (values) => {
                        try {
                            const response = await api.post('/api/chats', values, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            showNotification({
                                title: 'Chat criado com sucesso!',
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
                        label="Nome do chat"
                        placeholder="Novo Chat"
                        required
                        {...form.getInputProps('name')}
                    />

                    <Button type="submit" fullWidth mt="xl">
                        Entrar
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
