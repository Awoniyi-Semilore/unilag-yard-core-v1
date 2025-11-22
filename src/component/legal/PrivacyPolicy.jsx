import React from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Shield, Eye, Users, Database } from 'lucide-react';

const MotionBox = motion(Box);
const MotionTable = motion(Table);

const PrivacyPolicy = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const dataCollection = [
    { type: 'Personal Information', examples: 'Name, UNILAG ID, Email, Phone Number' },
    { type: 'Transaction Data', examples: 'Purchase history, messages, saved items' },
    { type: 'Usage Data', examples: 'IP address, browser type, pages visited' },
    { type: 'Device Information', examples: 'Device type, operating system, app version' }
  ];

  const dataUsage = [
    { purpose: 'Account Management', description: 'To create and maintain your student account' },
    { purpose: 'Transaction Processing', description: 'To facilitate buying and selling on campus' },
    { purpose: 'Safety & Security', description: 'To verify student status and prevent fraud' },
    { purpose: 'Communication', description: 'To send important updates and notifications' },
    { purpose: 'Platform Improvement', description: 'To enhance user experience and features' }
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="5xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          textAlign="center"
          mb={8}
        >
          <Heading size="2xl" mb={4} display="flex" alignItems="center" justifyContent="center" gap={3}>
            <Shield size={32} color="#2e7d32" />
            <Box color="#2e7d32">
              Privacy Policy
            </Box>
          </Heading>
          <Text fontSize="lg" color="gray.600">
            How we protect and use your information
          </Text>
        </MotionBox>

        <Alert status="info" mb={8} borderRadius="lg" bg="blue.50" borderColor="blue.200">
          <AlertIcon color="blue.500" />
          <Box>
            <Text fontWeight="bold" color="blue.800">Your privacy matters</Text>
            <Text fontSize="sm" color="blue.700">We are committed to protecting your personal information and being transparent about our practices.</Text>
          </Box>
        </Alert>

        <VStack spacing={8} align="stretch">
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            bg={cardBg}
            p={8}
            borderRadius="xl"
            shadow="lg"
          >
            <Heading size="lg" mb={6} color="#2e7d32" display="flex" alignItems="center" gap={2}>
              <Database size={24} />
              Information We Collect
            </Heading>
            <MotionTable variant="simple" size="sm">
              <Thead bg="#e8f5e9">
                <Tr>
                  <Th color="#2e7d32">Type of Data</Th>
                  <Th color="#2e7d32">Examples</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataCollection.map((item, index) => (
                  <Tr key={index} _even={{ bg: '#f9f9f9' }}>
                    <Td fontWeight="medium" color="#2e7d32">{item.type}</Td>
                    <Td color="gray.600">{item.examples}</Td>
                  </Tr>
                ))}
              </Tbody>
            </MotionTable>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            bg={cardBg}
            p={8}
            borderRadius="xl"
            shadow="lg"
          >
            <Heading size="lg" mb={6} color="#2e7d32" display="flex" alignItems="center" gap={2}>
              <Eye size={24} />
              How We Use Your Information
            </Heading>
            <List spacing={4}>
              {dataUsage.map((item, index) => (
                <ListItem key={index} display="flex" alignItems="flex-start">
                  <ListIcon as={Shield} color="#388e3c" mt={1} />
                  <Box>
                    <Text fontWeight="bold" color="gray.800">{item.purpose}</Text>
                    <Text color="gray.600">{item.description}</Text>
                  </Box>
                </ListItem>
              ))}
            </List>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            bg={cardBg}
            p={8}
            borderRadius="xl"
            shadow="lg"
          >
            <Heading size="lg" mb={4} color="#2e7d32" display="flex" alignItems="center" gap={2}>
              <Users size={24} />
              Data Sharing & Protection
            </Heading>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2} color="#2e7d32">We Do Not Share Your Personal Data With:</Text>
                <List spacing={2} styleType="disc" pl={4} color="gray.700">
                  <ListItem>Third-party advertisers</ListItem>
                  <ListItem>External marketing companies</ListItem>
                  <ListItem>Data brokers or analytics firms</ListItem>
                </List>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2} color="#2e7d32">Limited Sharing Only For:</Text>
                <List spacing={2} styleType="disc" pl={4} color="gray.700">
                  <ListItem>Campus verification purposes</ListItem>
                  <ListItem>Legal requirements or safety issues</ListItem>
                  <ListItem>Transaction completion between users</ListItem>
                </List>
              </Box>
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            bg="#e8f5e9"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="#c8e6c9"
          >
            <Heading size="md" mb={3} color="#2e7d32">Your Rights</Heading>
            <Text color="#1b5e20" mb={3}>
              You have the right to access, correct, or delete your personal information. 
              You can also request data portability or object to certain processing activities.
            </Text>
            <Text fontSize="sm" color="#388e3c">
              Contact us at privacy@unilagyard.com for any privacy-related requests.
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;