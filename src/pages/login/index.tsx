import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Text,
  Link as ChakraLink,
  useToast,
  Heading,
} from "@chakra-ui/react";
import NextLink from "next/link";
import config from "@/config";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred";
      setError(errorMessage);
      console.log("error: ", error);
      toast({
        title: "Login failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
    >
      <Box
        w="sm"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        _dark={{ bg: 'gray.700' }}
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.500">
          {config.appName}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isInvalid={!!error}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isInvalid={!!error}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isLoading}
              width="full"
            >
              Login
            </Button>

            <Text mt={4}>
              Don&apos;t have an account?{" "}
              <ChakraLink as={NextLink} href="/register" color="teal.500">
                Register here
              </ChakraLink>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
