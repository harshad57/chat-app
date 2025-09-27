import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import Login from "../auth/login.jsx";
import Signup from "../auth/signup.jsx";

function Home() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="green.50"
      px={4}
    >
      <Container
        maxW="lg"
        bg="white"
        p={{base:0, sm:6}}
        borderRadius="2xl"
        boxShadow="lg"
        centerContent
      >
        {/* Header */}
        <Box w="100%" p={4} mb={4}>
          <Text p={4}
          bg="green.500"
          w="100%"
          color="white"
          textAlign="center"
          borderRadius="xl"
          fontWeight="bold"
          fontSize="28px"
          boxShadow="sm">Chat App</Text>
        </Box>

        {/* Tabs */}
        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          isFitted
          w="100%"
        >
          <TabList gap={3} px={4}>
            <Tab
              _selected={{ bg: "green.500", color: "white" }}
              borderRadius="lg"
              fontWeight="600"
            >
              Sign Up
            </Tab>
            <Tab
              _selected={{ bg: "green.500", color: "white" }}
              borderRadius="lg"
              fontWeight="600"
            >
              Login
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Signup />
            </TabPanel>
            <TabPanel>
              <Login />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Flex>
  );
}

export default Home;