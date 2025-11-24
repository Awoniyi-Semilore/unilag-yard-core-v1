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
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const TermsAndConditions = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using UNILAG Yard, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our platform.'
    },
    {
      title: '2. Eligibility',
      content: 'You must be a currently enrolled student at the University of Lagos with a valid student email address (@student.unilag.edu.ng). Verification is required for sellers. We reserve the right to verify student status through official channels.'
    },
    {
      title: '3. User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account. Accounts are non-transferable.'
    },
    {
      title: '4. Prohibited Activities & Items',
      content: 'You may not use the platform for any illegal purpose, harassment, or submission of false information. Prohibited items include: weapons, drugs, alcohol, stolen property, explicit content, counterfeit goods, and any items violating university policies or Nigerian laws.'
    },
    {
      title: '5. Transactions & Liability',
      content: 'UNILAG Yard acts solely as a platform connecting buyers and sellers. We are not party to any transactions and assume no liability for: product quality, transaction disputes, payment issues, or any damages arising from user interactions. All transactions are at your own risk.'
    },
    {
      title: '6. Content Responsibility',
      content: 'You are solely responsible for the accuracy, legality, and appropriateness of content you post. You grant UNILAG Yard a license to display your content on the platform. Prohibited content will be removed immediately.'
    },
    {
      title: '7. Safety Guidelines',
      content: 'All meet-ups must occur in designated public campus locations during daylight hours. Never share personal contact information before meeting. We strongly recommend cash transactions and product inspection before payment.'
    },
    {
      title: '8. Privacy & Data',
      content: 'We collect and process personal data as described in our Privacy Policy. We implement security measures but cannot guarantee absolute data security. By using the platform, you consent to our data practices.'
    },
    {
      title: '9. Intellectual Property',
      content: 'UNILAG Yard owns all platform intellectual property. Users retain ownership of their content but grant us a license to operate the platform. You may not copy, modify, or distribute platform content without permission.'
    },
    {
      title: '10. Fees & Payments',
      content: 'Buyers use the platform free of charge. Sellers pay listing fees as displayed on the Add Product page. All fees are non-refundable. We reserve the right to modify fee structures with notice.'
    },
    {
      title: '11. Termination',
      content: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in harmful behavior, or provide false information. Users may terminate their accounts through profile settings.'
    },
    {
      title: '12. Dispute Resolution',
      content: 'In case of disputes between users, we encourage amicable resolution. For platform-related issues, contact support@unilagyard.com. Legal disputes shall be governed by Nigerian law and resolved in Lagos courts.'
    },
    {
      title: '13. Platform Availability',
      content: 'We strive to maintain platform availability but do not guarantee uninterrupted service. We may perform maintenance, updates, or modifications that temporarily affect availability.'
    },
    {
      title: '14. Changes to Terms',
      content: 'We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance. Significant changes will be notified to users via email or platform notifications.'
    },
    {
      title: '15. Limitation of Liability',
      content: 'UNILAG Yard shall not be liable for any indirect, incidental, special, or consequential damages arising from platform use. Our total liability shall not exceed the amount paid by you to us in the last 6 months.'
    }
  ];

  const importantPoints = [
    'You must be a current UNILAG student with valid credentials',
    'All items must be legal, appropriate, and comply with university policies',
    'No weapons, drugs, alcohol, or illegal substances',
    'Meet only in designated public campus areas during safe hours',
    'Cash transactions strongly recommended for safety',
    'Inspect products thoroughly before payment',
    'Report suspicious activity immediately to platform and campus security',
    'Platform acts as connector only - not responsible for transactions',
    'User content must be accurate and appropriate',
    'Fees apply for sellers listing products'
  ];

  const emergencyContacts = [
    'Unilag Main Gate Security office: 08053366468',
    'UNILAG Medical Center: 08093933356, 08156857433', 
    'Platform Whatsapp Support: +2348066562051',
    'Email Support: support@unilagyard.com'
  ];

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="4xl" paddingTop="85px">
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
            <Text fontWeight="bold" color="orange.800">Important Legal Notice</Text>
            <Text fontSize="sm" color="orange.700">
              By using UNILAG Yard, you agree to these binding terms. Please read them carefully.
            </Text>
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
            <VStack spacing={8} align="stretch">
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

          {/* Important Points */}
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
              Key Requirements & Guidelines
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

          {/* Emergency Contacts */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            bg="#ffebee"
            p={6}
            borderRadius="xl"
            border="1px"
            borderColor="#ffcdd2"
          >
            <Heading size="md" mb={4} color="#d32f2f" display="flex" alignItems="center" gap={2}>
              <AlertTriangle size={20} />
              Emergency Contacts
            </Heading>
            <VStack spacing={2} align="start">
              {emergencyContacts.map((contact, index) => (
                <Text key={index} color="#c62828" fontWeight="medium" fontSize="sm">
                  {contact}
                </Text>
              ))}
            </VStack>
            <Text fontSize="xs" color="#d32f2f" mt={3}>
              In case of emergency during transactions, contact campus security immediately.
            </Text>
          </MotionBox>

          {/* Related Documents */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              <Link href="/privacy-policy" color="#1976d2" fontWeight="medium" display="flex" alignItems="center" gap={1}>
                Privacy Policy <ExternalLink size={14} />
              </Link>
              <Link href="/safety-tips" color="#1976d2" fontWeight="medium" display="flex" alignItems="center" gap={1}>
                Safety Guidelines <ExternalLink size={14} />
              </Link>
              <Link href="/faq-page" color="#1976d2" fontWeight="medium" display="flex" alignItems="center" gap={1}>
                Frequently Asked Questions <ExternalLink size={14} />
              </Link>
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            textAlign="center"
            p={6}
            bg={cardBg}
            borderRadius="lg"
          >
            <Text color="gray.600" fontSize="sm" mb={2}>
              For questions about these Terms & Conditions, contact:
            </Text>
            <Text color="#2e7d32" fontWeight="medium" fontSize="lg">
              support@unilagyard.com
            </Text>
            <Text color="gray.500" fontSize="xs" mt={2}>
              UNILAG Yard - University of Lagos Student Marketplace
            </Text>
          </MotionBox>
        </MotionVStack>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;