import React, { useState } from 'react';
import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useColorModeValue // Importez useColorModeValue pour gérer les couleurs en fonction du thème
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = () => {
    if (typeof onSearch === 'function') {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Utilisez useColorModeValue pour ajuster la couleur en fonction du mode clair/sombre si nécessaire
  const inputFocusBorderColor = useColorModeValue('purple.500', 'purple.200');

  return (
    <InputGroup>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        focusBorderColor={inputFocusBorderColor} // Utilisez focusBorderColor ici
        borderColor={inputFocusBorderColor} // Optionnel: définissez une couleur de bordure par défaut
        _hover={{ borderColor: 'purple.800' }} // Pour le survol, changez à purple.500
      />
      <InputRightElement>
        <IconButton
          aria-label="Search database"
          icon={<SearchIcon />}
          onClick={handleSubmit}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
