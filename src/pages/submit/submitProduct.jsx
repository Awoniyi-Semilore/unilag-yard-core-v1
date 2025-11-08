import React, { useState } from 'react';
import { 
  Box, Grid, GridItem, Heading, Text, Input, FormControl, FormLabel, 
  Button, VStack, Image, useColorModeValue, RadioGroup, Stack, Radio,
  Textarea, Checkbox, SimpleGrid, Badge, useBreakpointValue, 
  useToast, Progress, Alert, AlertIcon, HStack, IconButton,
  Collapse, Spinner
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { 
  Flame, MapPin, MessageCircle, Upload, X, Camera, 
  Zap, Shield, Crown, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Import from your firebase.js file

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const SubmitProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Form states
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [condition, setCondition] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Enhanced UI states
  const [characterCount, setCharacterCount] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const bgRight = useColorModeValue("gray.50", "gray.800");
  
  // Responsive values
  const gridTemplate = useBreakpointValue({ 
    base: "1fr", 
    lg: "1fr 1fr" 
  });
  
  const previewSticky = useBreakpointValue({
    base: false,
    lg: true
  });
  
  const previewHeight = useBreakpointValue({
    base: "auto",
    lg: "100vh"
  });
  
  const previewPadding = useBreakpointValue({
    base: 4,
    lg: 8
  });
  
  const formMaxWidth = useBreakpointValue({
    base: "100%",
    md: "500px"
  });
  
  const categoryColumns = useBreakpointValue({
    base: 1,
    sm: 2
  });

  // Enhanced categories with icons
  const categories = {
    "Textbooks & Academic": ["Core Course Textbooks", "Recommended Reads", "Study Guides", "Stationery"],
    "Electronics & Gadgets": ["Phones & Smartphones", "Laptops & Computers", "Tablets", "Headphones"],
    "Hostel & Room Essentials": ["Mattresses & Beddings", "Fans & Cooling", "Cooking Appliances"],
    "Fashion & Clothing": ["Casual Wear", "Formal Wear", "Shoes & Footwear", "UNILAG Merchandise"],
    "Services": ["Photocopy & Printing", "Typing & Project Work", "Hair Styling"],
    "Tickets & Events": ["Concert Tickets", "Event Wristbands", "Workshop Passes"],
    "Free Stuff": ["Giveaways", "Old Notes", "Other Free Items"]
  };

  // Plan features
  const planFeatures = {
    standard: ["7 days listing", "Basic visibility", "Standard support"],
    featured: ["14 days listing", "Featured placement", "Priority in search", "Enhanced visibility"],
    pro: ["30 days listing", "Featured + Pro badge", "Analytics dashboard", "Priority support"],
    premium: ["60 days listing", "Top placement", "Social media promotion", "24/7 priority support", "Performance analytics"]
  };

  // ImgBB API Key - Store this in environment variables in production
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const uploadToImgBB = async (file) => {
    if (!IMGBB_API_KEY) {
      throw new Error('ImgBB API key is missing. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw new Error('Failed to upload image to ImgBB');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, WebP, etc.)",
        status: "error",
        duration: 3000,
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsUploadingImage(true);
    clearFormError('image');

    try {
      // Upload to ImgBB
      setUploadProgress(30);
      const uploadedImageUrl = await uploadToImgBB(file);
      setUploadProgress(100);
      
      setImageFile({
        file: file,
        url: uploadedImageUrl
      });
      
      toast({
        title: "Image uploaded successfully!",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Image upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategories([]);
    clearFormError('category');
  };

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(item => item !== subcategory)
        : [...prev, subcategory]
    );
    clearFormError('subcategories');
  };

  const removeSubcategory = (subcategory) => {
    setSelectedSubcategories(prev => prev.filter(item => item !== subcategory));
  };

  const clearFormError = (field) => {
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!selectedPlan) errors.plan = 'Please select a plan';
    if (!selectedCategory) errors.category = 'Please select a category';
    if (selectedSubcategories.length === 0) errors.subcategories = 'Please select at least one subcategory';
    if (!title.trim()) errors.title = 'Please enter a product title';
    if (!price.trim()) errors.price = 'Please enter a price';
    if (!description.trim()) errors.description = 'Please enter a description';
    if (!location.trim()) errors.location = 'Please enter a pickup location';
    if (!condition) errors.condition = 'Please select product condition';
    if (!imageFile) errors.image = 'Please upload a product image';

    // Price validation
    if (price && (parseFloat(price) < 0 || parseFloat(price) > 10000000)) {
      errors.price = 'Price must be between ₦0 and ₦10,000,000';
    }

    // Title length validation
    if (title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data
      const productData = {
        title: title.trim(),
        price: parseFloat(price),
        description: description.trim(),
        location: location.trim(),
        condition,
        category: selectedCategory,
        subcategories: selectedSubcategories,
        plan: selectedPlan,
        imageUrl: imageFile.url,
        status: 'active',
        featured: selectedPlan === 'featured' || selectedPlan === 'premium',
        premium: selectedPlan === 'premium',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        // Remove or handle user authentication properly
        // userId: currentUser?.uid,
        // userEmail: currentUser?.email,
        // userName: currentUser?.displayName,
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log('Product submitted with ID: ', docRef.id);

      // Show success state
      setShowSuccess(true);
      
      toast({
        title: "Product Listed Successfully! 🎉",
        description: "Your product is now live on the marketplace",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to home page after delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error submitting product:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setCharacterCount(value.length);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    
    if (value && (parseFloat(value) < 0 || parseFloat(value) > 10000000)) {
      setPriceError('Price must be between ₦0 and ₦10,000,000');
    } else {
      setPriceError('');
    }
    clearFormError('price');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'standard': return <Zap size={16} />;
      case 'featured': return <Flame size={16} />;
      case 'pro': return <Shield size={16} />;
      case 'premium': return <Crown size={16} />;
      default: return <Zap size={16} />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Grid templateColumns={gridTemplate} gap={0}>
        {/* Left Side - Product Preview */}
        <GridItem 
          bg="green.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={previewPadding}
          position={previewSticky ? "sticky" : "relative"}
          top={previewSticky ? "0" : "auto"}
          height={previewHeight}
          order={{ base: 2, lg: 1 }}
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              maxW="400px" 
              w="100%"
              bg="white"
              borderRadius="16px"
              boxShadow="0 8px 32px rgba(0,0,0,0.15)"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box position="relative" className="card-image-container">
                {/* Image Preview */}
                {imagePreview ? (
                  <>
                    <Image 
                      src={imagePreview} 
                      alt='Preview' 
                      w="100%"
                      h="200px"
                      objectFit="cover"
                    />
                    {isUploadingImage && (
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        bg="blackAlpha.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        gap={2}
                      >
                        <Spinner size="lg" color="white" />
                        <Text color="white" fontSize="sm">
                          Uploading {uploadProgress}%
                        </Text>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    w="100%"
                    h="200px"
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.500"
                    bg="gray.50"
                    flexDirection="column"
                    gap={2}
                  >
                    <Camera size={32} />
                    <Text fontSize="sm" textAlign="center">Product Image Preview</Text>
                  </Box>
                )}
                
                {/* Featured Badge */}
                {(selectedPlan === 'featured' || selectedPlan === 'premium') && ( 
                  <MotionBox
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    position="absolute"
                    top="8px"
                    left="8px"
                    bg="orange.500"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="6px"
                    fontSize="xs"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Flame size={12} />
                    Featured
                  </MotionBox>
                )}
                
                {/* Condition Badge */}
                {condition && (
                  <MotionBox
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    position="absolute"
                    top="8px"
                    right="8px"
                    bg="green.500"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="6px"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {condition}
                  </MotionBox>
                )}

                {/* Remove Image Button */}
                {imagePreview && !isUploadingImage && (
                  <IconButton
                    icon={<X size={14} />}
                    aria-label="Remove image"
                    position="absolute"
                    top="8px"
                    right={condition ? "60px" : "8px"}
                    size="xs"
                    colorScheme="red"
                    onClick={removeImage}
                  />
                )}
              </Box>
                                    
              <Box p={4}>
                <Box mb={3}>
                  <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    color="gray.800"
                    noOfLines={2}
                    minH="56px"
                  >
                    {title || "Product Title"}
                  </Text>
                  <Box mt={1}>
                    {price && (
                      <Text fontSize="xl" fontWeight="bold" color="green.600">
                        {formatPrice(price)}
                      </Text>
                    )}
                  </Box>
                </Box>
                                      
                <Text 
                  color="gray.600" 
                  fontSize="sm"
                  noOfLines={3}
                  mb={3}
                  minH="60px"
                >
                  {description || "Product description will appear here..."}
                </Text>         
                
                {/* Categories Display */}
                {selectedCategory && (
                  <Box mb={3}>
                    <Badge colorScheme="green" mr={2} mb={1}>
                      {selectedCategory}
                    </Badge>
                    {selectedSubcategories.map((subcat, index) => (
                      <Badge key={index} colorScheme="blue" mr={1} mb={1} fontSize="2xs">
                        {subcat}
                      </Badge>
                    ))}
                  </Box>
                )}

                <Box mb={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MapPin size={14} color="#666" />
                    <Text fontSize="sm" color="gray.600">
                      {location || "Pickup location"}
                    </Text>
                  </Box>
                </Box>
                                      
                <Box>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={1}
                    color="green.600"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    <MessageCircle size={16} />
                    Click to view details
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  mt={4}
                >
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Product Listed Successfully!</Text>
                      <Text fontSize="sm">Redirecting to homepage...</Text>
                    </Box>
                  </Alert>
                </MotionBox>
              )}
            </AnimatePresence>
          </MotionBox>
        </GridItem>

        {/* Right Side - Form */}
        <GridItem 
          bg={bgRight}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          p={{ base: 4, md: 8 }}
          minH="100vh"
          marginTop={{ 
            base: "65px",
            sm: "70px",
            md: "60px",
            lg: "50px",
            xl: "40px"
          }}
          order={{ base: 1, lg: 2 }}
        >
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            w="100%"
            maxW={formMaxWidth}
            p={{ base: 4, md: 6 }}
            borderWidth="1px"
            borderRadius="20px"
            boxShadow="0 8px 32px rgba(0,0,0,0.1)"
            bg="white"
            my={{ base: 2, md: 8 }}
          >
            <Box mb={6}>
              <Heading size="lg" mb={2} color="gray.800">
                List Your Product
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Fill in the details to get your product listed on UNILAG Market
              </Text>
            </Box>
            
            <VStack spacing={6} align="stretch">

              {/* Image Upload */}
              <FormControl isInvalid={formErrors.image}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm" display="flex" alignItems="center" gap={2}>
                  <Camera size={16} />
                  Product Image *
                </FormLabel>
                <Box
                  border="2px dashed"
                  borderColor={formErrors.image ? "red.300" : "gray.300"}
                  borderRadius="12px"
                  p={{ base: 4, md: 6 }}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: formErrors.image ? "red.400" : "green.500" }}
                  onClick={() => document.getElementById('image-upload').click()}
                  bg={formErrors.image ? "red.50" : "transparent"}
                  transition="all 0.2s"
                >
                  {isUploadingImage ? (
                    <VStack spacing={2}>
                      <Spinner size="lg" color="green.500" />
                      <Text color="green.600" fontSize="sm">Uploading...</Text>
                      <Progress value={uploadProgress} size="sm" width="80%" colorScheme="green" />
                    </VStack>
                  ) : (
                    <>
                      <Upload size={24} color="#666" style={{ margin: '0 auto 8px' }} />
                      <Text color="gray.600" mb={2} fontSize="sm">Click to upload product image</Text>
                      <Text fontSize="xs" color="gray.500">JPG, PNG, WebP (Max 5MB)</Text>
                    </>
                  )}
                </Box>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  display="none"
                />
                {formErrors.image && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.image}
                  </Text>
                )}
              </FormControl>

              {/* Title Input */}
              <FormControl isInvalid={formErrors.title}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                  Product Title *
                </FormLabel>
                <Input
                  placeholder='e.g., MacBook Pro 2020 - Excellent Condition'
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    clearFormError('title');
                  }}
                  focusBorderColor="green.500"
                  bg="white"
                  size="md"
                  maxLength={100}
                />
                <HStack justify="space-between" mt={1}>
                  {formErrors.title ? (
                    <Text color="red.500" fontSize="xs">{formErrors.title}</Text>
                  ) : (
                    <Text fontSize="xs" color="gray.500">
                      {title.length}/100 characters
                    </Text>
                  )}
                  {title.length > 80 && (
                    <Text fontSize="xs" color="orange.500">
                      Getting long
                    </Text>
                  )}
                </HStack>
              </FormControl>

              {/* Plan Selection */}
              <FormControl isInvalid={formErrors.plan}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm" display="flex" alignItems="center" gap={2}>
                  <Crown size={16} />
                  Choose Your Plan *
                </FormLabel>
                <RadioGroup onChange={setSelectedPlan} value={selectedPlan}>
                  <Stack direction="column" spacing={3}>
                    {['standard', 'featured', 'pro', 'premium'].map((plan) => (
                      <MotionBox
                        key={plan}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Box
                          p={3}
                          border="2px solid"
                          borderColor={selectedPlan === plan ? "green.500" : "gray.200"}
                          borderRadius="12px"
                          cursor="pointer"
                          bg={selectedPlan === plan ? "green.50" : "white"}
                          _hover={{ borderColor: "green.500" }}
                          onClick={() => {
                            setSelectedPlan(plan);
                            clearFormError('plan');
                          }}
                          position="relative"
                          overflow="hidden"
                        >
                          <Radio value={plan} colorScheme="green" size="md">
                            <Box ml={3}>
                              <HStack align="center" mb={1}>
                                {getPlanIcon(plan)}
                                <Text fontWeight="600" fontSize="sm" textTransform="capitalize">
                                  {plan} Plan
                                </Text>
                                {plan === 'premium' && (
                                  <Badge colorScheme="green" fontSize="2xs">MOST POPULAR</Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                {plan === 'standard' && '₦500 - One Time Payment'}
                                {plan === 'featured' && '₦1,000 - One Time Payment'}
                                {plan === 'pro' && '₦1,500 - Monthly Subscription'}
                                {plan === 'premium' && '₦2,000 - Monthly Subscription'}
                              </Text>
                              <Collapse in={selectedPlan === plan}>
                                {/* <Box mt={2}>
                                  <Text fontSize="2xs" color="gray.600" fontWeight="500">
                                    Features:
                                  </Text>
                                  <VStack align="start" spacing={0} mt={1}>
                                    {planFeatures[plan]?.map((feature, index) => (
                                      <HStack key={index} spacing={1}>
                                        <CheckCircle size={10} color="green.500" />
                                        <Text fontSize="2xs" color="gray.600">{feature}</Text>
                                      </HStack>
                                    ))}
                                  </VStack>
                                </Box> */}
                              </Collapse>
                            </Box>
                          </Radio>
                        </Box>
                      </MotionBox>
                    ))}
                  </Stack>
                </RadioGroup>
                {formErrors.plan && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.plan}
                  </Text>
                )}
              </FormControl>

              {/* Category Selection */}
              <FormControl isInvalid={formErrors.category}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                  Category *
                </FormLabel>
                <SimpleGrid columns={categoryColumns} spacing={2}>
                  {Object.keys(categories).map((category) => (
                    <MotionBox
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Box
                        p={2}
                        border="2px solid"
                        borderColor={selectedCategory === category ? "green.500" : "gray.200"}
                        borderRadius="8px"
                        cursor="pointer"
                        textAlign="center"
                        bg={selectedCategory === category ? "green.50" : "white"}
                        _hover={{ borderColor: "green.500" }}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <Text fontSize="xs" fontWeight="500">{category}</Text>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
                {formErrors.category && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.category}
                  </Text>
                )}
              </FormControl>

              {/* Subcategory Selection */}
              {selectedCategory && (
                <FormControl isInvalid={formErrors.subcategories}>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Subcategories for {selectedCategory} *
                  </FormLabel>
                  <Text fontSize="xs" color="gray.600" mb={2}>
                    Select one or more subcategories
                  </Text>
                  <SimpleGrid columns={1} spacing={1}>
                    {categories[selectedCategory].map((subcategory) => (
                      <Checkbox
                        key={subcategory}
                        colorScheme="green"
                        size="sm"
                        isChecked={selectedSubcategories.includes(subcategory)}
                        onChange={() => handleSubcategoryToggle(subcategory)}
                      >
                        <Text fontSize="sm">{subcategory}</Text>
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                  
                  {/* Selected Subcategories Display */}
                  {selectedSubcategories.length > 0 && (
                    <Box mt={3}>
                      <Text fontSize="sm" fontWeight="600" mb={1}>Selected Subcategories:</Text>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedSubcategories.map((subcat) => (
                          <Badge 
                            key={subcat} 
                            colorScheme="blue" 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                            px={2}
                            py={1}
                            borderRadius="6px"
                            fontSize="xs"
                          >
                            {subcat}
                            <X 
                              size={10} 
                              cursor="pointer" 
                              onClick={() => removeSubcategory(subcat)}
                            />
                          </Badge>
                        ))}
                      </Box>
                    </Box>
                  )}
                  {formErrors.subcategories && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {formErrors.subcategories}
                    </Text>
                  )}
                </FormControl>
              )}

              {/* Condition Input */}
              <FormControl isInvalid={formErrors.condition}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                  Product Condition *
                </FormLabel>
                <RadioGroup onChange={setCondition} value={condition}>
                  <SimpleGrid columns={2} spacing={2}>
                    {['Brand New', 'Good Condition', 'Fair Condition', 'Manageable Condition'].map((cond) => (
                      <Box
                        key={cond}
                        p={2}
                        border="1px solid"
                        borderColor={condition === cond ? "green.500" : "gray.200"}
                        borderRadius="8px"
                        cursor="pointer"
                        bg={condition === cond ? "green.50" : "white"}
                        _hover={{ borderColor: "green.500" }}
                        onClick={() => {
                          setCondition(cond);
                          clearFormError('condition');
                        }}
                      >
                        <Radio value={cond} colorScheme="green" size="sm" isChecked={condition === cond}>
                          <Text fontSize="sm">{cond}</Text>
                        </Radio>
                      </Box>
                    ))}
                  </SimpleGrid>
                </RadioGroup>
                {formErrors.condition && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.condition}
                  </Text>
                )}
              </FormControl>

              {/* Price Input */}
              <FormControl isInvalid={formErrors.price || priceError}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                  Price (₦) *
                </FormLabel>
                <Input
                  placeholder='Enter price in Naira'
                  value={price}
                  onChange={handlePriceChange}
                  focusBorderColor="green.500"
                  bg="white"
                  size="md"
                  type="number"
                  min="0"
                  max="10000000"
                />
                {(formErrors.price || priceError) && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.price || priceError}
                  </Text>
                )}
                {price && !priceError && !formErrors.price && (
                  <Text fontSize="xs" color="green.600" mt={1}>
                    Listed as: {formatPrice(price)}
                  </Text>
                )}
              </FormControl>

              {/* Description Input */}
              <FormControl isInvalid={formErrors.description}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                  Description *
                </FormLabel>
                <Textarea
                  placeholder='Describe your product in detail... Include features, condition, reason for selling, etc.'
                  value={description}
                  onChange={handleDescriptionChange}
                  focusBorderColor="green.500"
                  bg="white"
                  size="md"
                  rows={4}
                  resize="vertical"
                />
                <HStack justify="space-between" mt={1}>
                  {formErrors.description ? (
                    <Text color="red.500" fontSize="xs">{formErrors.description}</Text>
                  ) : (
                    <Text fontSize="xs" color="gray.500">
                      {characterCount}/500 characters
                    </Text>
                  )}
                  {characterCount > 400 && (
                    <Text fontSize="xs" color="orange.500">
                      Approaching limit
                    </Text>
                  )}
                </HStack>
              </FormControl>

              {/* Location Input */}
              <FormControl isInvalid={formErrors.location}>
                <FormLabel color="gray.700" fontWeight="600" fontSize="sm" display="flex" alignItems="center" gap={2}>
                  <MapPin size={16} />
                  Pickup Location *
                </FormLabel>
                <Input
                  placeholder='e.g., Moremi Hall, Library Steps, Faculty of Science'
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    clearFormError('location');
                  }}
                  focusBorderColor="green.500"
                  bg="white"
                  size="md"
                />
                {formErrors.location && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.location}
                  </Text>
                )}
              </FormControl>

              {/* Submit Button */}
              <MotionButton
                colorScheme="green"
                size="md"
                height="48px"
                fontSize="16px"
                fontWeight="600"
                isLoading={isSubmitting}
                loadingText="Submitting..."
                onClick={handleSubmit}
                mt={4}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                isDisabled={showSuccess}
              >
                {showSuccess ? (
                  <HStack>
                    <CheckCircle size={20} />
                    <Text>Product Listed Successfully!</Text>
                  </HStack>
                ) : (
                  <HStack>
                    <Zap size={20} />
                    <Text>🚀 List Product Now</Text>
                  </HStack>
                )}
              </MotionButton>

              {/* Quick Tips */}
              <Collapse in={!isSubmitting}>
                <Alert status="info" borderRadius="md" fontSize="sm">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">Pro Tip</Text>
                    <Text fontSize="xs">Clear photos and detailed descriptions get more views and sell faster!</Text>
                  </Box>
                </Alert>
              </Collapse>
            </VStack>
          </MotionBox>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default SubmitProduct;



