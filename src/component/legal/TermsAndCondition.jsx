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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const TermsAndConditions = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using UNILAG Yard, you accept and agree to be bound by the terms and provision of this agreement.'
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily use UNILAG Yard for personal, non-commercial transitory viewing only.'
    },
    {
      title: '3. User Accounts',
      content: 'You must be a verified UNILAG student to create an account. You are responsible for maintaining the confidentiality of your account.'
    },
    {
      title: '4. Prohibited Activities',
      content: 'You may not use the platform for any illegal purpose, to harass others, or to submit false information.'
    },
    {
      title: '5. Transactions',
      content: 'All transactions are between buyers and sellers. UNILAG Yard acts as a platform and is not responsible for transaction disputes.'
    },
    {
      title: '6. Content Responsibility',
      content: 'You are solely responsible for the content you post, including its accuracy, legality, and appropriateness.'
    },
    {
      title: '7. Safety Guidelines',
      content: 'All meet-ups must occur in public campus locations. Never share personal contact information before meeting.'
    },
    {
      title: '8. Termination',
      content: 'We reserve the right to terminate accounts that violate these terms or engage in harmful behavior.'
    },
    {
      title: '9. Changes to Terms',
      content: 'We may modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.'
    }
  ];

  const importantPoints = [
    'You must be a current UNILAG student',
    'All items must be legal and appropriate for campus',
    'No weapons, drugs, or illegal substances',
    'Meet only in designated public campus areas',
    'Cash transactions recommended for safety',
    'Report suspicious activity immediately'
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="4xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          textAlign="center"
          mb={8}
        >
          <Heading size="2xl" mb={4} color="#2e7d32">
            Terms & Conditions
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </MotionBox>

        <Alert status="warning" mb={8} borderRadius="lg" bg="orange.50" borderColor="orange.200">
          <AlertIcon color="orange.500" />
          <Box>
            <Text fontWeight="bold" color="orange.800">Please read carefully</Text>
            <Text fontSize="sm" color="orange.700">By using UNILAG Yard, you agree to these terms and conditions.</Text>
          </Box>
        </Alert>

        <MotionVStack
          spacing={8}
          align="stretch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box bg={cardBg} p={8} borderRadius="xl" shadow="lg">
            <VStack spacing={6} align="stretch">
              {sections.map((section, index) => (
                <MotionBox
                  key={section.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Heading size="md" color="#2e7d32" mb={3}>
                    {section.title}
                  </Heading>
                  <Text color="gray.700" lineHeight="tall">
                    {section.content}
                  </Text>
                </MotionBox>
              ))}
            </VStack>
          </Box>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            bg="#e8f5e9"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="#c8e6c9"
          >
            <Heading size="lg" mb={4} color="#2e7d32" display="flex" alignItems="center" gap={2}>
              <AlertTriangle size={24} />
              Important Points
            </Heading>
            <List spacing={3}>
              {importantPoints.map((point, index) => (
                <ListItem key={index} display="flex" alignItems="flex-start">
                  <ListIcon as={CheckCircle} color="#388e3c" mt={1} />
                  <Text color="#1b5e20" fontWeight="medium">{point}</Text>
                </ListItem>
              ))}
            </List>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            textAlign="center"
            p={6}
          >
            <Text color="gray.600" fontSize="sm">
              If you have any questions about these Terms & Conditions, please contact us at{' '}
              <Text as="span" color="#2e7d32" fontWeight="medium">support@unilagyard.com</Text>
            </Text>
          </MotionBox>
        </MotionVStack>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;