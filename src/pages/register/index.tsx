import { useState, ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  register as registerService,
} from '@/services/authService';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import config from "@/config";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleRegister = async () => {
    try {
      await registerService({ username, password, email });

      toast({
        title: 'Registration successful',
        description: 'You have been successfully registered!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Após o registro, faz login automaticamente
      await login(username, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: (error as Error).message || 'Please check your details and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      px={4}
    >
      <Box
        w="full"
        maxW="md"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        _dark={{ bg: 'gray.700' }}
      >
        <Heading as="h1" textAlign="center" color="teal.500" mb={6}>
          {config.appName}
        </Heading>
        <VStack spacing={4}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              focusBorderColor="teal.400"
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              focusBorderColor="teal.400"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              focusBorderColor="teal.400"
            />
          </FormControl>
          <Button
            colorScheme="teal"
            width="full"
            mt={4}
            onClick={handleRegister}
          >
            Register
          </Button>
          <Text mt={4}>
            Already have an account?{' '}
            <ChakraLink as={NextLink} href="/login" color="teal.500">
              Login here
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;