// import React, { useState } from 'react'
// import '../../component/CSS/Home.css'
// import {  Flame,
//   MapPin, Clock, MessageCircle
// } from "lucide-react";
// import {Box, Grid, GridItem, Heading, Text, Input, FormControl, FormLabel, Button, VStack, Image, useColorModeValue, RadioGroup, Stack, Radio,} from "@chakra-ui/react"

// const submitProduct = () => {

//   const [ifFeatured, setFeatured] = useState(null);
//   const [condition, setCondition] = useState("");
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setlocation] = useState("");
//   const [image, setImage] = useState(null);
//   const bgRight = useColorModeValue("white","gray.800");
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file); //Create temporary preview link
//       setImage(imageUrl);
//     }
//   };

//   return (
//     <Grid templateColumns={{base: "1fr", md: "1fr 1fr"}} minH="100vh">
//       <div className='homeCard'>
//         <div className="card-image-container">
//           {/*  Image Preview */}
//           {image ? (
//             <Image 
//               src={image} 
//               alt='Preview' 
//               mt={6} 
//               boxSize={{base: "200px", md: "250px"}} 
//               objectFit="cover" 
//               borderRadius="2xl" 
//               boxshadow= "1g"
//             />
//           ) : (
//             <Box
//               mt={6}
//               boxSize={{base: "200px", md: "250px"}}
//               border="2px dashed gray"
//               borderRadius="2xl" 
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               color="gray.400"
//             >
//               No image yet
//             </Box>
//           )}
//           {ifFeatured === "featured" ( 
//             <div className="featured-badge">
//               <Flame size={12} />
//                 Featured
//             </div>
//           )}
//             {/* if featured product display this */}
//           <div className="condition-badge">{condition} </div>
//         </div>
                                
