// import AuthButton from "@/components/AuthButton";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   PersonaAvatar,
//   SearchInput,
// } from "@saas-ui/react";
// import logo from "../../public/logo.png";
// import {
//   Box,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuGroup,
//   MenuItem,
//   MenuDivider,
// } from "@chakra-ui/react";
// import Image from "next/image";

// export default function Page() {
//   return (
//     <Navbar
//       position="sticky"
//       borderBottomWidth="1px"
//       background="transparent"
//       backdropFilter="blur(10px)"
//     >
//       {/* <NavbarBrand>
//         <Image src={logo} alt="Logo" width="150"></Image>
//       </NavbarBrand> */}
//       <NavbarContent as="div" justifyContent="end" spacing="4">
//         <Box width="180px">
//           <SearchInput size="sm" />
//         </Box>
//         {/* <Menu>
//           <MenuButton>
//             <PersonaAvatar
//               src="/showcase-avatar.jpg"
//               name="Beatriz"
//               size="xs"
//               presence="online"
//             />
//           </MenuButton>
//           <MenuList>
//             <MenuGroup title="beatriz@saas-ui.dev">
//               <MenuItem>Profile</MenuItem>
//               <MenuItem>Settings</MenuItem>
//               <MenuItem>Help &amp; feedback</MenuItem>
//             </MenuGroup>
//             <MenuDivider />
//             <MenuItem>Log out</MenuItem>
//           </MenuList>
//         </Menu> */}
//         <AuthButton />
//       </NavbarContent>
//     </Navbar>
//   );
// }
"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  PersonaAvatar,
  SearchInput,
} from "@saas-ui/react";
import logo from "../../public/logo.png";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Function to determine the page title based on the current path
const getPageTitle = (pathname) => {
  console.log(pathname);
  switch (pathname) {
    case "/":
      return "Home";
    case "/dashboard":
      return "Dashboard";
    case "/dashboard/history":
      return "History";
    case "/dashboard/settings":
      return "Settings";
    case "/dashboard/personalize-mail":
      return "Personalize Mail";
    default:
      return "Page";
  }
};

export default function Page() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <Navbar
      position="sticky"
      borderBottomWidth="1px"
      background="transparent"
      backdropFilter="blur(10px)"
    >
      <NavbarContent as="div" justifyContent="space-between" spacing="4">
        <Box display="flex" alignItems="center">
          <Box ml="" fontWeight="bold">
            {pageTitle}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="180px">
            <SearchInput size="sm" />
          </Box>
        </Box>
      </NavbarContent>
    </Navbar>
  );
}
