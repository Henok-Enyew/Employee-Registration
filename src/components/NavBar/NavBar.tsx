import { Flex, Title } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function NavBar() {
  return (
    <>
      <Flex justify="space-between" align="flex-start" mt="lg" p="sm">
        <div> </div>
        <Title order={2} style={{ textDecoration: 'underline', textUnderlineOffset: '8px' }}>
          Employee Managment System
        </Title>
        <Flex gap="lg">
          {/* <Button>Register Employee</Button> */}
          <ColorSchemeToggle />
        </Flex>
      </Flex>
    </>
  );
}
