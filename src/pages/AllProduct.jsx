import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Text, 
  Input, 
  InputGroup, 
  InputRightElement, 
  Button, 
  VStack, 
  HStack,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { Search, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AllProduct = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    setProducts([]); // Empty for now
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/allProduct?search=${encodeURIComponent(localSearch)}`;
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box textAlign="center" py={8}>
              <Heading size="xl" mb={4}>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </Heading>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto' }}>
                <InputGroup size="lg">
                  <Input
                    placeholder="Search for books, gadgets, items..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px green.500' }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      type="submit"
                      bg="green.500"
                      color="white"
                      _hover={{ bg: 'green.600' }}
                    >
                      <Search size={16} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </form>
            </Box>

            {/* Empty State */}
            <MotionBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card 
                bg={cardBg} 
                boxShadow="lg" 
                borderRadius="xl" 
                textAlign="center" 
                py={16}
              >
                <CardBody>
                  <VStack spacing={6}>
                    <Box color="gray.400">
                      <Search size={80} />
                    </Box>
                    <Heading size="lg" color="gray.600">
                      {searchQuery ? 'No Products Found' : 'Marketplace is Empty'}
                    </Heading>
                    <Text fontSize="lg" color="gray.500" maxW="md">
                      {searchQuery 
                        ? `No products matching "${searchQuery}" were found.`
                        : 'Be the first to list an item and start the marketplace!'
                      }
                    </Text>
                    <Button
                      size="lg"
                      colorScheme="green"
                      leftIcon={<PlusCircle size={20} />}
                      onClick={() => window.location.href = '/addProduct'}
                      mt={4}
                    >
                      Add Your First Product
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>

            {/* Categories Section */}
            {!searchQuery && (
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Box mt={12}>
                  <Heading size="md" mb={6} textAlign="center">
                    Browse Categories
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    {[
                      { name: 'Textbooks', icon: '📚', color: 'blue' },
                      { name: 'Electronics', icon: '📱', color: 'green' },
                      { name: 'Hostel Items', icon: '🛏️', color: 'purple' },
                      { name: 'Fashion', icon: '👕', color: 'pink' },
                    ].map((category, index) => (
                      <MotionBox
                        key={category.name}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card 
                          bg={cardBg}
                          cursor="pointer"
                          onClick={() => window.location.href = `/allProduct?search=${category.name}`}
                          border="2px solid"
                          borderColor="transparent"
                          _hover={{ borderColor: `${category.color}.500` }}
                          transition="all 0.3s"
                        >
                          <CardBody textAlign="center" py={6}>
                            <Text fontSize="3xl" mb={2}>{category.icon}</Text>
                            <Text fontWeight="bold">{category.name}</Text>
                          </CardBody>
                        </Card>
                      </MotionBox>
                    ))}
                  </SimpleGrid>
                </Box>
              </MotionBox>
            )}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default AllProduct;