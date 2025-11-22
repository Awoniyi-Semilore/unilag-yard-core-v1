import React, { useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  useColorModeValue,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Shield, MapPin, Users, Eye, PhoneOff, AlertTriangle, CheckCircle, Phone } from 'lucide-react';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const SafetyTips = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Refs for scroll detection
  const mainRef = useRef(null);
  const alertRef = useRef(null);
  const tipsRef = useRef(null);
  const emergencyRef = useRef(null);
  const responseRef = useRef(null);
  
  // InView hooks
  const mainInView = useInView(mainRef, { once: false, threshold: 0.3 });
  const alertInView = useInView(alertRef, { once: false, threshold: 0.2 });
  const tipsInView = useInView(tipsRef, { once: false, threshold: 0.1 });
  const emergencyInView = useInView(emergencyRef, { once: false, threshold: 0.3 });
  const responseInView = useInView(responseRef, { once: false, threshold: 0.3 });
  
  // Animation controls
  const mainControls = useAnimation();
  const alertControls = useAnimation();
  const tipsControls = useAnimation();
  const emergencyControls = useAnimation();
  const responseControls = useAnimation();

  // Trigger animations when elements come into view
  useEffect(() => {
    if (mainInView) mainControls.start('visible');
  }, [mainInView, mainControls]);

  useEffect(() => {
    if (alertInView) alertControls.start('visible');
  }, [alertInView, alertControls]);

  useEffect(() => {
    if (tipsInView) tipsControls.start('visible');
  }, [tipsInView, tipsControls]);

  useEffect(() => {
    if (emergencyInView) emergencyControls.start('visible');
  }, [emergencyInView, emergencyControls]);

  useEffect(() => {
    if (responseInView) responseControls.start('visible');
  }, [responseInView, responseControls]);

  const safetyTips = [
    {
      icon: MapPin,
      title: 'Meet in Public Campus Locations',
      description: 'Always choose well-lit, populated areas on campus for meet-ups.',
      tips: [
        'Library steps or entrance',
        'Faculty building lobbies',
        'Student Union building',
        'Designated campus squares'
      ],
      priority: 'high'
    },
    {
      icon: Users,
      title: 'Bring a Friend',
      description: "Never meet alone, especially for high-value transactions.",
      tips: [
        'Bring a campus mate along',
        'Meet during daylight hours',
        'Inform friends of your whereabouts',
        'Use the buddy system'
      ],
      priority: 'high'
    },
    {
      icon: Eye,
      title: 'Inspect Before Paying',
      description: 'Thoroughly check items before completing the transaction.',
      tips: [
        'Test electronics thoroughly',
        'Check for damages or defects',
        'Verify authenticity of items',
        'Don\'t feel pressured to buy'
      ],
      priority: 'medium'
    },
    {
      icon: PhoneOff,
      title: 'Keep Communications On Platform',
      description: 'Avoid sharing personal contact information until you meet in person.',
      tips: [
        'Use in-app messaging only',
        'No phone number sharing',
        'No social media links',
        'Report users asking for off-platform contact'
      ],
      priority: 'high'
    },
    {
      icon: Shield,
      title: 'Verify Student Status',
      description: 'Always confirm the other party is a verified UNILAG student.',
      tips: [
        'Check verification badge',
        'Ask for UNILAG ID if unsure',
        'Report unverified users',
        'Trust your instincts'
      ],
      priority: 'medium'
    },
    {
      icon: AlertTriangle,
      title: 'Trust Your Instincts',
      description: 'If something feels wrong, it probably is. Cancel the transaction.',
      tips: [
        'Walk away if uncomfortable',
        'Report suspicious behavior',
        'Don\'t ignore red flags',
        'Your safety comes first'
      ],
      priority: 'high'
    }
  ];

  // Updated with real UNILAG emergency contacts
  const emergencyContacts = [
    { 
      name: 'UNILAG Security Control Room', 
      number: '09090678743', 
      description: '24/7 Emergency Line',
      type: 'phone'
    },
    { 
      name: 'UNILAG Health Services', 
      number: '08023256387', 
      description: 'Medical Emergencies',
      type: 'phone'
    },
    { 
      name: 'Student Affairs Division', 
      number: '+234 903 000 2000', 
      description: 'Office Hours: 8AM - 4PM',
      type: 'phone'
    },
    { 
      name: 'UNILAG Yard Support', 
      number: 'support@unilagyard.com', 
      description: 'Within 48 hours response',
      type: 'email'
    }
  ];

  const priorityColors = {
    high: '#d32f2f',
    medium: '#f57c00',
    low: '#388e3c'
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12} mt={8}> {/* Added margin top to bring it down */}
      <Container maxW="6xl">
        {/* Main Header */}
        <MotionBox
          ref={mainRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={mainControls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                duration: 0.8, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }
            }
          }}
          textAlign="center"
          mb={8}
        >
          <MotionHeading
            size="2xl"
            mb={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
            initial={{ opacity: 0, y: 30 }}
            animate={mainControls}
            variants={{
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2, duration: 0.6 }
              }
            }}
          >
            <MotionBox
              initial={{ scale: 0, rotate: -180 }}
              animate={mainControls}
              variants={{
                visible: { 
                  scale: 1, 
                  rotate: 0,
                  transition: { delay: 0.1, duration: 0.8, type: "spring" }
                }
              }}
            >
              <Shield size={32} color="#2e7d32" />
            </MotionBox>
            <Box color="#2e7d32">
              Safety Tips
            </Box>
          </MotionHeading>
          <MotionText
            fontSize="xl"
            color="gray.600"
            maxW="2xl"
            mx="auto"
            initial={{ opacity: 0, y: 20 }}
            animate={mainControls}
            variants={{
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.4, duration: 0.6 }
              }
            }}
          >
            Your safety is our top priority. Follow these guidelines to ensure secure transactions on campus.
          </MotionText>
        </MotionBox>

        {/* Emergency Alert */}
        <MotionBox
          ref={alertRef}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={alertControls}
          variants={{
            visible: { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { 
                duration: 0.6,
                type: "spring",
                stiffness: 120
              }
            }
          }}
          mb={8}
        >
          <Alert 
            status="error" 
            borderRadius="lg" 
            bg="red.50" 
            borderColor="red.200"
            py={6}
          >
            <AlertIcon color="red.500" />
            <Box>
              <Text fontWeight="bold" color="red.800" fontSize="lg">
                Emergency Situations
              </Text>
              <Text fontSize="md" color="red.700">
                If you feel unsafe or encounter an emergency, contact UNILAG security immediately using the numbers below.
              </Text>
            </Box>
          </Alert>
        </MotionBox>

        {/* Safety Tips Grid */}
        <MotionBox
          ref={tipsRef}
          initial="hidden"
          animate={tipsControls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          mb={12}
        >
          <MotionGrid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {safetyTips.map((tip, index) => (
              <MotionGridItem 
                key={index} 
                variants={{ 
                  hidden: { y: 40, opacity: 0, scale: 0.8 },
                  visible: { 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    transition: { 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 80
                    }
                  }
                }}
              >
                <MotionCard
                  bg={cardBg}
                  border="1px"
                  borderColor="gray.200"
                  shadow="xl"
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={tipsControls}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.5 }
                    }
                  }}
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={3}>
                        <MotionBox
                          p={2}
                          bg="#e8f5e9"
                          borderRadius="lg"
                          color="#2e7d32"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <tip.icon size={20} />
                        </MotionBox>
                        <Box flex={1}>
                          <HStack spacing={2} mb={1}>
                            <Text fontWeight="bold" fontSize="lg" color="#2e7d32">
                              {tip.title}
                            </Text>
                            <Badge bg={priorityColors[tip.priority]} color="white" size="sm">
                              {tip.priority.toUpperCase()}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {tip.description}
                          </Text>
                        </Box>
                      </HStack>

                      <List spacing={2}>
                        {tip.tips.map((item, tipIndex) => (
                          <MotionListItem 
                            key={tipIndex} 
                            display="flex" 
                            alignItems="flex-start"
                            initial={{ opacity: 0, x: -20 }}
                            animate={tipsControls}
                            variants={{
                              visible: { 
                                opacity: 1, 
                                x: 0,
                                transition: { delay: index * 0.1 + tipIndex * 0.05 }
                              }
                            }}
                          >
                            <ListIcon as={CheckCircle} color="#388e3c" mt={1} />
                            <Text fontSize="sm" color="gray.700">{item}</Text>
                          </MotionListItem>
                        ))}
                      </List>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </MotionGridItem>
            ))}
          </MotionGrid>
        </MotionBox>

        {/* Emergency Contacts */}
        <MotionBox
          ref={emergencyRef}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={emergencyControls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                duration: 0.8,
                type: "spring",
                stiffness: 90
              }
            }
          }}
          bg="#e8f5e9"
          p={8}
          borderRadius="xl"
          border="1px"
          borderColor="#c8e6c9"
          mb={8}
        >
          <MotionHeading
            size="lg"
            mb={6}
            color="#2e7d32"
            display="flex"
            alignItems="center"
            gap={2}
            initial={{ opacity: 0, x: -30 }}
            animate={emergencyControls}
            variants={{
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { delay: 0.2, duration: 0.6 }
              }
            }}
          >
            <AlertTriangle size={24} />
            Emergency Contacts
          </MotionHeading>
          <MotionGrid 
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
            gap={4}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate={emergencyControls}
          >
            {emergencyContacts.map((contact, index) => (
              <MotionGridItem
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.5 }
                  }
                }}
              >
                <MotionBox
                  p={5}
                  bg="white"
                  borderRadius="lg"
                  border="1px"
                  borderColor="#c8e6c9"
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "#388e3c",
                    transition: { duration: 0.2 }
                  }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={emergencyControls}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.3 + index * 0.1, duration: 0.5 }
                    }
                  }}
                >
                  <HStack spacing={3} mb={2}>
                    {contact.type === 'phone' ? (
                      <Phone size={20} color="#2e7d32" />
                    ) : (
                      <Shield size={20} color="#2e7d32" />
                    )}
                    <Text fontWeight="bold" color="#2e7d32" fontSize="lg">
                      {contact.name}
                    </Text>
                  </HStack>
                  <Text color="#388e3c" fontSize="xl" fontWeight="medium" mb={1}>
                    {contact.number}
                  </Text>
                  <Text fontSize="sm" color="#4caf50">
                    {contact.description}
                  </Text>
                </MotionBox>
              </MotionGridItem>
            ))}
          </MotionGrid>
        </MotionBox>

        {/* Response Time Info */}
        <MotionBox
          ref={responseRef}
          initial={{ opacity: 0, y: 30 }}
          animate={responseControls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.6,
                type: "spring"
              }
            }
          }}
          textAlign="center"
          p={6}
          bg="#e8f5e9"
          borderRadius="lg"
          border="1px"
          borderColor="#c8e6c9"
        >
          <MotionText
            fontWeight="bold"
            color="#2e7d32"
            mb={2}
            fontSize="lg"
            initial={{ opacity: 0, y: 20 }}
            animate={responseControls}
            variants={{
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2, duration: 0.5 }
              }
            }}
          >
            ⏰ Response Time
          </MotionText>
          <MotionText
            color="#1b5e20"
            fontSize="md"
            initial={{ opacity: 0, y: 20 }}
            animate={responseControls}
            variants={{
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.4, duration: 0.5 }
              }
            }}
          >
            For UNILAG Yard platform support issues, we aim to respond to all inquiries within 48 hours. 
            For urgent safety concerns, please use the emergency contacts above.
          </MotionText>
        </MotionBox>
      </Container>
    </Box>
  );
};

// Create motion component for ListItem
const MotionListItem = motion(ListItem);

export default SafetyTips;