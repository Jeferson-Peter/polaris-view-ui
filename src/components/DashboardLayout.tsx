import { ReactNode } from "react";
import { Box, Flex, HStack, VStack, Text, Button, IconButton, useColorMode } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import config from "@/config";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Flex height="100vh" flexDirection="column">
      {/* Navbar */}
      <Flex
        as="nav"
        bg="teal.500"
        color="white"
        px={4}
        py={2}
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        boxShadow="md"
      >
        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<FiMenu />}
            variant="ghost"
            color="white"
          />
          <Text fontSize="lg" fontWeight="bold">
            {config.appName}
          </Text>
        </HStack>
        <HStack spacing={4}>
          <Text>Welcome, {user?.username}</Text>
          <IconButton
            aria-label="Toggle Color Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
          />
          <Button colorScheme="teal" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Flex flex="1">
        {/* Sidebar */}
        <Box
          as="aside"
          width={{ base: "full", md: 60 }}
          bg={colorMode === "light" ? "gray.100" : "gray.800"}
          borderRightWidth="1px"
          borderRightColor="gray.200"
          p={4}
        >
          <VStack align="start" spacing={4}>
            <Button variant="link" onClick={() => router.push("/dashboard")}>
              Home
            </Button>
            <Button variant="link" onClick={() => router.push("/dashboard/profile")}>
              Profile
            </Button>
          </VStack>
        </Box>

        {/* Dynamic Content */}
        <Box flex="1" p={6}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};
