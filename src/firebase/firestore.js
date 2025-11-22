import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './index';
import { setDoc } from 'firebase/firestore';

// ==================== PRODUCT OPERATIONS ====================

export const addProduct = async (productData) => {
  try {
    const productRef = await addDoc(collection(db, 'products'), {
      ...productData,
      status: 'active',
      views: 0,
      savedCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      success: true,
      productId: productRef.id
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return {
      success: false,
      error: 'Failed to add product. Please try again.'
    };
  }
};

export const getProducts = async (options = {}) => {
  try {
    let productsQuery = collection(db, 'products');
    const constraints = [];

    if (options.featured) {
      constraints.push(where('featured', '==', true));
    }

    if (options.category && options.category !== 'all') {
      constraints.push(where('category', '==', options.category));
    }

    if (options.status) {
      constraints.push(where('status', '==', options.status));
    } else {
      constraints.push(where('status', '==', 'active'));
    }

    if (options.userId) {
      constraints.push(where('sellerId', '==', options.userId));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    productsQuery = query(productsQuery, ...constraints);
    const querySnapshot = await getDocs(productsQuery);

    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate() || new Date(),
    }));

    return {
      success: true,
      products
    };
  } catch (error) {
    console.error('Error getting products:', error);
    return {
      success: false,
      error: 'Failed to load products.',
      products: []
    };
  }
};

export const getProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      await updateDoc(productRef, {
        views: increment(1)
      });

      return {
        success: true,
        product: {
          id: productSnap.id,
          ...productSnap.data(),
          createdAt: productSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: productSnap.data().updatedAt?.toDate() || new Date(),
          expiresAt: productSnap.data().expiresAt?.toDate() || new Date(),
        }
      };
    }

    return {
      success: false,
      error: 'Product not found.'
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return {
      success: false,
      error: 'Failed to load product.'
    };
  }
};

export const getProductsByIds = async (productIds) => {
  try {
    if (!productIds || productIds.length === 0) {
      return { success: true, products: [] };
    }

    const products = [];
    
    for (const productId of productIds) {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.data();
          if (productData.status === 'active') {
            products.push({
              id: productSnap.id,
              ...productData,
              createdAt: productData.createdAt?.toDate() || new Date(),
              updatedAt: productData.updatedAt?.toDate() || new Date(),
              expiresAt: productData.expiresAt?.toDate() || new Date(),
            });
          }
        }
      } catch (error) {
        console.warn(`Cannot access product ${productId}:`, error.message);
        continue;
      }
    }

    return {
      success: true,
      products
    };
  } catch (error) {
    console.error('Error getting products by IDs:', error);
    return {
      success: false,
      error: 'Failed to load products.',
      products: []
    };
  }
};

export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: 'Failed to update product.'
    };
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: 'Failed to delete product.'
    };
  }
};

// ==================== SAVED PRODUCTS ====================

export const saveProductForUser = async (userId, productId) => {
  try {
    const savedProductRef = doc(db, 'savedProducts', `${userId}_${productId}`);
    
    await setDoc(savedProductRef, {
      userId,
      productId,
      savedAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'products', productId), {
      savedCount: increment(1)
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving product:', error);
    return {
      success: false,
      error: 'Failed to save product.'
    };
  }
};

export const unsaveProductForUser = async (userId, productId) => {
  try {
    await deleteDoc(doc(db, 'savedProducts', `${userId}_${productId}`));

    await updateDoc(doc(db, 'products', productId), {
      savedCount: increment(-1)
    });

    return { success: true };
  } catch (error) {
    console.error('Error unsaving product:', error);
    return {
      success: false,
      error: 'Failed to unsave product.'
    };
  }
};

export const isProductSaved = async (userId, productId) => {
  try {
    const savedProductRef = doc(db, 'savedProducts', `${userId}_${productId}`);
    const savedProductSnap = await getDoc(savedProductRef);
    return { success: true, saved: savedProductSnap.exists() };
  } catch (error) {
    return { success: false, saved: false };
  }
};

export const getSavedProducts = async (userId) => {
  try {
    console.log('🔍 Fetching saved products for user:', userId);
    
    const savedProductsQuery = query(
      collection(db, 'savedProducts'),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc')
    );

    const querySnapshot = await getDocs(savedProductsQuery);
    console.log('📋 Found saved products:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      return { success: true, products: [] };
    }

    const savedItems = querySnapshot.docs.map(doc => ({
      savedId: doc.id,
      ...doc.data(),
      savedAt: doc.data().savedAt?.toDate() || new Date()
    }));

    console.log('📝 Saved items:', savedItems);
    const productIds = savedItems.map(item => item.productId);
    console.log('🆔 Product IDs to fetch:', productIds);

    const productsResult = await getProductsByIds(productIds);
    console.log('📦 Products fetched:', productsResult.products.length);
    
    const productsWithSavedInfo = productsResult.products.map(product => {
      const savedItem = savedItems.find(item => item.productId === product.id);
      return {
        ...product,
        savedId: savedItem?.savedId,
        savedAt: savedItem?.savedAt
      };
    }).filter(product => product !== null);

    console.log('🎉 Final products with saved info:', productsWithSavedInfo.length);
    return { 
      success: true, 
      products: productsWithSavedInfo 
    };
  } catch (error) {
    console.error('💥 Error getting saved products:', error);
    
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: 'Permission denied. Please make sure you are logged in.',
        products: []
      };
    }
    
    return {
      success: false,
      error: 'Failed to load saved products.',
      products: []
    };
  }
};

