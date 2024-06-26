import Sidebar from "./Sidebar";
import { AppShell } from "@saas-ui/react";
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import withAuth from "../protected/withAuth";

function Layout({ children }) {
  return (
    <AppShell
      variant="static"
      minH="$100vh"
      sidebar={<Sidebar />}
      // navbar={<Navbar />}
    >
      <Navbar />
      <Box as="main" flex="1" py="2" px="4">
        {children}
      </Box>
    </AppShell>
  );
}

export default withAuth(Layout);
