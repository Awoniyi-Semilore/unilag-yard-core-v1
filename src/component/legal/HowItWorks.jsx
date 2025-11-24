import React from 'react';
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
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Handshake, Shield, Plus, Home, Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const HowItWorks = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="4xl" paddingTop="80px">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          textAlign="center"
          mb={12}
        >
          <Heading size="2xl" mb={4} color="#2e7d32">
            How UNILAG Yard Works
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
            Simple steps for buying and selling safely on campus
          </Text>
        </MotionBox>

        {/* Two Main Sections */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} mb={12}>
          
          {/* For Buyers Section */}
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            bg={cardBg}
            shadow="lg"
            borderTop="4px"
            borderColor="#2e7d32"
          >
            <CardBody p={6}>
              <VStack spacing={6} align="start">
                <Box>
                  <Heading size="lg" color="#2e7d32" mb={2}>
                    How to Buy Products
                  </Heading>
                  <Text color="gray.600">
                    Follow these simple steps to purchase items safely
                  </Text>
                </Box>

                <List spacing={4}>
                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={Home} color="#2e7d32" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Browse Products</Text>
                        <Text fontSize="sm" color="gray.600">
                          Check out products from the home page or use search to find what you need
                        </Text>
                      </Box>
                    </HStack>
                  </ListItem>

                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={MessageCircle} color="#2e7d32" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Message Seller</Text>
                        <Text fontSize="sm" color="gray.600">
                          Click "Message Seller" to discuss:
                        </Text>
                        <List spacing={1} mt={1} ml={4}>
                          <ListItem fontSize="sm" color="gray.600">
                            • Product condition
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Final price
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Meeting point on campus
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Date and time for collection
                          </ListItem>
                        </List>
                      </Box>
                    </HStack>
                  </ListItem>

                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={Handshake} color="#2e7d32" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Meet & Complete</Text>
                        <Text fontSize="sm" color="gray.600">
                          Meet with the seller, inspect the product, pay on the spot and collect
                        </Text>
                      </Box>
                    </HStack>
                  </ListItem>
                </List>

                {/* Important Notes */}
                <Box bg="#e8f5e9" p={4} borderRadius="md" borderLeft="4px" borderColor="#2e7d32">
                  <Text fontSize="sm" fontWeight="bold" color="#2e7d32" mb={2}>
                    Important Safety Notes:
                  </Text>
                  <List spacing={1}>
                    <ListItem fontSize="sm" color="#1b5e20">
                      • We encourage cash payments for transactions
                    </ListItem>
                    <ListItem fontSize="sm" color="#1b5e20">
                      • Always meet in open, public places on campus
                    </ListItem>
                    <ListItem fontSize="sm" color="#1b5e20">
                      • Never pay without inspecting the product first
                    </ListItem>
                    <ListItem fontSize="sm" color="#1b5e20">
                      • Bring a friend along for added safety
                    </ListItem>
                  </List>
                </Box>

                <Button 
                  bg="#2e7d32"
                  color="white"
                  width="full"
                  onClick={() => navigate('/home')}
                  _hover={{ bg: '#1b5e20' }}
                >
                  <Search size={18} style={{ marginRight: '8px' }} />
                  Browse Products
                </Button>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* For Sellers Section */}
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            bg={cardBg}
            shadow="lg"
            borderTop="4px"
            borderColor="#1976d2"
          >
            <CardBody p={6}>
              <VStack spacing={6} align="start">
                <Box>
                  <Heading size="lg" color="#1976d2" mb={2}>
                    How to Sell Products
                  </Heading>
                  <Text color="gray.600">
                    List your items and reach UNILAG students easily
                  </Text>
                </Box>

                <List spacing={4}>
                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={Plus} color="#1976d2" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Add Your Product</Text>
                        <Text fontSize="sm" color="gray.600">
                          Click "Add Product" in the header and enter your personal university details
                        </Text>
                      </Box>
                    </HStack>
                  </ListItem>

                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={Mail} color="#1976d2" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Verify UNILAG Student Status</Text>
                        <Text fontSize="sm" color="gray.600">
                          Confirm you're a UNILAG student:
                        </Text>
                        <List spacing={1} mt={1} ml={4}>
                          <ListItem fontSize="sm" color="gray.600">
                            • Go to outlook.live.com
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Login using: matricnumber@live.student.edu.ng
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Use your regular password
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Check for verification code/link sent to your email
                          </ListItem>
                          <ListItem fontSize="sm" color="gray.600">
                            • Follow the instructions to complete verification
                          </ListItem>
                        </List>
                      </Box>
                    </HStack>
                  </ListItem>

                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={CheckCircle} color="#1976d2" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Choose Listing Plan & Register</Text>
                        <Text fontSize="sm" color="gray.600">
                          Check out our various listing plans, pay for your chosen plan, 
                          register your product and submit
                        </Text>
                      </Box>
                    </HStack>
                  </ListItem>

                  <ListItem>
                    <HStack align="start">
                      <ListIcon as={Search} color="#1976d2" mt={1} />
                      <Box>
                        <Text fontWeight="bold">Confirm Listing</Text>
                        <Text fontSize="sm" color="gray.600">
                          Your product is listed automatically and immediately. 
                          Search for your product to confirm it's visible
                        </Text>
                      </Box>
                    </HStack>
                  </ListItem>
                </List>

                {/* Important Notes */}
                <Box bg="#e3f2fd" p={4} borderRadius="md" borderLeft="4px" borderColor="#1976d2">
                  <Text fontSize="sm" fontWeight="bold" color="#1976d2" mb={2}>
                    Pro Tips for Sellers:
                  </Text>
                  <List spacing={1}>
                    <ListItem fontSize="sm" color="#1565c0">
                      • Take clear, well-lit photos of your items
                    </ListItem>
                    <ListItem fontSize="sm" color="#1565c0">
                      • Write detailed, honest descriptions
                    </ListItem>
                    <ListItem fontSize="sm" color="#1565c0">
                      • Set fair prices based on item condition
                    </ListItem>
                    <ListItem fontSize="sm" color="#1565c0">
                      • Respond quickly to buyer messages
                    </ListItem>
                  </List>
                </Box>

                <Button 
                  bg="#1976d2"
                  color="white"
                  width="full"
                  onClick={() => navigate('/addProduct')}
                  _hover={{ bg: '#1565c0' }}
                >
                  <Plus size={18} style={{ marginRight: '8px' }} />
                  Add Your Product
                </Button>
              </VStack>
            </CardBody>
          </MotionCard>
        </Grid>

        {/* Safety Section */}
        <MotionCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          bg={cardBg}
          shadow="lg"
          border="2px"
          borderColor="#ff9800"
        >
          <CardBody p={6}>
            <HStack spacing={4} align="start">
              <Shield size={32} color="#ff9800" />
              <Box>
                <Heading size="md" color="#ff9800" mb={3}>
                  Safety First - Always!
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold" color="#e65100">For Everyone:</Text>
                    <List spacing={1}>
                      <ListItem fontSize="sm" color="gray.600">
                        • Meet in public campus locations only
                      </ListItem>
                      <ListItem fontSize="sm" color="gray.600">
                        • Bring a friend with you
                      </ListItem>
                      <ListItem fontSize="sm" color="gray.600">
                        • Tell someone where you're going
                      </ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold" color="#e65100">Transaction Safety:</Text>
                    <List spacing={1}>
                      <ListItem fontSize="sm" color="gray.600">
                        • Inspect items before payment
                      </ListItem>
                      <ListItem fontSize="sm" color="gray.600">
                        • Use cash for transactions
                      </ListItem>
                      <ListItem fontSize="sm" color="gray.600">
                        • Trust your instincts
                      </ListItem>
                    </List>
                  </VStack>
                </Grid>
              </Box>
            </HStack>
          </CardBody>
        </MotionCard>

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          textAlign="center"
          mt={8}
          p={6}
          bg="#e8f5e9"
          borderRadius="lg"
        >
          <Heading size="md" mb={3} color="#2e7d32">
            Ready to Get Started?
          </Heading>
          <Text color="#1b5e20" mb={4}>
            Join the UNILAG Yard community today!
          </Text>
          <HStack spacing={4} justify="center">
            <Button 
              bg="#2e7d32"
              color="white"
              onClick={() => navigate('/home')}
              _hover={{ bg: '#1b5e20' }}
            >
              Browse Products
            </Button>
            <Button 
              variant="outline"
              color="#2e7d32"
              borderColor="#2e7d32"
              onClick={() => navigate('/addProduct')}
              _hover={{ bg: '#e8f5e9' }}
            >
              Sell Something
            </Button>
          </HStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default HowItWorks;