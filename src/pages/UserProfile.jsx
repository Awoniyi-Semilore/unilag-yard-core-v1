import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Badge,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Switch,
  useColorMode,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  SimpleGrid,
  Image,
  Flex,
  Spacer,
  Tooltip,
  useToast,
  Link,
  AlertDescription,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  Edit3,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Package,
  CreditCard,
  LogOut,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Crown,
  Award,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../pages/firebase';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionAvatar = motion(Avatar);

const UserProfile = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Mock data for products (temporary until Firebase integration)
  const mockProducts = [
    {
      id: '1',
      title: 'MacBook Pro 2023',
      price: 450000,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      status: 'active',
      category: 'Electronics',
      views: 124,
      createdAt: { toDate: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      expiryDate: { toDate: () => new Date(Date.now() + 23 * 24 * 60 * 60 * 1000) },
      description: 'Brand new MacBook Pro with M2 chip, 16GB RAM, 512GB SSD'
    },
    {
      id: '2',
      title: 'Designer Leather Jacket',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      status: 'active',
      category: 'Fashion',
      views: 89,
      createdAt: { toDate: () => new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      expiryDate: { toDate: () => new Date(Date.now() + 27 * 24 * 60 * 60 * 1000) },
      description: 'Genuine leather jacket, size M, excellent condition'
    },
    {
      id: '3',
      title: 'Professional Camera Lens',
      price: 120000,
      imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
      status: 'inactive',
      category: 'Photography',
      views: 45,
      createdAt: { toDate: () => new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      expiryDate: { toDate: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      description: 'Canon 70-200mm f/2.8 lens, like new condition'
    }
  ];

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    phone: '',
    location: '',
    email: '',
    photoURL: '',
  });

  // Updated color scheme to match your brand
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('#388e3c', '#66bb6a'); // Using your brand green

  // Get current user and data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser.uid);
        await loadUserProducts(currentUser.uid);
        await loadSavedProducts(currentUser.uid);
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const loadUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          displayName: data.displayName || user.displayName || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          email: user.email || '',
          photoURL: data.photoURL || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProducts = async (userId) => {
    try {
      // For now, using mock data. Replace with actual Firebase call later
      setUserProducts(mockProducts);
    } catch (error) {
      console.error('Error loading user products:', error);
      // Fallback to mock data
      setUserProducts(mockProducts);
    }
  };

  const loadSavedProducts = async (userId) => {
    try {
      // Mock saved products for now
      const mockSaved = [mockProducts[0], mockProducts[1]];
      setSavedProducts(mockSaved);
    } catch (error) {
      console.error('Error loading saved products:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploadingImage(true);

    try {
      // For now, using object URL for immediate preview
      const imageUrl = URL.createObjectURL(file);
      
      // Update local state immediately for preview
      setFormData(prev => ({ ...prev, photoURL: imageUrl }));
      
      toast({
        title: "Image updated",
        description: "Profile picture has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        updatedAt: new Date(),
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditing(false);
      await loadUserData(user.uid);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getPlanBadge = (plan) => {
    const plans = {
      standard: { color: 'gray', icon: Zap, label: 'Standard' },
      featured: { color: 'orange', icon: Award, label: 'Featured' },
      pro: { color: 'blue', icon: Crown, label: 'Pro' },
      premium: { color: 'green', icon: Crown, label: 'Premium' } // Changed to green
    };
    
    const planInfo = plans[plan] || plans.standard;
    const IconComponent = planInfo.icon;
    
    return (
      <Badge colorScheme={planInfo.color} display="flex" alignItems="center" gap={1}>
        <IconComponent size={12} />
        {planInfo.label}
      </Badge>
    );
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const expiry = expiryDate.toDate();
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const stats = [
    {
      label: 'Products Listed',
      value: userProducts.length,
      icon: Package,
      color: 'green', // Changed to green
      action: () => setActiveTab(0)
    },
    {
      label: 'Products Saved',
      value: savedProducts.length,
      icon: Heart,
      color: 'green', // Changed to green
      action: () => navigate('/saved-products')
    },
    {
      label: 'Total Views',
      value: userProducts.reduce((sum, product) => sum + (product.views || 0), 0),
      icon: Eye,
      color: 'green', // Changed to green
      action: () => setActiveTab(0)
    },
    {
      label: 'Messages',
      value: '24',
      icon: MessageCircle,
      color: 'green', // Changed to green
      action: () => navigate('/messages')
    }
  ];

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Box
            width="50px"
            height="50px"
            border="4px solid"
            borderColor={accentColor}
            borderTop="4px solid transparent"
            borderRadius="full"
            animation="spin 1s linear infinite"
            mx="auto"
            mb={4}
          />
          <Text>Loading your profile...</Text>
        </MotionBox>
      </Box>
    );
  }

  return (
    <Box minH="100vh" pt={20} pb={8}> {/* Added padding top to push content down */}
      <Container maxW="7xl">
        {/* Privacy Notice Banner */}
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          mb={6}
        >
          <Alert status="info" borderRadius="md" bg="blue.50" borderColor="blue.200">
            <AlertIcon />
            <AlertDescription fontSize="sm" color="blue.800">
              <Text fontWeight="medium">Profile Privacy Notice:</Text>
              Your profile and products can only be viewed by the UNILAG team and yourself. 
              This helps maintain a secure campus marketplace environment.
            </AlertDescription>
          </Alert>
        </MotionBox>

        {/* Header Section */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          mb={8}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="md"> {/* Reduced shadow */}
            <CardBody p={8}>
              <Grid templateColumns={{ base: '1fr', md: 'auto 1fr auto' }} gap={6} alignItems="center">
                {/* Avatar Section - Fixed image sizing */}
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box position="relative">
                    <Box
                      size="2xl"
                      width="120px"
                      height="120px"
                      borderRadius="full"
                      border="4px solid"
                      borderColor={accentColor}
                      overflow="hidden"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="gray.100"
                    >
                      <Image
                        src={formData.photoURL || userData?.photoURL}
                        alt={userData?.displayName || user?.displayName}
                        objectFit="contain" // Changed from 'cover' to 'contain' to prevent cropping
                        width="100%"
                        height="100%"
                        borderRadius="full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                    <IconButton
                      aria-label="Change photo"
                      icon={<Camera size={16} />}
                      size="sm"
                      position="absolute"
                      bottom={2}
                      right={2}
                      borderRadius="full"
                      bg={accentColor}
                      color="white"
                      _hover={{ bg: '#2e7d32' }} // Darker green on hover
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={uploadingImage}
                    />
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      hidden
                    />
                  </Box>
                </MotionBox>

                {/* User Info */}
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <Heading size="xl" color={accentColor}>
                      {userData?.displayName || user?.displayName || 'User'}
                    </Heading>
                    {userData?.plan && getPlanBadge(userData.plan)}
                  </HStack>
                  
                  <Text color="gray.500" fontSize="lg">
                    {user?.email}
                  </Text>
                  
                  {userData?.bio && (
                    <Text color="gray.600" maxW="md">
                      {userData.bio}
                    </Text>
                  )}

                  <HStack spacing={4} color="gray.500">
                    {userData?.phone && (
                      <HStack spacing={1}>
                        <Phone size={16} />
                        <Text fontSize="sm">{userData.phone}</Text>
                      </HStack>
                    )}
                    {userData?.location && (
                      <HStack spacing={1}>
                        <MapPin size={16} />
                        <Text fontSize="sm">{userData.location}</Text>
                      </HStack>
                    )}
                    <HStack spacing={1}>
                      <Calendar size={16} />
                      <Text fontSize="sm">
                        Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>

                {/* Actions */}
                <VStack spacing={3}>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Toggle theme"
                      icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                      onClick={toggleTheme}
                      variant="ghost"
                      color={accentColor}
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical size={20} />}
                        variant="ghost"
                        color={accentColor}
                      />
                      <MenuList>
                        <MenuItem icon={<Settings size={16} />} onClick={() => setActiveTab(2)}>
                          Settings
                        </MenuItem>
                        <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
                          Sign Out
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                  
                  <Button
                    leftIcon={<Edit3 size={16} />}
                    onClick={() => setEditing(!editing)}
                    bg={accentColor}
                    color="white"
                    _hover={{ bg: '#2e7d32' }}
                    variant={editing ? "solid" : "outline"}
                    size="sm"
                  >
                    {editing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </VStack>
              </Grid>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Edit Profile Form */}
        <AnimatePresence>
          {editing && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              mb={6}
              overflow="hidden"
            >
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={accentColor}>Edit Profile</Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    <FormControl>
                      <FormLabel>Display Name</FormLabel>
                      <Input
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Enter your display name"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        value={formData.email}
                        isDisabled
                        placeholder="Email (cannot be changed)"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Location</FormLabel>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                      />
                    </FormControl>
                    
                    <FormControl gridColumn={{ base: '1', md: '1 / -1' }}>
                      <FormLabel>Bio</FormLabel>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </FormControl>
                  </Grid>
                  
                  <HStack spacing={3} mt={6} justify="flex-end">
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      disabled={updating}
                    >
                      Cancel
                    </Button>
                    <Button
                      bg={accentColor}
                      color="white"
                      _hover={{ bg: '#2e7d32' }}
                      onClick={handleUpdateProfile}
                      isLoading={updating}
                      loadingText="Updating..."
                    >
                      Save Changes
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Stats Overview */}
        <MotionGrid
          templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
          mb={8}
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
          animate="visible"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <MotionGridItem key={index} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                <Card 
                  bg={cardBg} 
                  border="1px" 
                  borderColor={borderColor}
                  _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                  cursor="pointer"
                  onClick={stat.action}
                >
                  <CardBody>
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        bg="green.50" // Using green shades
                        borderRadius="lg"
                        color={accentColor}
                      >
                        <IconComponent size={20} />
                      </Box>
                      <Stat>
                        <StatNumber fontSize="2xl" fontWeight="bold" color={accentColor}>
                          {stat.value}
                        </StatNumber>
                        <StatLabel color="gray.500">{stat.label}</StatLabel>
                      </Stat>
                    </HStack>
                  </CardBody>
                </Card>
              </MotionGridItem>
            );
          })}
        </MotionGrid>

        {/* Main Content Tabs */}
        <Tabs variant="enclosed" colorScheme="green" index={activeTab} onChange={setActiveTab}>
          <TabList mb={6}>
            <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
              <Package size={16} style={{ marginRight: '8px' }} />
              My Products
            </Tab>
            <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
              <CreditCard size={16} style={{ marginRight: '8px' }} />
              Plan & Billing
            </Tab>
            <Tab _selected={{ color: accentColor, borderColor: accentColor }}>
              <Settings size={16} style={{ marginRight: '8px' }} />
              Settings
            </Tab>
          </TabList>

          <TabPanels>
            {/* My Products Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {userProducts.length === 0 ? (
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody textAlign="center" py={12}>
                      <Package size={48} color="#CBD5E0" />
                      <Heading size="md" mt={4} mb={2}>No Products Listed</Heading>
                      <Text color="gray.500" mb={4}>
                        You haven't listed any products yet.
                      </Text>
                      <Button 
                        bg={accentColor}
                        color="white"
                        _hover={{ bg: '#2e7d32' }}
                        onClick={() => navigate('/add-product')}
                      >
                        List Your First Product
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <VStack spacing={6} align="stretch">
                    {userProducts.map((product, index) => (
                      <MotionBox
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card 
                          bg={cardBg} 
                          border="1px" 
                          borderColor={borderColor}
                          _hover={{ shadow: 'md' }}
                          transition="all 0.3s"
                        >
                          <CardBody p={0}>
                            <Grid templateColumns={{ base: '1fr', md: '200px 1fr auto' }} gap={4}>
                              {/* Product Image */}
                              <Box>
                                <Image
                                  src={product.imageUrl}
                                  alt={product.title}
                                  height="150px"
                                  width="100%"
                                  objectFit="cover"
                                  borderLeftRadius="md"
                                />
                              </Box>
                              
                              {/* Product Details */}
                              <Box p={4}>
                                <HStack justify="space-between" mb={2}>
                                  <Heading size="md">{product.title}</Heading>
                                  <Badge
                                    colorScheme={product.status === 'active' ? 'green' : 'red'}
                                  >
                                    {product.status === 'active' ? 'Active' : 'Inactive'}
                                  </Badge>
                                </HStack>
                                
                                <Text color="gray.600" mb={3} noOfLines={2}>
                                  {product.description}
                                </Text>
                                
                                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} mb={3}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Price</Text>
                                    <Text fontWeight="bold" color={accentColor}>
                                      ₦{product.price?.toLocaleString()}
                                    </Text>
                                  </VStack>
                                  
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Category</Text>
                                    <Badge colorScheme="green" variant="subtle">
                                      {product.category}
                                    </Badge>
                                  </VStack>
                                  
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Views</Text>
                                    <Text fontWeight="medium">{product.views || 0}</Text>
                                  </VStack>
                                </SimpleGrid>
                                
                                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Date Created</Text>
                                    <Text fontSize="sm">
                                      {product.createdAt?.toDate().toLocaleDateString()}
                                    </Text>
                                  </VStack>
                                  
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Date Expired</Text>
                                    <Text fontSize="sm">
                                      {product.expiryDate?.toDate().toLocaleDateString()}
                                    </Text>
                                  </VStack>
                                  
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="gray.500">Days Remaining</Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {getDaysRemaining(product.expiryDate)} days
                                    </Text>
                                  </VStack>
                                </SimpleGrid>
                              </Box>
                              
                              {/* Actions */}
                              <VStack p={4} justify="space-between">
                                <Button
                                  bg={accentColor}
                                  color="white"
                                  _hover={{ bg: '#2e7d32' }}
                                  size="sm"
                                  leftIcon={<Edit3 size={16} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast({
                                      title: "Edit Product",
                                      description: "Edit functionality will be implemented soon",
                                      status: "info",
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                  }}
                                >
                                  Edit
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/product/${product.id}`);
                                  }}
                                  rightIcon={<ExternalLink size={14} />}
                                >
                                  View
                                </Button>
                              </VStack>
                            </Grid>
                          </CardBody>
                        </Card>
                      </MotionBox>
                    ))}
                  </VStack>
                )}
              </MotionBox>
            </TabPanel>

            {/* Plan & Billing Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
                  {/* Current Plan */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md" color={accentColor}>Current Plan</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Box
                          bg="green.50"
                          p={6}
                          borderRadius="lg"
                          border="1px"
                          borderColor="green.200"
                        >
                          <HStack justify="space-between" mb={4}>
                            <Heading size="lg" color={accentColor}>
                              {userData?.plan ? userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1) : 'Standard'} Plan
                            </Heading>
                            {getPlanBadge(userData?.plan || 'standard')}
                          </HStack>
                          
                          <Text color="green.700" mb={4}>
                            {userData?.plan === 'premium' && 'Top-tier features with maximum visibility and promotion'}
                            {userData?.plan === 'pro' && 'Enhanced features for serious sellers'}
                            {userData?.plan === 'featured' && 'Better visibility for your listings'}
                            {userData?.plan === 'standard' && 'Basic features for casual selling'}
                          </Text>
                          
                          <Progress 
                            value={75} 
                            colorScheme="green" 
                            size="sm" 
                            borderRadius="full"
                            mb={2}
                          />
                          <Text fontSize="sm" color="green.600">
                            15 days remaining on your plan
                          </Text>
                        </Box>

                        <Button 
                          bg={accentColor}
                          color="white"
                          _hover={{ bg: '#2e7d32' }}
                          size="lg"
                        >
                          Upgrade Plan
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Billing History */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Billing History</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <Text fontSize="sm">No billing history yet</Text>
                        </Alert>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          Your payment history will appear here
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </MotionBox>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                  {/* Notification Settings */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Notifications</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">Email Notifications</Text>
                            <Text fontSize="sm" color="gray.500">Receive updates via email</Text>
                          </VStack>
                          <Switch colorScheme="green" defaultChecked />
                        </HStack>
                        
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">Push Notifications</Text>
                            <Text fontSize="sm" color="gray.500">Browser notifications</Text>
                          </VStack>
                          <Switch colorScheme="green" defaultChecked />
                        </HStack>
                        
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">Message Alerts</Text>
                            <Text fontSize="sm" color="gray.500">New message notifications</Text>
                          </VStack>
                          <Switch colorScheme="green" defaultChecked />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Privacy Settings */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Privacy & Security</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">Profile Visibility</Text>
                            <Text fontSize="sm" color="gray.500">Who can see your profile</Text>
                          </VStack>
                          <Badge colorScheme="green">Public</Badge>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">Two-Factor Auth</Text>
                            <Text fontSize="sm" color="gray.500">Extra security for your account</Text>
                          </VStack>
                          <Switch colorScheme="green" />
                        </HStack>
                        
                        <Button variant="outline" colorScheme="red" size="sm" mt={4}>
                          Delete Account
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </MotionBox>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default UserProfile;