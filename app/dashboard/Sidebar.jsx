"use client";
import {
  Box,
  Badge,
  Text,
  Spacer,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  Avatar,
  AvatarProps,
  ButtonProps,
  HStack,
  MenuDivider,
  MenuGroup,
  Portal,
} from "@chakra-ui/react";
import {
  Sidebar,
  SidebarToggleButton,
  SidebarSection,
  NavItem,
  NavGroup,
  PersonaAvatar,
} from "@saas-ui/react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiRotateCcw,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FaAngleDown } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href) => {
    router.push(href);
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login"); // Redirect to the login page after sign out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <Sidebar toggleBreakpoint="sm">
      <SidebarToggleButton />
      <SidebarSection direction="row">
        {/* <Image
          src="https://saas-ui.dev/favicons/favicon-96x96.png"
          width={28}
          height={28}
          alt="Logo"
        /> */}
        <Menu>
          <MenuButton as={Button} rightIcon={<FaAngleDown />}>
            Intronsoft
          </MenuButton>
          <MenuList>
            <MenuGroup title="Organizations" style={{ fontWeight: "bold" }}>
              <MenuDivider />
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
        <Menu>
          {/* {props.compact ? (
        <MenuButton as={IconButton} {...buttonProps} icon={activeLogo} />
      ) : (
        <MenuButton as={Button} leftIcon={activeLogo} {...buttonProps}>
          {activeWorkspace?.label}
        </MenuButton>
      )} */}
          <Portal>
            <MenuList zIndex={["modal", null, "dropdown"]}>
              <MenuGroup title="Organizations">
                {/* {workspaces.map(({ slug, label, logo, ...props }) => {
              return ( */}
                <MenuItem
                  key={"1"}
                  value={"1"}
                  // icon={<WorkspaceLogo name={label} src={logo} />}
                  // onClick={() => setWorkspace(slug)}
                  // {...props}
                >
                  <HStack>
                    <Text>{"Intronsoft"}</Text>
                    <Spacer />
                    {/* {slug === activeWorkspace?.slug ? <FiCheck /> : null} */}
                    {/* <FiCheck /> */}
                  </HStack>
                </MenuItem>
                {/* )
            })} */}
              </MenuGroup>
              <MenuDivider />
              {/* <MenuItem as={Link} href={usePath('settings/organization')}> */}
              <MenuItem as={Link} href={"settings/organization"}>
                Organization settings
              </MenuItem>
              <MenuItem as={Link} href="/getting-started">
                Create an organization
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <PersonaAvatar
                presence="online"
                size="xs"
                src="/showcase-avatar.jpg"
              />
            }
            variant="ghost"
          />
          <MenuList>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </SidebarSection>
      <SidebarSection flex="1" overflowY="auto" aria-label="Main">
        <NavGroup>
          <NavItem
            onClick={() => handleNavigation("/dashboard")}
            icon={<FiHome />}
            isActive={pathname === "/dashboard"}
          >
            Dashboard
          </NavItem>
          <NavItem
            onClick={() => handleNavigation("/dashboard/history")}
            icon={<FiRotateCcw />}
            isActive={pathname === "/dashboard/history"}
          >
            History
          </NavItem>
          <NavItem
            onClick={() => handleNavigation("/dashboard/settings")}
            icon={<FiSettings />}
            isActive={pathname === "/dashboard/settings"}
          >
            Settings
          </NavItem>
          <NavItem
            onClick={() => handleNavigation("/dashboard/users")}
            icon={<FiUsers />}
            isActive={pathname === "/dashboard/users"}
          >
            Users
          </NavItem>
        </NavGroup>

        <NavGroup title="Teams" isCollapsible>
          <NavItem onClick={() => handleNavigation("/dashboard/sales")}>
            Sales
          </NavItem>
          <NavItem onClick={() => handleNavigation("/dashboard/support")}>
            Support
          </NavItem>
        </NavGroup>

        <NavGroup title="Tags" isCollapsible>
          <NavItem
            icon={<Badge bg="purple.500" boxSize="2" borderRadius="full" />}
          >
            <Text>Lead</Text>
            <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
              83
            </Badge>
          </NavItem>
          <NavItem
            icon={<Badge bg="cyan.500" boxSize="2" borderRadius="full" />}
          >
            <Text>Customer</Text>
            <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
              210
            </Badge>
          </NavItem>
        </NavGroup>
      </SidebarSection>
      <SidebarSection>
        <NavItem
          onClick={() => handleNavigation("/dashboard/documentation")}
          icon={<FiHelpCircle />}
        >
          Documentation
        </NavItem>
      </SidebarSection>
    </Sidebar>
  );
}
