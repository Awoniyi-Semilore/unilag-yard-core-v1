import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Grid,
  GridItem,
  Card,
  CardBody,
  Icon,
  Heading,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ExternalLink } from 'lucide-react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);
const MotionVStack = motion(VStack);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Refs for scroll animations
  const mainRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  
  // InView hooks
  const mainInView = useInView(mainRef, { once: false, threshold: 0.3 });
  const formInView = useInView(formRef, { once: false, threshold: 0.2 });
  const infoInView = useInView(infoRef, { once: false, threshold: 0.2 });
  
  // Animation controls
  const mainControls = useAnimation();
  const formControls = useAnimation();
  const infoControls = useAnimation();

  // Trigger animations when elements come into view
  useEffect(() => {
    if (mainInView) mainControls.start('visible');
  }, [mainInView, mainControls]);

  useEffect(() => {
    if (formInView) formControls.start('visible');
  }, [formInView, formControls]);

  useEffect(() => {
    if (infoInView) infoControls.start('visible');
  }, [infoInView, infoControls]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call - Replace this with actual email service integration
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual email service integration
      // For now, we'll show a success message
      toast({
        title: "Message Received!",
        description: "We've got your message and will respond within 24 hours.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Please try again or contact us via WhatsApp.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const openWhatsApp = () => {
    const message = "Hello! I'd like to get more information about UNILAG Yard. Please provide me with the details I need.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348066562051?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'support@unilagyard.com',
      subtitle: 'We\'ll reply within 24 hours',
      action: () => window.location.href = 'mailto:support@unilagyard.com'
    },
    {
      icon: Phone,
      title: 'WhatsApp Us',
      description: '+234 806 656 2051',
      subtitle: 'Message only - No calls please',
      action: openWhatsApp,
      isWhatsApp: true
    },
    {
      icon: MapPin,
      title: 'Digital Campus',
      description: 'University of Lagos',
      subtitle: 'Currently operating online',
      action: null
    },
    {
      icon: Clock,
      title: 'Response Time',
      description: 'Within 24 Hours',
      subtitle: 'For all inquiries',
      action: null
    }
  ];

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box minH="100vh" py={8} mt={8}> {/* Added margin top to bring it down */}
      <Container maxW="7xl">
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
            Get In Touch
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
            Have questions about UNILAG Yard? We're here to help and would love to hear from you.
          </MotionText>
        </MotionBox>

        <MotionGrid 
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }} 
          gap={8} 
          mb={12}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Form */}
          <MotionGridItem
            ref={formRef}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { 
                  duration: 0.7,
                  type: "spring",
                  stiffness: 80
                }
              }
            }}
          >
            <MotionCard
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              shadow="xl"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={formControls}
              variants={{
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.2, duration: 0.6 }
                }
              }}
            >
              <CardBody p={8}>
                <MotionVStack spacing={6} align="stretch">
                  <Box>
                    <HStack spacing={3} mb={2}>
                      <Icon as={MessageCircle} w={6} h={6} color="#2e7d32" />
                      <Text fontSize="2xl" fontWeight="bold">Send us a Message</Text>
                    </HStack>
                    <Text color="gray.600">Fill out the form and our team will get back to you ASAP</Text>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={formControls}
                        variants={{
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: 0.3, duration: 0.5 }
                          }
                        }}
                        w="full"
                      >
                        <FormControl isInvalid={errors.name}>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            size="lg"
                            borderColor={borderColor}
                            _focus={{ borderColor: '#388e3c', boxShadow: '0 0 0 1px #388e3c' }}
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>
                      </MotionBox>

                      <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={formControls}
                        variants={{
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: 0.4, duration: 0.5 }
                          }
                        }}
                        w="full"
                      >
                        <FormControl isInvalid={errors.email}>
                          <FormLabel>Email Address</FormLabel>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            size="lg"
                            borderColor={borderColor}
                            _focus={{ borderColor: '#388e3c', boxShadow: '0 0 0 1px #388e3c' }}
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                      </MotionBox>

                      <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={formControls}
                        variants={{
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: 0.5, duration: 0.5 }
                          }
                        }}
                        w="full"
                      >
                        <FormControl isInvalid={errors.subject}>
                          <FormLabel>Subject</FormLabel>
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What's this about?"
                            size="lg"
                            borderColor={borderColor}
                            _focus={{ borderColor: '#388e3c', boxShadow: '0 0 0 1px #388e3c' }}
                          />
                          <FormErrorMessage>{errors.subject}</FormErrorMessage>
                        </FormControl>
                      </MotionBox>

                      <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={formControls}
                        variants={{
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: 0.6, duration: 0.5 }
                          }
                        }}
                        w="full"
                      >
                        <FormControl isInvalid={errors.message}>
                          <FormLabel>Message</FormLabel>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us how we can help you..."
                            size="lg"
                            rows={5}
                            borderColor={borderColor}
                            _focus={{ borderColor: '#388e3c', boxShadow: '0 0 0 1px #388e3c' }}
                          />
                          <FormErrorMessage>{errors.message}</FormErrorMessage>
                        </FormControl>
                      </MotionBox>

                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={formControls}
                        variants={{
                          visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: 0.7, duration: 0.5 }
                          }
                        }}
                        w="full"
                      >
                        <Button
                          type="submit"
                          bg="#388e3c"
                          color="white"
                          size="lg"
                          width="full"
                          isLoading={isSubmitting}
                          loadingText="Sending..."
                          leftIcon={<Send size={20} />}
                          _hover={{ 
                            bg: '#2e7d32', 
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                          }}
                          transition="all 0.3s"
                          h="56px"
                        >
                          Send Message
                        </Button>
                      </MotionBox>
                    </VStack>
                  </form>
                </MotionVStack>
              </CardBody>
            </MotionCard>
          </MotionGridItem>

          {/* Contact Information */}
          <MotionGridItem
            ref={infoRef}
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { 
                  duration: 0.7,
                  type: "spring",
                  stiffness: 80
                }
              }
            }}
          >
            <VStack spacing={6} align="stretch">
              {contactInfo.map((item, index) => (
                <MotionCard
                  key={item.title}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={infoControls}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      x: 0, 
                      scale: 1,
                      transition: { 
                        delay: 0.2 + index * 0.1, 
                        duration: 0.5 
                      }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  bg={cardBg}
                  border="1px"
                  borderColor={borderColor}
                  shadow="lg"
                  cursor={item.action ? "pointer" : "default"}
                  onClick={item.action}
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <HStack spacing={4}>
                      <MotionBox
                        p={3}
                        bg="#e8f5e9"
                        borderRadius="lg"
                        color="#2e7d32"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon as={item.icon} w={6} h={6} />
                      </MotionBox>
                      <Box flex={1}>
                        <HStack justify="space-between" align="start">
                          <Box>
                            <Text fontWeight="bold" fontSize="lg" mb={1}>
                              {item.title}
                            </Text>
                            <Text fontSize="lg" color="#2e7d32" fontWeight="medium" mb={1}>
                              {item.description}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {item.subtitle}
                            </Text>
                          </Box>
                          {item.action && (
                            <Icon 
                              as={ExternalLink} 
                              w={4} 
                              h={4} 
                              color="#388e3c" 
                              opacity={0.7}
                            />
                          )}
                        </HStack>
                        {item.isWhatsApp && (
                          <Text fontSize="xs" color="green.500" mt={2} fontStyle="italic">
                            💬 Please be polite and construct your message clearly
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </CardBody>
                </MotionCard>
              ))}

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={infoControls}
                variants={{
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.6, duration: 0.5 }
                  }
                }}
                whileHover={{ scale: 1.02 }}
                bg="#e8f5e9"
                p={6}
                borderRadius="lg"
                border="1px"
                borderColor="#c8e6c9"
              >
                <Text fontWeight="bold" color="#2e7d32" mb={2}>
                  🎓 Campus Support
                </Text>
                <Text color="#1b5e20" mb={2}>
                  For urgent campus-related issues, we recommend contacting the official UNILAG Student Affairs office or your faculty representative.
                </Text>
                <Text fontSize="sm" color="#388e3c">
                  Note: We're currently operating as a digital platform
                </Text>
              </MotionBox>

              {/* WhatsApp Quick Action */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={infoControls}
                variants={{
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.8, duration: 0.5 }
                  }
                }}
                textAlign="center"
                p={6}
                bg="green.50"
                borderRadius="lg"
                border="1px"
                borderColor="green.200"
              >
                <Text fontWeight="bold" color="green.700" mb={2}>
                  💬 Quick WhatsApp Support
                </Text>
                <Text color="green.600" mb={4} fontSize="sm">
                  Need immediate assistance? Click below to message us directly on WhatsApp
                </Text>
                <Button
                  colorScheme="green"
                  size="md"
                  onClick={openWhatsApp}
                  leftIcon={<MessageCircle size={18} />}
                  _hover={{ transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                >
                  Message on WhatsApp
                </Button>
              </MotionBox>
            </VStack>
          </MotionGridItem>
        </MotionGrid>
      </Container>
    </Box>
  );
};

export default ContactPage;