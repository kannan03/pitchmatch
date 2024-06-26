import { Box } from "@chakra-ui/react";
import withAuth from "../protected/withAuth";

function Layout({ children }) {
  return <Box as="main">{children}</Box>;
}

export default withAuth(Layout);
