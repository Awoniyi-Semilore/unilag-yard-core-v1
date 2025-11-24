import React from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  HStack,
  Tag,
  Button,
  Link,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, HelpCircle, BookOpen, Shield, CreditCard, User, ExternalLink, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionAccordion = motion(Accordion);

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle, count: 0 },
    { id: 'general', label: 'General', icon: BookOpen, count: 0 },
    { id: 'safety', label: 'Safety', icon: Shield, count: 0 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, count: 0 },
    { id: 'account', label: 'Account', icon: User, count: 0 },
    { id: 'support', label: 'Support', icon: MessageCircle, count: 0 },
  ];

  const faqs = [
    {
      question: "How do I verify my UNILAG student status to sell products?",
      answer: "To verify as a seller: 1) Submit your details on our verification page 2) We'll send a verification code to your student email (matricno@live.unilag.edu.ng) 3) Go to outlook.live.com and sign in with your student email 4) Check for our verification email and copy the code 5) Paste the code on our website to complete verification. Verification is instant and one-time only for sellers.",
      category: "account",
      tags: ["verification", "seller", "important"]
    },
    {
      question: "Do buyers need to verify their student status?",
      answer: "No, buyers only need basic sign-up and login. Student verification is only required for sellers who want to list products on the platform.",
      category: "account",
      tags: ["buyer", "verification", "account"]
    },
    {
      question: "What is UNILAG Yard?",
      answer: "UNILAG Yard is a dedicated online marketplace exclusively for University of Lagos students. It's a platform where verified UNILAG students can safely buy, sell, and trade items within the campus community. Our mission is to create a secure, convenient, and student-focused trading environment.",
      category: "general",
      tags: ["about", "platform"]
    },
    {
      question: "Is UNILAG Yard free to use?",
      answer: "For buyers: Yes, completely free! Browse and message sellers without any charges. For sellers: There's a small listing fee to post products (see pricing on the Add Product page). No commission fees on sales.",
      category: "general",
      tags: ["pricing", "free", "fees"]
    },
    {
      question: "What safety measures are in place?",
      answer: "We prioritize safety with: student verification for all sellers, requirement to meet in public campus locations only, in-app messaging system, user reporting features, and comprehensive safety guidelines. Always meet in open, public areas on campus and inspect items before payment.",
      category: "safety",
      tags: ["safety", "meetup", "verification"]
    },
    {
      question: "How do I report a suspicious user or listing?",
      answer: "Click the 'Report' button on any user profile or product listing. All reports are reviewed promptly, and we take appropriate action to maintain platform safety. For urgent issues, contact campus security using the emergency numbers on our Safety Tips page.",
      category: "safety",
      tags: ["report", "safety", "emergency"]
    },
    {
      question: "What payment methods are accepted?",
      answer: "For buyer-seller transactions: We strongly recommend CASH ONLY for safety. Meet in person in public campus locations, inspect the item thoroughly, and pay with cash after verifying the product. Never pay before seeing or receiving the product. For seller listing fees: Digital payments are accepted through our secure payment system.",
      category: "transactions",
      tags: ["payment", "cash", "safety", "fees"]
    },
    {
      question: "Can I sell digital products or services?",
      answer: "Yes! You can sell digital products like lecture notes, software, e-books, or services like tutoring, typing, graphic design, and programming. All offerings must comply with university policies and academic integrity standards. Remember to pay the required listing fee for any product or service you post.",
      category: "general",
      tags: ["digital", "services", "listing"]
    },
    {
      question: "How long do listings stay active?",
      answer: "Product listings remain active for 30 days automatically. You can manually renew them for another 30 days if the item hasn't sold. This helps keep the marketplace fresh and relevant for all users.",
      category: "general",
      tags: ["listings", "duration", "renewal"]
    },
    {
      question: "What should I do if a transaction goes wrong?",
      answer: "1) Immediately report the issue through our platform's reporting system 2) Take photos as evidence if possible 3) Contact campus security using the emergency numbers on our Safety Tips page if you feel unsafe 4) For platform-related issues, contact our support via WhatsApp or email through the Contact page",
      category: "safety",
      tags: ["dispute", "emergency", "support"]
    },
    {
      question: "How do I delete my account?",
      answer: "Go to your Profile > Settings > Delete Account. This action is permanent and will remove all your listings, messages, and data from our platform. If you have active listings, make sure to remove them first or inform your potential buyers.",
      category: "account",
      tags: ["account", "delete", "settings"]
    },
    {
      question: "Are there prohibited items I cannot sell?",
      answer: "Yes. Prohibited items include: weapons, drugs, alcohol, stolen property, explicit content, counterfeit goods, and any items violating university policies or Nigerian laws. We reserve the right to remove any listing that violates our terms of service.",
      category: "general",
      tags: ["prohibited", "rules", "guidelines"]
    },
    {
      question: "Who can use UNILAG Yard?",
      answer: "UNILAG Yard is exclusively for current University of Lagos students. Both undergraduate and postgraduate students can join as buyers. To become a seller, you must complete the student verification process using your official UNILAG student email.",
      category: "account",
      tags: ["eligibility", "students", "verification"]
    },
    {
      question: "What makes UNILAG Yard different from other marketplaces?",
      answer: "UNILAG Yard is specifically designed for the UNILAG community with campus-focused safety features, student verification for sellers, and understanding of campus dynamics. We're built to serve UNILAG students specifically, ensuring relevance to campus life and needs.",
      category: "general",
      tags: ["unique", "campus", "community"]
    },
    {
      question: "How do I get help if I have problems with the platform?",
      answer: "For any platform issues or questions: 1) Use our WhatsApp support: +2348066562051 2) Email us at support@unilagyard.com 3) Visit our Contact page for more options. We're here to help with any technical issues or platform-related questions.",
      category: "support",
      tags: ["help", "support", "contact", "whatsapp"]
    },
    {
      question: "Does UNILAG Yard handle the products or money between buyers and sellers?",
      answer: "No, UNILAG Yard only facilitates the connection between buyers and sellers. We do not handle products, money, or mediate transactions. Our role is to provide a safe platform for UNILAG students to connect. All transactions are directly between buyers and sellers, and we strongly recommend cash payments upon product inspection.",
      category: "transactions",
      tags: ["transactions", "money", "products", "safety"]
    }
  ];

  // Calculate category counts
  categories.forEach(cat => {
    if (cat.id === 'all') {
      cat.count = faqs.length;
    } else {
      cat.count = faqs.filter(faq => faq.category === cat.id).length;
    }
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Helper function to get tag color
  const getTagColor = (tag) => {
    const colorMap = {
      'important': { bg: '#ffebee', color: '#d32f2f' },
      'verification': { bg: '#e3f2fd', color: '#1565c0' },
      'seller': { bg: '#e8f5e9', color: '#2e7d32' },
      'buyer': { bg: '#fff3e0', color: '#ef6c00' },
      'safety': { bg: '#fff8e1', color: '#ff8f00' },
      'emergency': { bg: '#ffebee', color: '#c62828' },
      'support': { bg: '#e3f2fd', color: '#1565c0' },
      'whatsapp': { bg: '#e8f5e9', color: '#2e7d32' },
      'default': { bg: '#f5f5f5', color: '#666666' }
    };
    
    return colorMap[tag] || colorMap.default;
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12} mt={8}>
      <Container maxW="4xl" paddingTop="30px">
        {/* About UNILAG Yard Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          mb={12}
          p={8}
          bg="#e8f5e9"
          borderRadius="xl"
          border="1px"
          borderColor="#c8e6c9"
        >
          <VStack spacing={4} align="start">
            <Heading size="xl" color="#2e7d32">
              About UNILAG Yard
            </Heading>
            <Text fontSize="lg" color="#1b5e20" lineHeight="tall">
              UNILAG Yard is a student-focused online marketplace created exclusively for the University of Lagos community. 
              Our mission is to provide a safe, convenient, and trusted platform where UNILAG students can buy, sell, 
              and trade items within the campus environment.
            </Text>
            <Text fontSize="md" color="#388e3c" lineHeight="tall">
              Built with the unique needs of campus life in mind, we're committed to enhancing student interactions 
              while maintaining the highest safety standards. While currently operated by a dedicated UNILAG student, 
              the platform is designed to serve and grow with the entire UNILAG community.
            </Text>
            <HStack spacing={4} mt={2}>
              <Tag bg="#2e7d32" color="white" size="lg">Verified Students</Tag>
              <Tag bg="#2e7d32" color="white" size="lg">Campus-Focused</Tag>
              <Tag bg="#2e7d32" color="white" size="lg">Free for Buyers</Tag>
              <Tag bg="#2e7d32" color="white" size="lg">Secure Platform</Tag>
            </HStack>
          </VStack>
        </MotionBox>

        {/* FAQ Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          textAlign="center"
          mb={8}
        >
          <Heading size="2xl" mb={4} color="#2e7d32">
            Frequently Asked Questions
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            Find quick answers to common questions about UNILAG Yard
          </Text>

          <InputGroup maxW="400px" mx="auto" mb={8}>
            <InputLeftElement pointerEvents="none">
              <Search color="#A0AEC0" />
            </InputLeftElement>
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
              bg={cardBg}
            />
          </InputGroup>

          <HStack spacing={2} justify="center" flexWrap="wrap">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Tag
                  key={category.id}
                  size="lg"
                  variant={activeCategory === category.id ? "solid" : "outline"}
                  bg={activeCategory === category.id ? "#388e3c" : "transparent"}
                  color={activeCategory === category.id ? "white" : "#388e3c"}
                  borderColor="#388e3c"
                  cursor="pointer"
                  onClick={() => setActiveCategory(category.id)}
                  _hover={{ 
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={1}>
                    <IconComponent size={16} />
                    <Text>{category.label}</Text>
                    <Text fontSize="sm" opacity={0.7}>({category.count})</Text>
                  </HStack>
                </Tag>
              );
            })}
          </HStack>
        </MotionBox>

        {/* FAQ Accordion */}
        <MotionAccordion
          allowMultiple
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <MotionBox
                key={index}
                variants={itemVariants}
                layout
                mb={4}
              >
                <AccordionItem
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px"
                  borderColor="gray.200"
                  overflow="hidden"
                  shadow="md"
                  _hover={{ shadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <h2>
                    <AccordionButton
                      py={4}
                      px={6}
                      _hover={{ bg: '#f5f5f5' }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="semibold" fontSize="lg" color="#2e7d32">
                          {faq.question}
                        </Text>
                        <HStack spacing={2} mt={1}>
                          {faq.tags.map((tag, tagIndex) => {
                            const tagColor = getTagColor(tag);
                            return (
                              <Tag 
                                key={tagIndex} 
                                size="sm" 
                                bg={tagColor.bg} 
                                color={tagColor.color} 
                                variant="subtle"
                              >
                                {tag}
                              </Tag>
                            );
                          })}
                        </HStack>
                      </Box>
                      <AccordionIcon color="#388e3c" />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} px={6}>
                    <Text color="gray.700" lineHeight="tall" whiteSpace="pre-line">
                      {faq.answer}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </MotionBox>
            ))}
          </AnimatePresence>
        </MotionAccordion>

        {/* No Results Message */}
        {filteredFaqs.length === 0 && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            textAlign="center"
            py={12}
          >
            <HelpCircle size={64} color="#CBD5E0" />
            <Text fontSize="xl" color="gray.500" mt={4}>
              No questions found matching your search
            </Text>
            <Text color="gray.400">
              Try different keywords or browse all categories
            </Text>
          </MotionBox>
        )}

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          textAlign="center"
          mt={12}
          p={6}
          bg="#e8f5e9"
          borderRadius="lg"
          border="1px"
          borderColor="#c8e6c9"
        >
          <Text fontWeight="bold" color="#2e7d32" mb={2} fontSize="lg">
            Still have questions?
          </Text>
          <Text color="#388e3c" mb={4}>
            We're here to help! Get in touch with our support team.
          </Text>
          <Button
            as={Link}
            href="/contact"
            bg="#388e3c"
            color="white"
            _hover={{ 
              bg: '#2e7d32',
              textDecoration: 'none',
              transform: 'translateY(-2px)'
            }}
            rightIcon={<ExternalLink size={16} />}
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}
            transition="all 0.3s"
          >
            Visit Contact Page
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default FAQPage;