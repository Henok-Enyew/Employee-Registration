import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Text, Title } from '@mantine/core';
import { useAuthStore } from '@/store/store';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function NavBar() {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();
  useEffect(() => {
    const getUser = async () => {
      await fetchUser();
    };

    getUser();
  }, []);

  return (
    <Flex direction="column">
      <Flex justify="space-between" align="flex-start" p="sm">
        <div> </div>
        <Title order={2} style={{ textDecoration: 'underline', textUnderlineOffset: '8px' }}>
          Employee Managment System
        </Title>
        <Flex gap="lg">
          <Button
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </Button>
          <ColorSchemeToggle />
        </Flex>
      </Flex>
      <Text ml="auto" px="lg" fw="bold">
        {user?.name} (admin)
      </Text>
    </Flex>
  );
}