export const getSavedProductsWithDetails = async (userId) => {
  try {
    console.log('🔍 [WithDetails] Fetching saved products for user:', userId);
    
    const savedProductsQuery = query(
      collection(db, 'savedProducts'),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc')
    );

    const querySnapshot = await getDocs(savedProductsQuery);
    console.log('📋 [WithDetails] Found saved products:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log('❌ [WithDetails] No saved products found');
      return { success: true, products: [] };
    }

    const savedItems = querySnapshot.docs.map(doc => ({
      savedId: doc.id,
      ...doc.data(),
      savedAt: doc.data().savedAt?.toDate() || new Date()
    }));

    console.log('📝 [WithDetails] Saved items:', savedItems);
    const productIds = savedItems.map(item => item.productId);
    console.log('🆔 [WithDetails] Product IDs to fetch:', productIds);

    const productsMap = new Map();
    
    // Fetch products individually with better error handling
    for (const productId of productIds) {
      try {
        console.log(`🔍 [WithDetails] Fetching product: ${productId}`);
        const productDoc = await getDoc(doc(db, 'products', productId));
        
        if (productDoc.exists()) {
          const productData = productDoc.data();
          console.log(`✅ [WithDetails] Product ${productId} exists, status:`, productData.status);
          
          // Include all products regardless of status for saved items
          // This ensures users can see products they've saved even if they're not active
          productsMap.set(productId, {
            id: productDoc.id,
            ...productData,
            createdAt: productData.createdAt?.toDate() || new Date(),
            updatedAt: productData.updatedAt?.toDate() || new Date(),
            expiresAt: productData.expiresAt?.toDate() || new Date(),
          });
          console.log(`🎯 [WithDetails] Added product: ${productId}`);
        } else {
          console.log(`❌ [WithDetails] Product ${productId} does not exist`);
          // You might want to remove the saved product if the product doesn't exist
          // await deleteDoc(doc(db, 'savedProducts', `${userId}_${productId}`));
        }
      } catch (productError) {
        console.error(`⚠️ [WithDetails] Error fetching product ${productId}:`, productError);
        // Create a placeholder product for inaccessible items
        productsMap.set(productId, {
          id: productId,
          title: 'Product Not Available',
          description: 'This product is no longer available or you do not have permission to view it.',
          status: 'unavailable',
          price: 0,
          category: 'Unavailable',
          images: [],
          views: 0,
          savedCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(),
          sellerVerificationStatus: 'unverified'
        });
        console.log(`📝 [WithDetails] Created placeholder for inaccessible product: ${productId}`);
      }
    }

    console.log('🗂️ [WithDetails] Products map size:', productsMap.size);

    const products = savedItems
      .map(savedItem => {
        const product = productsMap.get(savedItem.productId);
        if (product) {
          return {
            ...product,
            savedId: savedItem.savedId,
            savedAt: savedItem.savedAt
          };
        } else {
          console.log(`🚫 [WithDetails] No product found for saved item: ${savedItem.productId}`);
          return null;
        }
      })
      .filter(product => product !== null);

    console.log('🎉 [WithDetails] Final products array:', products);
    return { 
      success: true, 
      products 
    };
  } catch (error) {
    console.error('💥 [WithDetails] Error getting saved products:', error);
    return {
      success: false,
      error: 'Failed to load saved products.',
      products: []
    };
  }
};

export const getSavedProductsCount = async (userId) => {
  try {
    const savedProductsQuery = query(
      collection(db, 'savedProducts'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(savedProductsQuery);
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    return { success: false, count: 0 };
  }
};

export const checkUserHasSavedProducts = async (userId) => {
  try {
    const savedProductsQuery = query(
      collection(db, 'savedProducts'),
      where('userId', '==', userId),
      limit(1)
    );

    const querySnapshot = await getDocs(savedProductsQuery);
    return { 
      success: true, 
      hasSavedProducts: !querySnapshot.empty,
      count: querySnapshot.size
    };
  } catch (error) {
    console.error('Error checking saved products:', error);
    return { success: false, hasSavedProducts: false };
  }
};

// ==================== MESSAGES & REPORTS ====================

export const sendContactMessage = async (messageData) => {
  try {
    await addDoc(collection(db, 'messages'), {
      ...messageData,
      status: 'unread',
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: 'Failed to send message. Please try again.'
    };
  }
};

export const reportProduct = async (reportData) => {
  try {
    await addDoc(collection(db, 'reports'), {
      ...reportData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error reporting product:', error);
    return {
      success: false,
      error: 'Failed to submit report. Please try again.'
    };
  }
};

// ==================== VERIFICATION SYSTEM ====================

export const submitVerification = async (userId, verificationData) => {
  try {
    await setDoc(doc(db, 'sellerVerifications', userId), {
      ...verificationData,
      status: 'pending',
      submittedAt: serverTimestamp(),
      reviewedAt: null,
      reviewReason: ''
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting verification:', error);
    return {
      success: false,
      error: 'Failed to submit verification request.'
    };
  }
};

export const getVerificationStatus = async (userId) => {
  try {
    const verificationDoc = await getDoc(doc(db, 'sellerVerifications', userId));
    if (verificationDoc.exists()) {
      return {
        success: true,
        data: { 
          id: verificationDoc.id, 
          ...verificationDoc.data(),
          submittedAt: verificationDoc.data().submittedAt?.toDate() || new Date(),
          reviewedAt: verificationDoc.data().reviewedAt?.toDate() || null
        }
      };
    }
    return {
      success: true,
      data: null
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch verification status.'
    };
  }
};