//         <div className="card-content">
//           <div className="card-header">
//             <h3 className="product-title"> {title} </h3>
//             <div className="price-section">{price}</div>
//           </div>
                                  
//           <p className="product-description">{description} </p>         
//           <div className="product-meta">
//             <div className="meta-item">
//               <MapPin size={14} />
//               <span>{location} </span>
//             </div>
//           </div>
                                  
//           <div className="card-actions">
//             <div className="see-more-indicator">
//               <MessageCircle size={16} />
//               Click to view details
//             </div>
//           </div>
//         </div>
//       </div>


//       <GridItem 
//         bg={Right}
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         p={6}
//       >
//         <Box
//           w="100%"
//           maxW="400px"
//           p={6}
//           borderWidth="1px"
//           borderRadius="2xl"
//           boxShadow="1g"
//           bg={useColorModeValue("gray.50", "gray.700")}
//         >
//           <Heading size="md" mb={4}>
//             Enter Product details
//           </Heading>
//           <VStack spacing={4} align="stretch">

//             {/* Name Input */}
//             <FormControl>
//               <FormLabel>Product Title</FormLabel>
//               <Input
//                 placeholder='Enter the name of your product'
//                 value={name}
//                 onChange= {(e) => setTitle(e.target.value)}
//                 focusBorderColor="blue.500"
//               />
//             </FormControl>

