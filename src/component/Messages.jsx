import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spacer,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  Search,
  MoreVertical,
  Send,
  PhoneOff,
  Flag,
  Shield,
  MessageCircle,
  User,
  Clock,
  CheckCircle,
  CheckCheck,
  Ban,
  Filter,
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../pages/firebase';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();
  const messagesEndRef = useRef(null);
  
  // Modals
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const { isOpen: isBlockOpen, onOpen: onBlockOpen, onClose: onBlockClose } = useDisclosure();
  
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [userToAction, setUserToAction] = useState(null);

  // Suggested messages for buyers
  const suggestedMessages = [
    "Hi, I'm interested in this product. Is it still available?",
    "Can you tell me more about the condition?",
    "What's your best price?",
    "Where on campus can we meet?",
    "Do you have more photos?",
    "Is the price negotiable?",
    "When are you available to meet?",
  ];

  // Default seller responses
  const sellerResponses = [
    "Hi! Thank you for your interest in my product.",
    "Yes, it's still available.",
    "The condition is as described in the listing.",
    "Price is firm as listed.",
    "We can meet at the library steps.",
    "I'm available after 2 PM tomorrow.",
    "Let me know what time works for you.",
  ];

  // Load conversations
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('lastUpdated', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(conversationsData);
    });

    return () => unsubscribe();
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const q = query(
      collection(db, 'conversations', selectedConversation.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
      
      // Mark as read
      if (messagesData.length > 0) {
        markAsRead();
      }
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markAsRead = async () => {
    if (!selectedConversation || !auth.currentUser) return;

    const unreadMessages = messages.filter(
      msg => !msg.read && msg.senderId !== auth.currentUser.uid
    );

    for (const msg of unreadMessages) {
      await updateDoc(doc(db, 'conversations', selectedConversation.id, 'messages', msg.id), {
        read: true,
        readAt: serverTimestamp()
      });
    }
  };

  const startConversation = async (product, initialMessage) => {
    if (!auth.currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to message sellers",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // Check if conversation already exists
      const existingConvQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', auth.currentUser.uid),
        where('productId', '==', product.id)
      );

      const existingConvSnapshot = await getDocs(existingConvQuery);
      
      let conversationId;
      if (!existingConvSnapshot.empty) {
        conversationId = existingConvSnapshot.docs[0].id;
        setSelectedConversation({ id: conversationId, ...existingConvSnapshot.docs[0].data() });
      } else {
        // Create new conversation
        const conversationData = {
          participants: [auth.currentUser.uid, product.sellerId],
          productId: product.id,
          productTitle: product.title,
          productImage: product.imageUrl,
          productPrice: product.price,
          lastUpdated: serverTimestamp(),
          createdAt: serverTimestamp(),
        };

        const conversationRef = await addDoc(collection(db, 'conversations'), conversationData);
        conversationId = conversationRef.id;
        setSelectedConversation({ id: conversationId, ...conversationData });
      }

      // Send initial message
      await sendMessage(initialMessage, conversationId);
      
      toast({
        title: "Message sent!",
        status: "success",
        duration: 2000,
      });

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageText, convId = null) => {
    if (!messageText.trim()) return;

    const conversationId = convId || selectedConversation.id;
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    try {
      const messageData = {
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        timestamp: serverTimestamp(),
        read: false,
      };

      await addDoc(collection(db, 'conversations', conversationId, 'messages'), messageData);

      // Update conversation last updated
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastUpdated: serverTimestamp(),
        lastMessage: messageText,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
    }
  };

  const handleSuggestedMessage = (message) => {
    if (selectedConversation) {
      sendMessage(message);
    }
  };

  const handleReportUser = async () => {
    if (!userToAction) return;

    try {
      const reportData = {
        reporterId: auth.currentUser.uid,
        reportedUserId: userToAction.id,
        reason: reportReason,
        description: reportDescription,
        timestamp: serverTimestamp(),
        status: 'pending',
      };

      await addDoc(collection(db, 'reports'), reportData);

      toast({
        title: "User reported",
        description: "We'll review this report within 24 hours",
        status: "success",
        duration: 4000,
      });

      onReportClose();
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      console.error('Error reporting user:', error);
      toast({
        title: "Failed to report user",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleBlockUser = async () => {
    if (!userToAction) return;

    try {
      const blockData = {
        blockerId: auth.currentUser.uid,
        blockedUserId: userToAction.id,
        timestamp: serverTimestamp(),
      };

      await setDoc(doc(db, 'blockedUsers', `${auth.currentUser.uid}_${userToAction.id}`), blockData);

      toast({
        title: "User blocked",
        description: "You won't receive messages from this user anymore",
        status: "success",
        duration: 3000,
      });

      onBlockClose();
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Failed to block user",
        status: "error",
        duration: 3000,
      });
    }
  };

  const openReportModal = (user) => {
    setUserToAction(user);
    onReportOpen();
  };

  const openBlockModal = (user) => {
    setUserToAction(user);
    onBlockOpen();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(pid => pid !== auth.currentUser?.uid);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxW="8xl" py={6}>
      {/* Safety Banner */}
      <Alert status="warning" mb={6} borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Safety First! 🛡️</AlertTitle>
          <AlertDescription>
            Keep all communications on UNILAG Yard. Do not share phone numbers, email addresses, 
            or social media links. Report any suspicious behavior immediately.
          </AlertDescription>
        </Box>
      </Alert>

      <Card>
        <CardHeader pb={0}>
          <Flex align="center">
            <HStack spacing={3}>
              <MessageCircle size={24} color="#2D3748" />
              <Text fontSize="2xl" fontWeight="bold">Messages</Text>
            </HStack>
            <Spacer />
            <Badge colorScheme="blue" fontSize="sm">
              {conversations.length} {conversations.length === 1 ? 'Conversation' : 'Conversations'}
            </Badge>
          </Flex>
        </CardHeader>

        <CardBody>
          <Tabs variant="enclosed" onChange={setActiveTab}>
            <TabList>
              <Tab>All Messages</Tab>
              <Tab>Buying</Tab>
              <Tab>Selling</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={4}>
                <HStack spacing={6} align="flex-start" height="70vh">
                  {/* Conversations List */}
                  <Box width="400px" borderRight="1px" borderColor="gray.200" pr={4} height="100%">
                    <InputGroup mb={4}>
                      <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <InputRightElement>
                        <Search size={18} color="#718096" />
                      </InputRightElement>
                    </InputGroup>

                    <VStack spacing={2} align="stretch" overflowY="auto" height="calc(100% - 60px)">
                      {filteredConversations.map((conversation) => (
                        <Box
                          key={conversation.id}
                          p={3}
                          borderRadius="md"
                          bg={selectedConversation?.id === conversation.id ? 'blue.50' : 'transparent'}
                          border="1px"
                          borderColor={selectedConversation?.id === conversation.id ? 'blue.200' : 'transparent'}
                          cursor="pointer"
                          onClick={() => setSelectedConversation(conversation)}
                          _hover={{ bg: 'gray.50' }}
                        >
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={conversation.productTitle}
                              src={conversation.productImage}
                            />
                            <Box flex={1}>
                              <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                                {conversation.productTitle}
                              </Text>
                              <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                {conversation.lastMessage}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                ₦{conversation.productPrice?.toLocaleString()}
                              </Text>
                            </Box>
                            <VStack spacing={0} align="flex-end">
                              <Text fontSize="xs" color="gray.500">
                                {conversation.lastUpdated ? formatTime(conversation.lastUpdated) : ''}
                              </Text>
                              {/* Unread badge would go here */}
                            </VStack>
                          </HStack>
                        </Box>
                      ))}

                      {filteredConversations.length === 0 && (
                        <Box textAlign="center" py={8}>
                          <MessageCircle size={48} color="#CBD5E0" />
                          <Text color="gray.500" mt={2}>No conversations yet</Text>
                          <Text fontSize="sm" color="gray.400">
                            Start a conversation from a product page
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  {/* Messages Area */}
                  <Box flex={1} height="100%">
                    {selectedConversation ? (
                      <VStack spacing={4} height="100%">
                        {/* Conversation Header */}
                        <HStack width="100%" justify="space-between" pb={4} borderBottom="1px" borderColor="gray.200">
                          <HStack spacing={3}>
                            <Avatar
                              size="md"
                              name={selectedConversation.productTitle}
                              src={selectedConversation.productImage}
                            />
                            <Box>
                              <Text fontWeight="semibold">{selectedConversation.productTitle}</Text>
                              <Text fontSize="sm" color="gray.600">
                                ₦{selectedConversation.productPrice?.toLocaleString()}
                              </Text>
                            </Box>
                          </HStack>
                          
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MoreVertical size={16} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<Flag size={16} />} onClick={() => openReportModal({ id: getOtherParticipant(selectedConversation) })}>
                                Report User
                              </MenuItem>
                              <MenuItem icon={<Ban size={16} />} onClick={() => openBlockModal({ id: getOtherParticipant(selectedConversation) })}>
                                Block User
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>

                        {/* Messages */}
                        <VStack
                          spacing={3}
                          align="stretch"
                          flex={1}
                          width="100%"
                          overflowY="auto"
                          maxHeight="400px"
                        >
                          {messages.map((message) => (
                            <Box
                              key={message.id}
                              alignSelf={message.senderId === auth.currentUser?.uid ? 'flex-end' : 'flex-start'}
                              maxWidth="70%"
                            >
                              <Box
                                bg={message.senderId === auth.currentUser?.uid ? 'blue.500' : 'gray.100'}
                                color={message.senderId === auth.currentUser?.uid ? 'white' : 'gray.800'}
                                px={4}
                                py={2}
                                borderRadius="lg"
                                borderBottomRightRadius={message.senderId === auth.currentUser?.uid ? 0 : 'lg'}
                                borderBottomLeftRadius={message.senderId === auth.currentUser?.uid ? 'lg' : 0}
                              >
                                <Text fontSize="sm">{message.text}</Text>
                                <HStack spacing={1} mt={1} justify="flex-end">
                                  <Text fontSize="xs" opacity={0.8}>
                                    {message.timestamp ? formatTime(message.timestamp) : ''}
                                  </Text>
                                  {message.senderId === auth.currentUser?.uid && (
                                    message.read ? (
                                      <CheckCheck size={12} />
                                    ) : (
                                      <CheckCircle size={12} />
                                    )
                                  )}
                                </HStack>
                              </Box>
                            </Box>
                          ))}
                          <div ref={messagesEndRef} />
                        </VStack>

                        {/* Suggested Messages (for buyers) */}
                        {activeTab === 1 && messages.length === 0 && (
                          <Box width="100%">
                            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                              Quick messages:
                            </Text>
                            <HStack spacing={2} flexWrap="wrap">
                              {suggestedMessages.map((msg, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuggestedMessage(msg)}
                                >
                                  {msg}
                                </Button>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        {/* Message Input */}
                        <HStack width="100%" spacing={2}>
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <IconButton
                            colorScheme="blue"
                            icon={<Send size={18} />}
                            onClick={handleSendMessage}
                            isLoading={loading}
                          />
                        </HStack>
                      </VStack>
                    ) : (
                      <Box textAlign="center" py={20}>
                        <MessageCircle size={64} color="#CBD5E0" />
                        <Text fontSize="xl" color="gray.500" mt={4}>
                          Select a conversation
                        </Text>
                        <Text color="gray.400">
                          Choose a conversation from the list to start messaging
                        </Text>
                      </Box>
                    )}
                  </Box>
                </HStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Report User Modal */}
      <Modal isOpen={isReportOpen} onClose={onReportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Flag size={20} />
              <Text>Report User</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Reason for reporting</FormLabel>
                <Select
                  placeholder="Select reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="harassment">Harassment or abusive behavior</option>
                  <option value="spam">Spam or suspicious activity</option>
                  <option value="fake_product">Fake product or scam</option>
                  <option value="off_platform">Trying to move off platform</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Additional details</FormLabel>
                <Textarea
                  placeholder="Please provide more information about this issue..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReportClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleReportUser}>
              Report User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Block User Modal */}
      <Modal isOpen={isBlockOpen} onClose={onBlockClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Ban size={20} />
              <Text>Block User</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to block this user? You will no longer receive messages from them, 
              and they won't be able to see your products or contact you.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBlockClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleBlockUser}>
              Block User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Messages;