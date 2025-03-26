import { createTheme, MantineTheme } from '@mantine/core';

export const theme = createTheme({
  // Customizing the button colors
  components: {
    Button: {
      styles: (_: MantineTheme) => ({
        root: {
          backgroundColor: '#32CD32', // Custom background color
          color: 'white', // Text color
          '&:hover': {
            backgroundColor: '#228B22', // Hover background color
          },
        },
      }),
    },
  },

  // // Optional: other theme customizations
  // colors: {
  //   customBlue: ['#1E90FF', '#187bcd', '#1a74b8'],
  // },
});