//             {/* Featured Input */}
//             <FormControl>
//               <FormLabel>Choose the plan you paid for</FormLabel>
//               <RadioGroup onChange={setFeatured} value={ifFeatured}>
//                 <Stack direction="column">
//                   <Radio value='null' >Standard Plan</Radio>
//                   <Radio value='featured' >Featured Plan</Radio>
//                   <Radio value='null' >Pro Plan</Radio>
//                   <Radio value='featured' >Premium Plan</Radio>
//                 </Stack>
//               </RadioGroup>
//             </FormControl>

//             {/* Condition Input */}
//             <FormControl>
//               <FormLabel>Product Condition</FormLabel>
//               <RadioGroup onChange={setCondition} value={condition}>
//                 <Stack direction="column">
//                   <Radio value='Good Shape' >Good Condition</Radio>
//                   <Radio value='Fairly used' >fair Condition</Radio>
//                   <Radio value='New Item' >Brand new</Radio>
//                   <Radio value='manageable condition' >'Not that bad' Condition</Radio>
//                 </Stack>
//               </RadioGroup>
//             </FormControl>

//             {/* price Input */}
//             <FormControl>
//               <FormLabel>Product Price</FormLabel>
//               <Input
//                 placeholder='Enter the price of your product'
//                 value={name}
//                 onChange= {(e) => setPrice(e.target.value)}
//                 focusBorderColor="blue.500"
//               />
//             </FormControl>

//             {/* Description Input */}
//             <FormControl>
//               <FormLabel>Product Description</FormLabel>
//               <Input
//                 placeholder='In few words, describe your product'
//                 value={name}
//                 onChange= {(e) => setDescription(e.target.value)}
//                 focusBorderColor="blue.500"
//               />
//             </FormControl>

//             {/* location Input */}
//             <FormControl>
//               <FormLabel>Product pickup location</FormLabel>
//               <Input
//                 placeholder='Enter a suitable place on campus for your product pickup'
//                 value={name}
//                 onChange= {(e) => setTitle(e.target.value)}
//                 focusBorderColor="blue.500"
//               />
//             </FormControl>

//           </VStack>
//         </Box>
//       </GridItem>
//     </Grid>
//   )
// }

// export default submitProduct
