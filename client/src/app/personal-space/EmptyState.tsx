import React from 'react';
import { Box, Heading, Stack, Text, Button } from '@chakra-ui/core';
import Logo from '../components/logo/Logo';

const EmptyState = () => {
  return (
    <Box
      backgroundColor="#edf2f7"
      ml={0}
      mr={0}
      borderRadius={8}
      alignItems="center"
    >
      <Box
        margin="auto"
        width="50%"
        padding="10px"
        backgroundColor="gray.50"
        borderTopLeftRadius={8}
        borderTopRightRadius={8}
        height="40px"
      />
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        p={16}
        borderRadius={8}
      >
        <Heading size="lg">You haven’t added any projects.</Heading>
        <Text padding="5px">Welcome 👋🏼 Let’s get started. </Text>
        <Logo />
      </Stack>
    </Box>
  );
};

export default EmptyState;
