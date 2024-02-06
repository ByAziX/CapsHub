import { useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const bgColor = useColorModeValue('light.bg', 'dark.bg');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const buttonHoverBg = useColorModeValue('purple.500', 'purple.200');
  const buttonActiveBg = useColorModeValue('purple.700', 'purple.400');
  return (
    <IconButton
      icon={isDark ? <SunIcon /> : <MoonIcon />}
      aria-label="Toggle Theme"
      bg="transparent" _hover={{ bg: buttonHoverBg }} _active={{ bg: buttonActiveBg } } 
      onClick={toggleColorMode} 
    />
  );
};
