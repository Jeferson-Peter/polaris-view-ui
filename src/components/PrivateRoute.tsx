import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { Spinner, Center } from "@chakra-ui/react";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return <>{children}</>;
};
