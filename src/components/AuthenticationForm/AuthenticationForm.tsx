import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/store/store';

// import { GoogleButton } from './GoogleButton';
// import { TwitterButton } from './TwitterButton';

type FormValues = {
  email: string;
  name: string;
  password: string;
  terms: boolean;
};

export function AuthenticationForm(props: PaperProps) {
  const { register, login } = useAuthStore();
  const navigate = useNavigate();
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const handleRegister = async (values: FormValues) => {
    const success = await register(values.name, values.email, values.password);
    if (success) {
      // navigate('/home');
      notifications.show({
        title: 'Sucessfully registered',
        message: 'Welcome to Employee Registration system',
      });
      toggle();
    } else {
      notifications.show({
        title: 'Failed to register',
        message: 'Try using another email or try again later',
        color: 'red',
      });
    }
  };
  const handleLogin = async (values: FormValues) => {
    const success = await login(values.email, values.password);
    if (success) {
      // await fetchUser();
      navigate('/home');
      notifications.show({
        title: 'Logged in succesfully',
        message: 'Welcome to Employee Registration system',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Failed to Login',
        message: 'Email or Password provided is incorrect',
        color: 'red',
      });
    }
  };

  const handleSubmit = (values: FormValues) => {
    if (type === 'register') {
      handleRegister(values);
    } else {
      handleLogin(values);
    }
  };

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
      {...props}
      style={{
        maxWidth: 500, // Limit width on larger screens
        width: '100%', // Keep it responsive
        margin: '100px auto', // Center it
      }}
    >
      <Text size="lg" fw={500}>
        Welcome Admin's {type}
      </Text>
      <Divider m={10} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@employee.org"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group mt="xl" style={{ justifyContent: 'space-between' }}>
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
