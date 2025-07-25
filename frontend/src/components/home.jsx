import { Box, Container, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react'
import Login from '../auth/login.jsx'
import Signup from '../auth/signup.jsx'

function Home() {

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.200">
        <Container maxW='xl' centerContent bg='gray.300' p={4} borderRadius='md' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
            <Box p={3} bg='gray.500' w='100%' color='white' textAlign='center' borderRadius='md' fontWeight='bold' fontSize='30px'>
                <Text>Chat App</Text>
            </Box>
            <Box mt={8} w='100%'>
                <Tabs variant='enclosed' colorScheme='gray' borderColor='transparent'>
                    <TabList justifyContent="space-between" display='flex' gap={5}>
                        
                        <Tab bg="gray.400" flex='1'>Sign Up</Tab>
                        <Tab bg="gray.400" flex='1'>Login</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel><Signup /></TabPanel>
                        <TabPanel><Login /></TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
        </Flex>
    )
}

export default Home