import React, { useRef, useEffect, useState } from 'react';
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
  useColorModeValue,
  HStack,
  Button,
  Badge,
} from '@chakra-ui/react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { UserPlus, Search, MessageCircle, Handshake, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const HowItWorks = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Refs for scroll detection
  const mainRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // InView hooks
  const mainInView = useInView(mainRef, { once: false, threshold: 0.3 });
  const featuresInView = useInView(featuresRef, { once: false, threshold: 0.2 });
  const stepsInView = useInView(stepsRef, { once: false, threshold: 0.1 });
  const ctaInView = useInView(ctaRef, { once: false, threshold: 0.3 });
  
  // Animation controls
  const mainControls = useAnimation();
  const featuresControls = useAnimation();
  const stepsControls = useAnimation();
  const ctaControls = useAnimation();

  // Trigger animations when elements come into view
  useEffect(() => {
    if (mainInView) mainControls.start('visible');
  }, [mainInView, mainControls]);

  useEffect(() => {
    if (featuresInView) featuresControls.start('visible');
  }, [featuresInView, featuresControls]);

  useEffect(() => {
    if (stepsInView) stepsControls.start('visible');
  }, [stepsInView, stepsControls]);

  useEffect(() => {
    if (ctaInView) ctaControls.start('visible');
  }, [ctaInView, ctaControls]);

  const steps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up with your UNILAG student email and verify your student status.',
      details: [
        'Use your @student.unilag.edu.ng email',
        'Complete student verification',
        'Set up your profile',
        'Get verified badge'
      ],
      duration: '2 minutes',
      userType: ['buyer', 'seller']
    },
    {
      step: 2,
      icon: Search,
      title: 'Browse or List Items',
      description: 'Find what you need or sell what you don\'t use anymore.',
      details: [
        'Search by category or keyword',
        'Filter by price and location',
        'Upload clear product photos',
        'Write detailed descriptions'
      ],
      duration: '5 minutes',
      userType: ['buyer', 'seller', 'guest']
    },
    {
      step: 3,
      icon: MessageCircle,
      title: 'Connect & Message',
      description: 'Chat with buyers or sellers through our secure messaging system.',
      details: [
        'Use suggested messages',
        'Discuss meet-up details',
        'Ask questions about items',
        'Agree on price and location'
      ],
      duration: 'Flexible',
      userType: ['buyer', 'seller']
    },
    {
      step: 4,
      icon: Handshake,
      title: 'Meet Safely on Campus',
      description: 'Complete transactions in designated public campus locations.',
      details: [
        'Choose public meet-up spots',
        'Inspect items before paying',
        'Use cash for transactions',
        'Bring a friend along'
      ],
      duration: '15-30 minutes',
      userType: ['buyer', 'seller']
    },
    {
      step: 5,
      icon: Star,
      title: 'Rate & Review',
      description: 'Share your experience and help build our trusted community.',
      details: [
        'Leave honest feedback',
        'Rate transaction experience',
        'Help other students',
        'Build your reputation'
      ],
      duration: '2 minutes',
      userType: ['buyer', 'seller']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: '100% Verified UNILAG Students',
      description: 'Every seller is verified as a UNILAG student for your safety'
    },
    {
      icon: '💰',
      title: 'No Fees Ever',
      description: 'Free to use - no listing fees, commission, or hidden charges'
    },
    {
      icon: '📱',
      title: 'Campus-Focused',
      description: 'Designed specifically for UNILAG campus community'
    },
    {
      icon: '🛡️',
      title: 'Safety First',
      description: 'Built-in safety features and campus security integration'
    }
  ];

  const userTypes = [
    {
      type: 'buyer',
      title: 'For Buyers',
      description: 'Find great deals from verified UNILAG students',
      color: '#2e7d32',
      steps: [1, 2, 3, 4, 5]
    },
    {
      type: 'seller',
      title: 'For Sellers',
      description: 'Sell your items safely to fellow UNILAG students',
      color: '#1976d2',
      steps: [1, 2, 3, 4, 5]
    },
    {
      type: 'guest',
      title: 'For Guest Users',
      description: 'Browse items without creating an account',
      color: '#ed6c02',
      steps: [2]
    }
  ];

  // Helper function to render feature icons
  const renderFeatureIcon = (icon) => {
    if (typeof icon === 'string') {
      return <Text fontSize="3xl" mb={3}>{icon}</Text>;
    } else {
      const IconComponent = icon;
      return <IconComponent size={32} color="#2e7d32" mb={3} />;
    }
  };

  const getStepColor = (userTypes, stepNumber) => {
    const applicableTypes = userTypes.filter(type => type.steps.includes(stepNumber));
    if (applicableTypes.length === 3) return '#2e7d32'; // All types
    if (applicableTypes.length === 2) {
      if (applicableTypes.find(t => t.type === 'buyer') && applicableTypes.find(t => t.type === 'seller')) {
        return '#2e7d32'; // Buyers & Sellers
      }
    }
    return applicableTypes[0]?.color || '#2e7d32';
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
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
          mb={12}
        >
          <MotionHeading
            size="2xl"
            mb={4}
            color="#2e7d32"
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
            How UNILAG Yard Works
          </MotionHeading>
          <MotionText
            fontSize="xl"
            color="gray.600"
            maxW="2xl"
            mx="auto"
            mb={6}
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
            Buying and selling on campus has never been easier. Follow these simple steps to get started.
          </MotionText>
          
          <HStack spacing={4} justify="center">
            <Button 
              bg="#388e3c"
              color="white"
              size="lg"
              onClick={() => navigate('/home')}
              _hover={{ bg: '#2e7d32', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              color="#388e3c"
              borderColor="#388e3c"
              onClick={() => navigate('/safety-tips')}
              _hover={{ bg: '#e8f5e9', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
            >
              Safety Tips
            </Button>
          </HStack>
        </MotionBox>

        {/* User Types Section */}
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          animate={mainControls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.6, duration: 0.6 }
            }
          }}
          mb={16}
        >
          <Heading size="lg" textAlign="center" mb={8} color="#2e7d32">
            Designed for Everyone
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {userTypes.map((userType, index) => (
              <MotionCard
                key={userType.type}
                bg={cardBg}
                shadow="lg"
                borderTop="4px"
                borderColor={userType.color}
                initial={{ opacity: 0, y: 30 }}
                animate={mainControls}
                variants={{
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.8 + index * 0.1, duration: 0.5 }
                  }
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <CardBody textAlign="center" p={6}>
                  <Heading size="md" mb={3} color={userType.color}>
                    {userType.title}
                  </Heading>
                  <Text color="gray.600" mb={4}>
                    {userType.description}
                  </Text>
                  <Badge colorScheme={
                    userType.type === 'buyer' ? 'green' : 
                    userType.type === 'seller' ? 'blue' : 'orange'
                  }>
                    {userType.steps.length} steps applicable
                  </Badge>
                </CardBody>
              </MotionCard>
            ))}
          </Grid>
        </MotionBox>

        {/* Features Grid */}
        <MotionBox
          ref={featuresRef}
          initial="hidden"
          animate={featuresControls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          mb={16}
        >
          <MotionGrid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={6}
          >
            {features.map((feature, index) => (
              <MotionGridItem 
                key={index} 
                variants={{ 
                  hidden: { y: 40, opacity: 0, rotateX: 90 },
                  visible: { 
                    y: 0, 
                    opacity: 1, 
                    rotateX: 0,
                    transition: { 
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                <MotionCard 
                  bg={cardBg} 
                  shadow="md" 
                  h="100%"
                  whileHover={{ 
                    y: -10,
                    rotateZ: [0, -1, 1, -1, 0],
                    transition: { duration: 0.5 }
                  }}
                  transition="all 0.3s"
                >
                  <CardBody textAlign="center" p={6}>
                    {renderFeatureIcon(feature.icon)}
                    <Text fontWeight="bold" mb={2} color="#2e7d32">{feature.title}</Text>
                    <Text fontSize="sm" color="gray.600">{feature.description}</Text>
                  </CardBody>
                </MotionCard>
              </MotionGridItem>
            ))}
          </MotionGrid>
        </MotionBox>

        {/* Steps */}
        <Box ref={stepsRef}>
          <VStack spacing={8} align="stretch">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const stepColor = getStepColor(userTypes, step.step);
              
              return (
                <MotionBox
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 }}
                  animate={stepsControls}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      x: 0, 
                      scale: 1,
                      transition: { 
                        duration: 0.7, 
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 80
                      }
                    }
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1 
                  }}
                  viewport={{ once: false, threshold: 0.1 }}
                >
                  <MotionCard 
                    bg={cardBg} 
                    shadow="lg" 
                    border="1px" 
                    borderColor="gray.200"
                    whileHover={{ 
                      scale: 1.02,
                      shadow: '2xl',
                      transition: { duration: 0.3 }
                    }}
                    transition="all 0.3s"
                  >
                    <CardBody p={8}>
                      <Grid templateColumns={{ base: '1fr', lg: 'auto 1fr' }} gap={8} alignItems="center">
                        <GridItem>
                          <MotionBox
                            position="relative"
                            width="120px"
                            height="120px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Box
                              position="absolute"
                              width="100%"
                              height="100%"
                              bg={`${stepColor}20`}
                              borderRadius="full"
                              opacity={0.2}
                            />
                            <MotionBox
                              width="80px"
                              height="80px"
                              bg={stepColor}
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              color="white"
                              fontWeight="bold"
                              fontSize="xl"
                              position="relative"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <IconComponent size={32} />
                            </MotionBox>
                            <Badge
                              position="absolute"
                              top={2}
                              right={2}
                              bg={stepColor}
                              color="white"
                              borderRadius="full"
                              px={2}
                            >
                              Step {step.step}
                            </Badge>
                          </MotionBox>
                        </GridItem>
                        
                        <GridItem>
                          <VStack spacing={4} align="start">
                            <Box>
                              <HStack spacing={3} mb={2} flexWrap="wrap">
                                <Heading size="lg" color={stepColor}>
                                  {step.title}
                                </Heading>
                                <Badge bg={`${stepColor}20`} color={stepColor} variant="subtle">
                                  {step.duration}
                                </Badge>
                                <HStack spacing={1}>
                                  {userTypes.map(type => 
                                    type.steps.includes(step.step) && (
                                      <Badge 
                                        key={type.type}
                                        colorScheme={
                                          type.type === 'buyer' ? 'green' : 
                                          type.type === 'seller' ? 'blue' : 'orange'
                                        }
                                        variant="subtle"
                                      >
                                        {type.type}
                                      </Badge>
                                    )
                                  )}
                                </HStack>
                              </HStack>
                              <Text fontSize="lg" color="gray.600" mb={4}>
                                {step.description}
                              </Text>
                            </Box>
                            
                            <VStack spacing={2} align="start">
                              {step.details.map((detail, detailIndex) => (
                                <MotionHStack 
                                  key={detailIndex} 
                                  spacing={2}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={stepsControls}
                                  variants={{
                                    visible: { 
                                      opacity: 1, 
                                      x: 0,
                                      transition: { delay: index * 0.2 + detailIndex * 0.1 }
                                    }
                                  }}
                                >
                                  <Box
                                    width="6px"
                                    height="6px"
                                    bg={stepColor}
                                    borderRadius="full"
                                  />
                                  <Text color="gray.700">{detail}</Text>
                                </MotionHStack>
                              ))}
                            </VStack>
                          </VStack>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </MotionCard>
                </MotionBox>
              );
            })}
          </VStack>
        </Box>

        {/* CTA Section */}
        <MotionBox
          ref={ctaRef}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={ctaControls}
          variants={{
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }
            }
          }}
          textAlign="center"
          mt={16}
          p={8}
          bg="#e8f5e9"
          borderRadius="xl"
          border="1px"
          borderColor="#c8e6c9"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          <MotionHeading
            size="lg"
            mb={4}
            color="#2e7d32"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaControls}
            variants={{
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2, duration: 0.6 }
              }
            }}
          >
            Ready to Get Started?
          </MotionHeading>
          <MotionText
            color="#1b5e20"
            mb={6}
            fontSize="lg"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaControls}
            variants={{
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.4, duration: 0.6 }
              }
            }}
          >
            Join thousands of UNILAG students buying and selling on campus safely.
          </MotionText>
          <HStack spacing={4} justify="center">
            <Button 
              bg="#388e3c"
              color="white"
              size="lg"
              onClick={() => navigate('/home')}
              _hover={{ bg: '#2e7d32', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
            >
              Explore Home
            </Button>
            <Button 
              variant="outline"
              color="#388e3c"
              borderColor="#388e3c"
              size="lg"
              onClick={() => navigate('/add-product')}
              _hover={{ bg: '#e8f5e9', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
            >
              Add Your Product
            </Button>
          </HStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default HowItWorks;