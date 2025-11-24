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
  Link,
  Button,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Shield, Eye, Users, Database, Download, Clock, Mail, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionTable = motion(Table);

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const dataCollection = [
    { type: 'Personal Information', examples: 'Name, UNILAG ID, Email, Phone Number, Student Verification Data' },
    { type: 'Transaction Data', examples: 'Purchase history, messages, saved items, listing information' },
    { type: 'Usage Data', examples: 'IP address, browser type, pages visited, click patterns, session duration' },
    { type: 'Device Information', examples: 'Device type, operating system, app version, unique device identifiers' },
    { type: 'Location Data', examples: 'General location for campus verification, meet-up locations (optional)' }
  ];

  const dataUsage = [
    { purpose: 'Account Management', description: 'To create and maintain your student account, verify UNILAG student status' },
    { purpose: 'Transaction Processing', description: 'To facilitate buying and selling, connect buyers and sellers safely' },
    { purpose: 'Safety & Security', description: 'To prevent fraud, verify identities, and maintain platform integrity' },
    { purpose: 'Communication', description: 'To send transaction updates, security alerts, and platform notifications' },
    { purpose: 'Platform Improvement', description: 'To analyze usage patterns and enhance user experience' },
    { purpose: 'Legal Compliance', description: 'To meet regulatory requirements and respond to legal requests' }
  ];

  const dataRetention = [
    { dataType: 'Account Information', retention: 'Until account deletion + 30 days' },
    { dataType: 'Transaction Records', retention: '3 years for legal and dispute resolution' },
    { dataType: 'Messages & Chats', retention: '2 years from last activity' },
    { dataType: 'Usage Analytics', retention: '1 year in aggregated form' },
    { dataType: 'Verification Data', retention: 'Duration of account + 1 year' }
  ];

  const userRights = [
    { right: 'Access', description: 'View all personal data we hold about you', icon: Eye },
    { right: 'Correction', description: 'Update or correct inaccurate information', icon: Shield },
    { right: 'Deletion', description: 'Request deletion of your personal data', icon: Trash2 },
    { right: 'Portability', description: 'Download your data in readable format', icon: Download },
    { right: 'Objection', description: 'Object to certain data processing activities', icon: Users }
  ];

  const handleDataRequest = (type) => {
    // In a real app, this would trigger an API call
    const emailSubject = encodeURIComponent(`Data ${type} Request - UNILAG Yard`);
    const emailBody = encodeURIComponent(`Dear UNILAG Yard Team,\n\nI would like to ${type.toLowerCase()} my personal data.\n\nPlease process this request and contact me for verification.\n\nThank you.`);
    window.location.href = `mailto:privacy@unilagyard.com?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="5xl" paddingTop="70px">
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
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </MotionBox>

        <Alert status="info" mb={8} borderRadius="lg" bg="blue.50" borderColor="blue.200">
          <AlertIcon color="blue.500" />
          <Box>
            <Text fontWeight="bold" color="blue.800">Your Privacy Matters</Text>
            <Text fontSize="sm" color="blue.700">
              We are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
            </Text>
          </Box>
        </Alert>

        <VStack spacing={8} align="stretch">
          {/* Information Collection */}
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
                  <Th color="#2e7d32">Examples & Purpose</Th>
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

          {/* Data Usage */}
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

          {/* Data Sharing & Protection */}
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
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={3} color="#2e7d32">We Do Not Share Your Personal Data With:</Text>
                <List spacing={2} styleType="disc" pl={4} color="gray.700">
                  <ListItem>Third-party advertisers or marketing companies</ListItem>
                  <ListItem>Data brokers, analytics firms, or external partners</ListItem>
                  <ListItem>Any entity outside the UNILAG community without consent</ListItem>
                </List>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={3} color="#2e7d32">Limited Sharing Only For:</Text>
                <List spacing={2} styleType="disc" pl={4} color="gray.700">
                  <ListItem>Campus verification and student status confirmation</ListItem>
                  <ListItem>Legal requirements, court orders, or safety emergencies</ListItem>
                  <ListItem>Transaction completion between verified UNILAG students</ListItem>
                  <ListItem>Platform security and fraud prevention measures</ListItem>
                </List>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={3} color="#2e7d32">Data Security Measures:</Text>
                <List spacing={2} styleType="disc" pl={4} color="gray.700">
                  <ListItem>Encryption of sensitive data in transit and at rest</ListItem>
                  <ListItem>Regular security audits and vulnerability assessments</ListItem>
                  <ListItem>Access controls and authentication protocols</ListItem>
                  <ListItem>Secure data storage with limited access permissions</ListItem>
                </List>
              </Box>
            </VStack>
          </MotionBox>

          {/* Data Retention */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            bg={cardBg}
            p={8}
            borderRadius="xl"
            shadow="lg"
          >
            <Heading size="lg" mb={6} color="#2e7d32" display="flex" alignItems="center" gap={2}>
              <Clock size={24} />
              Data Retention Periods
            </Heading>
            <MotionTable variant="simple" size="sm">
              <Thead bg="#e8f5e9">
                <Tr>
                  <Th color="#2e7d32">Type of Data</Th>
                  <Th color="#2e7d32">Retention Period</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataRetention.map((item, index) => (
                  <Tr key={index} _even={{ bg: '#f9f9f9' }}>
                    <Td fontWeight="medium" color="#2e7d32">{item.dataType}</Td>
                    <Td color="gray.600">{item.retention}</Td>
                  </Tr>
                ))}
              </Tbody>
            </MotionTable>
          </MotionBox>

          {/* User Rights */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            bg="#e8f5e9"
            p={8}
            borderRadius="xl"
            border="1px"
            borderColor="#c8e6c9"
          >
            <Heading size="lg" mb={6} color="#2e7d32">Your Privacy Rights</Heading>
            <VStack spacing={4} align="stretch" mb={6}>
              {userRights.map((right, index) => {
                const IconComponent = right.icon;
                return (
                  <Box key={index} p={4} bg="white" borderRadius="lg" shadow="sm">
                    <HStack spacing={3}>
                      <IconComponent size={20} color="#2e7d32" />
                      <Box>
                        <Text fontWeight="bold" color="#2e7d32">{right.right}</Text>
                        <Text color="gray.600" fontSize="sm">{right.description}</Text>
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>

            {/* <Text fontWeight="bold" mb={3} color="#2e7d32">Exercise Your Rights:</Text>
            <HStack spacing={3} flexWrap="wrap">
              <Button 
                colorScheme="green" 
                size="sm"
                onClick={() => handleDataRequest('Access')}
                leftIcon={<Eye size={16} />}
              >
                Request Data Access
              </Button>
              <Button 
                colorScheme="blue" 
                size="sm"
                onClick={() => handleDataRequest('Download')}
                leftIcon={<Download size={16} />}
              >
                Download My Data
              </Button>
              <Button 
                colorScheme="red" 
                size="sm"
                onClick={() => handleDataRequest('Delete')}
                leftIcon={<Trash2 size={16} />}
              >
                Request Deletion
              </Button>
            </HStack> */}
          </MotionBox>

          {/* Contact & Updates */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            bg={cardBg}
            p={6}
            borderRadius="xl"
            shadow="md"
          >
            <VStack spacing={4} align="center">
              <Heading size="md" color="#2e7d32" display="flex" alignItems="center" gap={2}>
                <Mail size={20} />
                Contact & Updates
              </Heading>
              <Text color="gray.600" textAlign="center">
                For privacy-related inquiries or to exercise your rights, contact our Data Protection Officer at:
              </Text>
              <Text color="#2e7d32" fontWeight="bold" fontSize="lg">
                privacy@unilagyard.com
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                We will respond to all legitimate requests within 30 days. 
                This policy may be updated periodically. Continued use of UNILAG Yard constitutes acceptance of changes.
              </Text>
              <Button 
                colorScheme="green" 
                variant="outline"
                onClick={() => navigate('/contact')}
              >
                Visit Contact Page
              </Button>
            </VStack>
          </MotionBox>

          {/* Related Documents */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            bg="#e3f2fd"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="#bbdefb"
          >
            <Heading size="md" mb={4} color="#1565c0">
              Related Documents
            </Heading>
            <VStack spacing={2} align="start">
              <Link href="/terms" color="#1976d2" fontWeight="medium">
                Terms & Conditions
              </Link>
              <Link href="/safety-tips" color="#1976d2" fontWeight="medium">
                Safety Guidelines
              </Link>
              <Link href="/faq" color="#1976d2" fontWeight="medium">
                Frequently Asked Questions
              </Link>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;