import React, { useContext, useState } from 'react'
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
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Authcontext } from '../../context/authcontext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const {login} = useContext(Authcontext);

  const submitHandler = async () => {
  setLoading(true);
  if (!email || !password) {
    alert("Please fill in all fields.");
    setLoading(false);
    return;
  }

  await login({ email, password });

  setLoading(false);
  navigate('/');
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
            Sign in to your account
          </Heading>
          <FormControl id="email">
            <FormLabel color={useColorModeValue('gray.600', 'gray.300')}>Email address</FormLabel>
            <Input
              type="email"
              bg={useColorModeValue('gray.50', 'gray.700')}
              value={email}
              onChange={e => setEmail(e.target.value)}
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
            isLoading = {loading}
            onClick = {submitHandler}
          >
            Sign in
          </Button>
        </Stack>
      </Box>
  )
}

export default Login