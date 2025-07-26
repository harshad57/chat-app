import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Text,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Authcontext } from '../../context/authcontext';
import { Chatcontext } from '../../context/chatcontext';
import { CloseIcon } from '@chakra-ui/icons';

function Chat() {
  const [openImage, setOpenImage] = useState(null);
  const [isOtherProfileOpen, setIsOtherProfileOpen] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();

  const scrollEnd = useRef(null);
  const toast = useToast();

  const { authuser, logout, onlineuser } = useContext(Authcontext);
  const [profile, setProfile] = useState({
    name: authuser?.name || '',
    email: authuser?.email || '',
    pic: authuser?.pic || ''
  });
  const { getusers, users, selectedUser, setSelectedUser, unseenmsg, setunseenmsg, msgs, sendmsg, getmsg } = useContext(Chatcontext);

  const filteredusers = search ? users.filter((user) => user?.name?.toLowerCase().includes(search.toLowerCase())) : users;

  useEffect(() => {
    getusers();
  }, [onlineuser]);

  useEffect(() => {
    if (selectedUser) {
      getmsg(selectedUser._id);
    }
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setloading(true);
    try {
      await sendmsg({ text: input.trim(), image: selectedImage });
      setInput('');
      setSelectedImage(null);
    } finally {
      setloading(false);
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast({
        title: "Select an image file",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scrollEnd.current && msgs) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgs]);

  return (
    <Flex h="100vh" bg="gray.100">
      {/* Sidebar Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chats</DrawerHeader>
          <DrawerBody>
            <Flex mb={4}>
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                mr={2}
              />
              <Button
                colorScheme="blue"
                onClick={() => setSearch(search)}
                isLoading={loading}
              >
                Search
              </Button>
            </Flex>
            <VStack align="stretch" spacing={2}>
              {filteredusers.length === 0 ? (
                <Text textAlign="center" color="gray.500">No users found.</Text>
              ) : (filteredusers.map((user) => (
                <Box
                  key={user._id}
                  p={2}
                  _hover={{ bg: 'gray.200' }}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setunseenmsg(prev => ({ ...prev, [user._id]: 0 }));
                    onClose();
                  }}
                  bg='gray.100'
                  borderRadius={5}
                  position='relative'
                >
                  <Flex align="center">
                    <Avatar name={user.name} size="sm" mr={2} w={8} h={8} />
                    <Text fontSize={15}>{user.name}</Text>
                  </Flex>
                  <Box textAlign='left' fontSize={13}>
                    {onlineuser.includes(user._id) ? <span style={{ color: 'green', marginLeft: '40px' }}>Online</span> : <span style={{ color: 'red', marginLeft: '40px' }}>Offline</span>}
                    {unseenmsg?.[user._id] > 0 && <span style={{ fontSize: '1rem', background: '#2563eb', color: 'white', position: 'absolute', top: 20, right: 16, padding: '2px 8px', borderRadius: '999px' }}>{unseenmsg[user._id]}</span>}
                  </Box>
                </Box>
              ))
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Chat Area */}
      <Flex flex="1" direction="column">
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          p={4}
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Flex align="center">
            <IconButton
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              mr={2}
              aria-label="Open menu"
            />
            <Text fontWeight="bold" fontSize="lg">Chat</Text>
          </Flex>
          <Flex align="center">
            <Avatar
              name={profile.name}
              cursor="pointer"
              onClick={onProfileOpen}
              mr={2}
            />
            <Text fontWeight="medium">{profile.name}</Text>
          </Flex>
        </Flex>

        {/* Selected user badge */}
        {selectedUser && (
          <Flex
            position="absolute"
            top="90px"
            left="10px"
            bg="white"
            py={2}
            px={3}
            rounded="2xl"
            border="1px solid"
            borderColor="gray.200"
            align="center"
            zIndex={10}
            boxShadow="md"
          >
            <Text mr={2} fontWeight="medium">{selectedUser.name}</Text>
            <Avatar
              name={selectedUser.name}
              fontSize={1}
              w={10}
              h={10}
              cursor="pointer"
              onClick={() => setIsOtherProfileOpen(true)}
            />
          </Flex>
        )}

        {/* Messages */}
        <Box
          flex="1"
          overflowY="auto"
          display="flex"
          alignItems="center"
          flexDirection="column"
          position="relative"
        >
          <VStack spacing={4} align="stretch" w="100%" bottom={0} px={{ base: 2, md: 10 }} py={{ base: 2, md: 10 }}>
            {selectedUser ? (
              msgs.length === 0 ? (
                <Text color="gray.400" textAlign="center">No messages yet.</Text>
              ) : (
                <>
                  {msgs.map((msg, idx) => {
                    const isSender = msg.sender === authuser._id;

                    return (
                      <Flex
                        key={idx}
                        justify={isSender ? 'flex-end' : 'flex-start'}
                        position="relative"
                        pb={6}
                        align="center"
                      >
                        {/* Receiver avatar on left */}
                        {!isSender && (
                          <Avatar
                            name={selectedUser.name}
                            size="sm"
                            mr={2}
                          />
                        )}

                        <Box
                          fontSize={17}
                          fontFamily="sans-serif"
                          px={4}
                          py={2}
                          rounded="lg"
                          maxW="60%"
                          bg={isSender ? 'blue.500' : 'gray.200'}
                          color={isSender ? 'white' : 'gray.800'}
                          overflow="hidden"
                        >
                          {msg.image && (
                            <img src={msg.image} alt="sent" style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: 8,
                              marginBottom: msg.text ? 8 : 0,
                              objectFit: 'cover',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              maxWidth: '200px',
                              display: 'block'
                            }}
                              onClick={() => setOpenImage(msg.image)} />
                          )}
                          {msg.text && (
                            <Box mt={msg.image ? 2 : 0}>{msg.text}</Box>
                          )}
                        </Box>

                        {/* Sender avatar on right */}
                        {isSender && (
                          <Avatar
                            name={profile.name}
                            size="sm"
                            ml={2}
                          />
                        )}

                        <Box position="absolute" bottom={0} fontSize={13}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Box>
                      </Flex>
                    );
                  })}
                  <Box ref={scrollEnd}></Box>
                </>
              )
            ) : (
              <Text color="gray.400" textAlign="center">
                Select a user from the menu to start chatting.
              </Text>
            )}
          </VStack>
        </Box>

        {openImage && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="rgba(0,0,0,0.8)"
            zIndex={2000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ backdropFilter: 'blur(6px)' }}
          >
            <IconButton
              icon={<CloseIcon />}
              aria-label="Close"
              position="absolute"
              top={6}
              right={6}
              size="lg"
              colorScheme="whiteAlpha"
              bg="rgba(0,0,0,0.5)"
              onClick={() => setOpenImage(null)}
              zIndex={2100}
            />
            <img
              src={openImage}
              alt="fullscreen"
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                borderRadius: 12,
                boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                background: 'white'
              }}
            />
          </Box>
        )}

        {/* Input */}
        {selectedImage && (
          <Box mb={2} display="flex" bg="gray.300" flexDirection="column" justifyContent="center" alignItems="center" p={2} >
            <img src={selectedImage} alt="preview" style={{ maxWidth: '300px', borderRadius: 8 }} />
            <Button size="md" color="red.500" mt={2} borderColor="red.500" variant="outline" onClick={() => setSelectedImage(null)}>Remove</Button>
          </Box>
        )}
        <Flex p={4} bg="white" borderTop="1px" borderColor="gray.200" gap={2}>
          <Input
            flex={3}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
            isDisabled={!selectedUser || loading}
          />
          <Input onChange={sendImage} type="file" id="image" display="none" accept='image/png, image/jpeg, image/jpg' isDisabled={!selectedUser || loading} flex={1} />
          <label htmlFor="image">
            <img src="https://img.icons8.com/ios-filled/50/000000/attach.png" alt="attach" style={{ width: 30, height: 30, cursor: 'pointer' }} />
          </label>
          <Button colorScheme="blue" isLoading={loading} isDisabled={!selectedUser || loading} onClick={sendMessage}>
            Send
          </Button>
        </Flex>
      </Flex>

      {/* Logged-in User Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{profile.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" mb={4}>
              <Avatar name={profile.name} size="xl" mb={2} />
              <Text fontWeight="bold">{profile.name}</Text>
              <Text fontSize="sm" color="gray.500">{profile.email}</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" w="full" onClick={logout}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Other User Profile Modal */}
      <Modal isOpen={isOtherProfileOpen} onClose={() => setIsOtherProfileOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedUser?.name}'s Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" mb={4}>
              <Avatar size="xl" mb={2} name={selectedUser?.name} />
              <Text fontWeight="bold">{selectedUser?.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {selectedUser?.email || `${selectedUser?.name?.toLowerCase()}@email.com`}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsOtherProfileOpen(false)} colorScheme="blue" w="full">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Chat;