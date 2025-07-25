import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios'; // Correct import for axios
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { Authcontext } from '../../context/authcontext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate
  const {signup} = useContext(Authcontext);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !name || !password) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      await signup({ name, email, password }); // ✅ call context signup
      navigate('/'); // ✅ redirect on success
    } catch (error) {
      console.error("Signup error:", error);
    }

    setLoading(false);
  };

  return (
    <Box
      mt={6}
      rounded="lg"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="lg"
      p={8}
      w="full"
    >
      <Stack spacing={4}>
        <Heading fontSize="2xl" color={useColorModeValue('gray.700', 'gray.200')} textAlign="center">
          Create your account
        </Heading>
        <FormControl id="name">
          <FormLabel color={useColorModeValue('gray.600', 'gray.300')}>Name</FormLabel>
          <Input
            type="text"
            bg={useColorModeValue('gray.50', 'gray.700')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel color={useColorModeValue('gray.600', 'gray.300')}>Email address</FormLabel>
          <Input
            type="email"
            bg={useColorModeValue('gray.50', 'gray.700')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel color={useColorModeValue('gray.600', 'gray.300')}>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              bg={useColorModeValue('gray.50', 'gray.700')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                size="md"
                tabIndex={-1}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="gray"
          variant="solid"
          mt={4}
          isLoading={loading} // Disable button while loading
          onClick={submitHandler} // Call submitHandler on click
        >
          Sign up
        </Button>
      </Stack>
    </Box>
  );
}

export default Signup;
