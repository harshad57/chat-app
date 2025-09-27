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
import { Authcontext } from '../../context/authcontext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { login } = useContext(Authcontext)

  const submitHandler = async () => {
    setLoading(true)
    if (!email || !password) {
      alert('Please fill in all fields.')
      setLoading(false)
      return
    }

    await login({ email, password })

    setLoading(false)
    navigate('/')
  }

  return (
    <Box
      mt={4}
      rounded="2xl"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="xl"
      p={{base:4, sm:8}}
      w="full"
    >
      <Stack spacing={6}>
        {/* Heading */}
        <Heading
          fontSize="2xl"
          bgGradient="linear(to-r, green.500, green.600)"
          bgClip="text"
          textAlign="center"
        >
          Sign in to your account
        </Heading>

        {/* Email */}
        <FormControl id="email">
          <FormLabel color="green.600">Email address</FormLabel>
          <Input
            type="email"
            bg={useColorModeValue('green.50', 'gray.700')}
            border="1px solid"
            borderColor="green.200"
            focusBorderColor="green.500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            rounded="lg"
          />
        </FormControl>

        {/* Password */}
        <FormControl id="password">
          <FormLabel color="green.600">Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              bg={useColorModeValue('green.50', 'gray.700')}
              border="1px solid"
              borderColor="green.200"
              focusBorderColor="green.500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              rounded="lg"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                size="md"
                color="green.500"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Button */}
        <Button
          bgGradient="linear(to-r, green.400, green.600)"
          color="white"
          _hover={{ bgGradient: 'linear(to-r, green.500, green.700)' }}
          variant="solid"
          mt={2}
          isLoading={loading}
          onClick={submitHandler}
          rounded="lg"
          fontWeight="600"
        >
          Sign in
        </Button>
      </Stack>
    </Box>
  )
}

export default Login
