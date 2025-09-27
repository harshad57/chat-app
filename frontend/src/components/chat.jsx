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
  useToast
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Authcontext } from '../../context/authcontext';
import { Chatcontext } from '../../context/chatcontext';

function Chat() {
  const [openImage, setOpenImage] = useState(null);
  const [isOtherProfileOpen, setIsOtherProfileOpen] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();

  const scrollEnd = useRef(null);
  const toast = useToast();

  const { authuser, logout, onlineuser } = useContext(Authcontext);
  const { getusers, users, selectedUser, setSelectedUser, unseenmsg, setunseenmsg, msgs, sendmsg, getmsg } = useContext(Chatcontext);

  const profile = { name: authuser?.name || '', email: authuser?.email || '', pic: authuser?.pic || '' };

  const filteredUsers = search ? users.filter(u => u?.name?.toLowerCase().includes(search.toLowerCase())) : users;

  useEffect(() => { getusers(); }, [onlineuser]);
  useEffect(() => { if (selectedUser) getmsg(selectedUser._id); }, [selectedUser]);
  useEffect(() => { if (scrollEnd.current && msgs) scrollEnd.current.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    setLoading(true);
    try {
      await sendmsg({ text: input.trim(), image: selectedImage });
      setInput('');
      setSelectedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast({ title: 'Select an image file', status: 'error', duration: 2000, isClosable: true });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => { setSelectedImage(reader.result); e.target.value = ''; };
    reader.readAsDataURL(file);
  };

  return (
    <Flex h="100vh" bg="green.50">
      {/* Sidebar Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottom='1px' borderColor='green.200' color='green.700'>Chats</DrawerHeader>
          <DrawerBody>
            <Flex mb={4}>
              <Input placeholder='Search users...' value={search} onChange={e => setSearch(e.target.value)} mr={2} borderColor='green.300' />
              <Button colorScheme='green' onClick={() => setSearch(search)} isLoading={loading}>Search</Button>
            </Flex>
            <VStack align='stretch' spacing={2}>
              {filteredUsers.length === 0 ? (
                <Text textAlign='center' color='gray.500'>No users found.</Text>
              ) : filteredUsers.map(user => (
                <Box key={user._id} p={3} bg='green.100' _hover={{ bg: 'green.200' }} cursor='pointer' borderRadius={8} position='relative' onClick={() => { setSelectedUser(user); setunseenmsg(prev => ({ ...prev, [user._id]: 0 })); onClose(); }}>
                  <Flex align='center' justify='space-between'>
                    <Flex align='center' gap={2}>
                      <Avatar name={user.name} size='sm' />
                      <Text fontSize={15}>{user.name}</Text>
                    </Flex>
                    <Box textAlign='right' fontSize={13}>
                      {onlineuser.includes(user._id) ? <Text color='green.500'>Online</Text> : <Text color='red.500'>Offline</Text>}
                      {unseenmsg?.[user._id] > 0 && <Text fontSize='0.8rem' bg='green.600' color='white' px={2} py={1} borderRadius='full' position='absolute' top={2} right={2}>{unseenmsg[user._id]}</Text>}
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Chat Area */}
      <Flex flex='1' direction='column'>
        <Flex align='center' justify='space-between' p={4} bg='white' borderBottom='1px' borderColor='green.200'>
          <Flex align='center'>
            <IconButton icon={<HamburgerIcon />} onClick={onOpen} variant='ghost' mr={2} aria-label='Open menu' colorScheme='green' />
            <Text fontWeight='bold' fontSize='lg' color='green.700'>Chat</Text>
          </Flex>
          <Flex align='center'>
            <Avatar name={profile.name} cursor='pointer' onClick={onProfileOpen} mr={2} border='2px solid' borderColor='green.400' />
            <Text fontWeight='medium' color='green.700'>{profile.name}</Text>
          </Flex>
        </Flex>

        <Box flex='1' overflowY='auto' display='flex' alignItems='center' flexDirection='column' position='relative' bg='green.50'>
          <VStack spacing={4} align='stretch' w='100%' px={6} py={4}>
            {selectedUser ? (msgs.length === 0 ? <Text color='gray.400' textAlign='center'>No messages yet.</Text> : msgs.map((msg, idx) => {
              const isSender = msg.sender === authuser._id;
              return (
                <Flex key={idx} justify={isSender ? 'flex-end' : 'flex-start'} position='relative' pb={4} align='center'>
                  {!isSender && <Avatar name={selectedUser.name} size='sm' mr={2} />}
                  <Box px={4} py={2} rounded='xl' maxW={{ base: '80%', md: '60%', lg: '45%' }} bg={isSender ? 'green.500' : 'white'} color={isSender ? 'white' : 'gray.800'}>
                    {msg.image && <img src={msg.image} alt='sent' style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: msg.text ? 8 : 0, objectFit: 'cover' }} onClick={() => setOpenImage(msg.image)} />}
                    {msg.text && <Text>{msg.text}</Text>}
                  </Box>
                  {isSender && <Avatar name={profile.name} size='sm' ml={2} />}
                  <Text position='absolute' bottom={0} fontSize={12}>{new Date(msg.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</Text>
                </Flex>
              );
            })) : <Text color='gray.400' textAlign='center'>Select a user from the menu to start chatting.</Text>}
            <Box ref={scrollEnd}></Box>
          </VStack>
        </Box>

        {selectedImage && <Box mb={2} display='flex' flexDirection='column' alignItems='center' p={2} bg='green.100'><img src={selectedImage} alt='preview' style={{ maxWidth:'90%', maxHeight:'50vh', borderRadius: 8 }} /><Button size='sm' mt={2} colorScheme='red' variant='outline' onClick={() => setSelectedImage(null)}>Remove</Button></Box>}
        <Flex p={4} bg='white' borderTop='1px' borderColor='green.200' gap={2}>
          <Input flex={3} placeholder='Type your message...' value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(e)} isDisabled={!selectedUser || loading} borderColor='green.300' />
          <Input type='file' id='image' display='none' accept='image/png, image/jpeg, image/jpg' onChange={sendImage} isDisabled={!selectedUser || loading} />
          <label htmlFor='image'><img src='https://img.icons8.com/ios-filled/50/000000/attach.png' alt='attach' style={{ width:30, height:30, cursor:'pointer' }} /></label>
          <Button colorScheme='green' isLoading={loading} isDisabled={!selectedUser || loading} onClick={sendMessage}>Send</Button>
        </Flex>

        {/* Profile Modals */}
        <Modal isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color='green.700'>{profile.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction='column' align='center' mb={4}>
                <Avatar name={profile.name} size='xl' mb={2} border='2px solid' borderColor='green.400' />
                <Text fontWeight='bold'>{profile.name}</Text>
                <Text fontSize='sm' color='gray.500'>{profile.email}</Text>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' w='full' onClick={logout}>Logout</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isOtherProfileOpen} onClose={() => setIsOtherProfileOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color='green.700'>{selectedUser?.name}'s Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction='column' align='center' mb={4}>
                <Avatar size='xl' mb={2} name={selectedUser?.name} border='2px solid' borderColor='green.400' />
                <Text fontWeight='bold'>{selectedUser?.name}</Text>
                <Text fontSize='sm' color='gray.500'>{selectedUser?.email || `${selectedUser?.name?.toLowerCase()}@email.com`}</Text>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsOtherProfileOpen(false)} colorScheme='green' w='full'>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {openImage && <Box position='fixed' top={0} left={0} w='100vw' h='100vh' bg='rgba(0,0,0,0.8)' zIndex={2000} display='flex' alignItems='center' justifyContent='center' style={{ backdropFilter:'blur(6px)' }}>
          <IconButton icon={<CloseIcon />} aria-label='Close' position='absolute' top={6} right={6} size='lg' colorScheme='whiteAlpha' bg='rgba(0,0,0,0.5)' onClick={() => setOpenImage(null)} zIndex={2100} />
          <img src={openImage} alt='fullscreen' style={{ maxWidth:'90%', maxHeight:'80vh', borderRadius:12, boxShadow:'0 4px 32px rgba(0,0,0,0.5)', background:'white', objectFit:'contain' }} />
        </Box>}
      </Flex>
    </Flex>
  );
}

export default Chat;