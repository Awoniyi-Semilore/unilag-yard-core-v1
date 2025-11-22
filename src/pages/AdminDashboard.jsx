import React, { useState, useEffect } from 'react';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Button,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  Textarea,
  Select,
  useToast,
  Avatar,
  Image,
  Progress,
  Tag,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  Package,
  Flag,
  Mail,
  Eye,
  MoreVertical,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Send,
  AlertTriangle,
  MessageCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  ExternalLink,
} from 'lucide-react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { useAdminAuth, isAdminUser } from '../utils/adminAuth';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  // Modals
  const { isOpen: isProductModalOpen, onOpen: onProductModalOpen, onClose: onProductModalClose } = useDisclosure();
  const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onClose: onUserModalClose } = useDisclosure();
  const { isOpen: isReportModalOpen, onOpen: onReportModalOpen, onClose: onReportModalClose } = useDisclosure();
  const { isOpen: isEmailModalOpen, onOpen: onEmailModalOpen, onClose: onEmailModalClose } = useDisclosure();
  const { isOpen: isBanModalOpen, onOpen: onBanModalOpen, onClose: onBanModalClose } = useDisclosure();

  const [emailData, setEmailData] = useState({ subject: '', message: '', to: '' });
  const [userToBan, setUserToBan] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        status: "error",
        duration: 3000,
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  // Load all data
  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadProducts(),
        loadReports(),
        loadRecentConversations(),
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load dashboard data",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoadingData(false);
    }
  };

  const loadStats = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const productsSnapshot = await getDocs(query(collection(db, 'products'), where('status', '==', 'active')));
    const reportsSnapshot = await getDocs(query(collection(db, 'reports'), where('status', '==', 'pending')));
    const conversationsSnapshot = await getDocs(collection(db, 'conversations'));

    setStats({
      totalUsers: usersSnapshot.size,
      activeProducts: productsSnapshot.size,
      pendingReports: reportsSnapshot.size,
      totalConversations: conversationsSnapshot.size,
    });
  };

  const loadUsers = async () => {
    const usersSnapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
    const usersData = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(usersData);
  };

  const loadProducts = async () => {
    const productsSnapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    const productsData = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productsData);
  };

  const loadReports = async () => {
    const reportsSnapshot = await getDocs(query(collection(db, 'reports'), orderBy('timestamp', 'desc')));
    const reportsData = await Promise.all(
      reportsSnapshot.docs.map(async (docSnap) => {
        const report = { id: docSnap.id, ...docSnap.data() };
        
        // Get product details
        if (report.reportedProductId) {
          const productDoc = await getDoc(doc(db, 'products', report.reportedProductId));
          report.product = productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } : null;
        }
        
        // Get reporter details
        if (report.reporterId) {
          const userDoc = await getDoc(doc(db, 'users', report.reporterId));
          report.reporter = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
        }

        return report;
      })
    );
    setReports(reportsData);
  };

  const loadRecentConversations = async () => {
    const conversationsSnapshot = await getDocs(query(collection(db, 'conversations'), orderBy('lastUpdated', 'desc'), limit(50)));
    const conversationsData = conversationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setConversations(conversationsData);
  };

  const viewProductDetails = async (productId) => {
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        const productData = { id: productDoc.id, ...productDoc.data() };
        
        // Get seller details
        if (productData.sellerId) {
          const userDoc = await getDoc(doc(db, 'users', productData.sellerId));
          productData.seller = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
        }

        setSelectedProduct(productData);
        onProductModalOpen();
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() };
        
        // Get user's products
        const productsQuery = query(collection(db, 'products'), where('sellerId', '==', userId));
        const productsSnapshot = await getDocs(productsQuery);
        userData.products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSelectedUser(userData);
        onUserModalOpen();
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const viewReportDetails = async (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      onReportModalOpen();
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'resolved',
        resolvedBy: auth.currentUser.email,
        resolvedAt: serverTimestamp(),
        resolution: action,
      });

      toast({
        title: "Report Resolved",
        description: `Report marked as ${action}`,
        status: "success",
        duration: 3000,
      });

      await loadReports();
      onReportModalClose();
    } catch (error) {
      console.error('Error resolving report:', error);
      toast({
        title: "Error",
        description: "Failed to resolve report",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleBanUser = async (userId, reason) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'banned',
        bannedAt: serverTimestamp(),
        bannedBy: auth.currentUser.email,
        banReason: reason,
      });

      // Also deactivate user's products
      const productsQuery = query(collection(db, 'products'), where('sellerId', '==', userId));
      const productsSnapshot = await getDocs(productsQuery);
      
      const updatePromises = productsSnapshot.docs.map(productDoc =>
        updateDoc(doc(db, 'products', productDoc.id), { status: 'inactive' })
      );

      await Promise.all(updatePromises);

      toast({
        title: "User Banned",
        description: "User has been banned and their products deactivated",
        status: "success",
        duration: 3000,
      });

      await loadUsers();
      await loadProducts();
      onBanModalClose();
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSendEmail = async () => {
    // In a real app, you'd integrate with an email service
    // For now, we'll just show a success message
    toast({
      title: "Email Sent",
      description: `Email sent to ${emailData.to}`,
      status: "success",
      duration: 3000,
    });
    
    setEmailData({ subject: '', message: '', to: '' });
    onEmailModalClose();
  };

  const openEmailModal = (email = '') => {
    setEmailData({ subject: '', message: '', to: email });
    onEmailModalOpen();
  };

  const openBanModal = (user) => {
    setUserToBan(user);
    onBanModalOpen();
  };

  // Filter data based on search
  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reports.filter(report =>
    report.reporter?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Box
            width="50px"
            height="50px"
            border="4px solid"
            borderColor="brand.500"
            borderTop="4px solid transparent"
            borderRadius="full"
            animation="spin 1s linear infinite"
          />
          <Text>Verifying admin access...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="8xl">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          mb={8}
        >
          <Card shadow="lg">
            <CardBody>
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <Heading size="xl" color="brand.600" display="flex" alignItems="center" gap={3}>
                    <Shield size={32} />
                    Admin Dashboard
                  </Heading>
                  <Text color="gray.600">Manage UNILAG Yard platform</Text>
                </VStack>
                <HStack spacing={4}>
                  <Button
                    leftIcon={<Mail size={16} />}
                    colorScheme="blue"
                    onClick={() => openEmailModal()}
                  >
                    Send Email
                  </Button>
                  <Button
                    leftIcon={<Download size={16} />}
                    variant="outline"
                    onClick={loadDashboardData}
                    isLoading={loadingData}
                  >
                    Refresh Data
                  </Button>
                </HStack>
              </HStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Stats Overview */}
        <MotionGrid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
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
          {[
            { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'blue' },
            { label: 'Active Products', value: stats.activeProducts || 0, icon: Package, color: 'green' },
            { label: 'Pending Reports', value: stats.pendingReports || 0, icon: Flag, color: 'red' },
            { label: 'Conversations', value: stats.totalConversations || 0, icon: MessageCircle, color: 'purple' },
          ].map((stat, index) => (
            <MotionGridItem key={index} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Card 
                shadow="md" 
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.3s"
              >
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        {stat.label}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={`${stat.color}.600`}>
                        {stat.value}
                      </Text>
                    </VStack>
                    <Box
                      p={3}
                      bg={`${stat.color}.100`}
                      borderRadius="lg"
                      color={`${stat.color}.600`}
                    >
                      <stat.icon size={24} />
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            </MotionGridItem>
          ))}
        </MotionGrid>

        {/* Search Bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          mb={6}
        >
          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Box flex={1}>
                  <Input
                    placeholder="Search users, products, reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="lg"
                  />
                </Box>
                <Button leftIcon={<Filter size={16} />} variant="outline">
                  Filters
                </Button>
              </HStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Main Tabs */}
        <Tabs variant="enclosed" colorScheme="brand" index={activeTab} onChange={setActiveTab}>
          <TabList mb={6}>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500' }}>
              <Users size={16} style={{ marginRight: '8px' }} />
              Users ({users.length})
            </Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500' }}>
              <Package size={16} style={{ marginRight: '8px' }} />
              Products ({products.length})
            </Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500' }}>
              <Flag size={16} style={{ marginRight: '8px' }} />
              Reports ({reports.length})
            </Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500' }}>
              <MessageCircle size={16} style={{ marginRight: '8px' }} />
              Conversations
            </Tab>
          </TabList>

          <TabPanels>
            {/* Users Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card shadow="sm">
                  <CardBody p={0}>
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>User</Th>
                          <Th>Email</Th>
                          <Th>Plan</Th>
                          <Th>Joined</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredUsers.map((user) => (
                          <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <HStack spacing={3}>
                                <Avatar size="sm" name={user.displayName} src={user.photoURL} />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">{user.displayName || 'No Name'}</Text>
                                  <Text fontSize="sm" color="gray.500">
                                    {user.phone || 'No phone'}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td>{user.email}</Td>
                            <Td>
                              <Badge colorScheme={
                                user.plan === 'premium' ? 'purple' :
                                user.plan === 'pro' ? 'blue' :
                                user.plan === 'featured' ? 'orange' : 'gray'
                              }>
                                {user.plan || 'standard'}
                              </Badge>
                            </Td>
                            <Td>
                              {user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                            </Td>
                            <Td>
                              <Badge colorScheme={user.status === 'banned' ? 'red' : 'green'}>
                                {user.status || 'active'}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  icon={<Eye size={14} />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => viewUserDetails(user.id)}
                                  aria-label="View user"
                                />
                                <IconButton
                                  icon={<Mail size={14} />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEmailModal(user.email)}
                                  aria-label="Send email"
                                />
                                {user.status !== 'banned' && (
                                  <IconButton
                                    icon={<Ban size={14} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => openBanModal(user)}
                                    aria-label="Ban user"
                                  />
                                )}
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </MotionBox>
            </TabPanel>

            {/* Products Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card shadow="sm">
                  <CardBody p={0}>
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Product</Th>
                          <Th>Price</Th>
                          <Th>Category</Th>
                          <Th>Seller</Th>
                          <Th>Status</Th>
                          <Th>Posted</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredProducts.map((product) => (
                          <Tr key={product.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <HStack spacing={3}>
                                <Image
                                  src={product.imageUrl || '/default-image.jpg'}
                                  alt={product.title}
                                  width="40px"
                                  height="40px"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                                <Box>
                                  <Text fontWeight="medium" noOfLines={1}>
                                    {product.title}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                    {product.location}
                                  </Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td fontWeight="bold">₦{product.price?.toLocaleString()}</Td>
                            <Td>
                              <Badge>{product.category}</Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{product.sellerId?.substring(0, 8)}...</Text>
                            </Td>
                            <Td>
                              <Badge colorScheme={
                                product.status === 'active' ? 'green' :
                                product.status === 'sold' ? 'blue' : 'gray'
                              }>
                                {product.status}
                              </Badge>
                            </Td>
                            <Td>
                              {product.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  icon={<Eye size={14} />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => viewProductDetails(product.id)}
                                  aria-label="View product"
                                />
                                <IconButton
                                  icon={<ExternalLink size={14} />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                  aria-label="Open product"
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </MotionBox>
            </TabPanel>

            {/* Reports Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card shadow="sm">
                  <CardBody p={0}>
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Reported By</Th>
                          <Th>Reason</Th>
                          <Th>Product</Th>
                          <Th>Reported At</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredReports.map((report) => (
                          <Tr key={report.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{report.reporter?.email}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {report.reporterId?.substring(0, 8)}...
                                </Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Badge colorScheme="red" variant="subtle">
                                {report.reason}
                              </Badge>
                            </Td>
                            <Td>
                              {report.product ? (
                                <Text noOfLines={1}>{report.product.title}</Text>
                              ) : (
                                <Text color="gray.500" fontStyle="italic">Product deleted</Text>
                              )}
                            </Td>
                            <Td>
                              {report.timestamp?.toDate?.().toLocaleDateString() || 'N/A'}
                            </Td>
                            <Td>
                              <Badge colorScheme={
                                report.status === 'pending' ? 'orange' :
                                report.status === 'resolved' ? 'green' : 'gray'
                              }>
                                {report.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  icon={<Eye size={14} />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => viewReportDetails(report.id)}
                                  aria-label="View report"
                                />
                                {report.status === 'pending' && (
                                  <>
                                    <IconButton
                                      icon={<CheckCircle size={14} />}
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="green"
                                      onClick={() => handleResolveReport(report.id, 'resolved')}
                                      aria-label="Resolve report"
                                    />
                                    <IconButton
                                      icon={<XCircle size={14} />}
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="red"
                                      onClick={() => handleResolveReport(report.id, 'dismissed')}
                                      aria-label="Dismiss report"
                                    />
                                  </>
                                )}
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </MotionBox>
            </TabPanel>

            {/* Conversations Tab */}
            <TabPanel p={0}>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card shadow="sm">
                  <CardBody p={0}>
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Product</Th>
                          <Th>Last Message</Th>
                          <Th>Participants</Th>
                          <Th>Last Updated</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {conversations.map((conversation) => (
                          <Tr key={conversation.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <HStack spacing={3}>
                                <Image
                                  src={conversation.productImage || '/default-image.jpg'}
                                  alt={conversation.productTitle}
                                  width="40px"
                                  height="40px"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium" noOfLines={1}>
                                    {conversation.productTitle}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    ₦{conversation.productPrice?.toLocaleString()}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Td>
                            <Td>
                              <Text noOfLines={2} fontSize="sm">
                                {conversation.lastMessage}
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm">
                                {conversation.participants?.length || 0} users
                              </Text>
                            </Td>
                            <Td>
                              {conversation.lastUpdated?.toDate?.().toLocaleDateString() || 'N/A'}
                            </Td>
                            <Td>
                              <IconButton
                                icon={<Eye size={14} />}
                                size="sm"
                                variant="ghost"
                                onClick={() => {/* View conversation logic */}}
                                aria-label="View conversation"
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </MotionBox>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* Product Details Modal */}
      <Modal isOpen={isProductModalOpen} onClose={onProductModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProduct && (
              <Grid templateColumns="1fr 2fr" gap={6}>
                <Box>
                  <Image
                    src={selectedProduct.imageUrl || '/default-image.jpg'}
                    alt={selectedProduct.title}
                    borderRadius="lg"
                    objectFit="cover"
                    height="200px"
                    width="100%"
                  />
                </Box>
                <Box>
                  <Heading size="lg" mb={2}>{selectedProduct.title}</Heading>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600" mb={3}>
                    ₦{selectedProduct.price?.toLocaleString()}
                  </Text>
                  
                  <VStack align="start" spacing={2} mb={4}>
                    <HStack>
                      <Badge colorScheme="green">{selectedProduct.condition}</Badge>
                      <Badge>{selectedProduct.category}</Badge>
                    </HStack>
                    <Text><strong>Location:</strong> {selectedProduct.location}</Text>
                    <Text><strong>Posted:</strong> {selectedProduct.createdAt?.toDate?.().toLocaleDateString()}</Text>
                    <Text><strong>Expires:</strong> {selectedProduct.expiryDate?.toDate?.().toLocaleDateString()}</Text>
                    <Text><strong>Views:</strong> {selectedProduct.views || 0}</Text>
                  </VStack>

                  <Text mb={4}>{selectedProduct.description}</Text>

                  {selectedProduct.seller && (
                    <Card variant="outline">
                      <CardBody>
                        <Heading size="sm" mb={2}>Seller Information</Heading>
                        <VStack align="start" spacing={1}>
                          <Text><strong>Name:</strong> {selectedProduct.seller.displayName}</Text>
                          <Text><strong>Email:</strong> {selectedProduct.seller.email}</Text>
                          <Text><strong>Phone:</strong> {selectedProduct.seller.phone || 'Not provided'}</Text>
                          <Text><strong>Location:</strong> {selectedProduct.seller.location || 'Not provided'}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </Box>
              </Grid>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onProductModalClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => window.open(`/product/${selectedProduct?.id}`, '_blank')}>
              View Live
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* User Details Modal */}
      <Modal isOpen={isUserModalOpen} onClose={onUserModalClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <Grid templateColumns="1fr 2fr" gap={6}>
                <VStack spacing={4}>
                  <Avatar size="2xl" name={selectedUser.displayName} src={selectedUser.photoURL} />
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => openEmailModal(selectedUser.email)}
                  >
                    Send Email
                  </Button>
                  {selectedUser.status !== 'banned' && (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => openBanModal(selectedUser)}
                    >
                      Ban User
                    </Button>
                  )}
                </VStack>
                <VStack align="start" spacing={4}>
                  <Box>
                    <Heading size="lg">{selectedUser.displayName || 'No Name'}</Heading>
                    <Text color="gray.600">{selectedUser.email}</Text>
                  </Box>
                  
                  <SimpleGrid columns={2} gap={4} width="100%">
                    <Stat>
                      <StatLabel>Phone</StatLabel>
                      <StatNumber fontSize="lg">{selectedUser.phone || 'Not provided'}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Location</StatLabel>
                      <StatNumber fontSize="lg">{selectedUser.location || 'Not provided'}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Plan</StatLabel>
                      <StatNumber fontSize="lg">
                        <Badge colorScheme={
                          selectedUser.plan === 'premium' ? 'purple' :
                          selectedUser.plan === 'pro' ? 'blue' :
                          selectedUser.plan === 'featured' ? 'orange' : 'gray'
                        }>
                          {selectedUser.plan}
                        </Badge>
                      </StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Status</StatLabel>
                      <StatNumber fontSize="lg">
                        <Badge colorScheme={selectedUser.status === 'banned' ? 'red' : 'green'}>
                          {selectedUser.status || 'active'}
                        </Badge>
                      </StatNumber>
                    </Stat>
                  </SimpleGrid>

                  {selectedUser.bio && (
                    <Box>
                      <Heading size="sm" mb={2}>Bio</Heading>
                      <Text>{selectedUser.bio}</Text>
                    </Box>
                  )}

                  <Box width="100%">
                    <Heading size="sm" mb={2}>Products ({selectedUser.products?.length || 0})</Heading>
                    <VStack align="start" spacing={2}>
                      {selectedUser.products?.slice(0, 3).map(product => (
                        <HStack key={product.id} spacing={3}>
                          <Image
                            src={product.imageUrl || '/default-image.jpg'}
                            alt={product.title}
                            width="40px"
                            height="40px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <Box>
                            <Text fontWeight="medium" fontSize="sm">{product.title}</Text>
                            <Text fontSize="xs" color="gray.500">₦{product.price?.toLocaleString()}</Text>
                          </Box>
                        </HStack>
                      ))}
                      {selectedUser.products?.length > 3 && (
                        <Text fontSize="sm" color="gray.500">
                          +{selectedUser.products.length - 3} more products
                        </Text>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Send Email Modal */}
      <Modal isOpen={isEmailModalOpen} onClose={onEmailModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Email to User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>To</FormLabel>
                <Input
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="user@example.com"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Email subject"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your message here..."
                  rows={6}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEmailModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSendEmail}>
              Send Email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Ban User Modal */}
      <AlertDialog isOpen={isBanModalOpen} onClose={onBanModalClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Ban User</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to ban {userToBan?.displayName || userToBan?.email}? 
              This will deactivate all their products and prevent them from using the platform.
              <Input
                mt={3}
                placeholder="Reason for banning (optional)"
                onChange={(e) => setUserToBan(prev => ({ ...prev, banReason: e.target.value }))}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onBanModalClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => handleBanUser(userToBan.id, userToBan.banReason)}>
                Ban User
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AdminDashboard;