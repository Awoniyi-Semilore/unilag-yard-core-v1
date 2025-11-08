import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  getDoc,
  arrayUnion,
  arrayRemove,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../pages/firebase';

// Save a product for a user
export const saveProduct = async (userId, productId) => {
  try {
    if (!userId || !productId) {
      throw new Error('User ID and Product ID are required');
    }

    const savedProductRef = doc(db, 'savedProducts', `${userId}_${productId}`);
    
    await setDoc(savedProductRef, {
      userId,
      productId,
      savedAt: new Date(),
    });

    console.log('✅ Product saved successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving product:', error);
    throw error;
  }
};

// Remove a saved product
export const unsaveProduct = async (userId, productId) => {
  try {
    if (!userId || !productId) {
      throw new Error('User ID and Product ID are required');
    }

    const savedProductRef = doc(db, 'savedProducts', `${userId}_${productId}`);
    await deleteDoc(savedProductRef);

    console.log('✅ Product removed from saved items');
    return true;
  } catch (error) {
    console.error('❌ Error removing saved product:', error);
    throw error;
  }
};

// Check if a product is saved by user
export const isProductSaved = async (userId, productId) => {
  try {
    if (!userId || !productId) {
      return false;
    }

    const savedProductRef = doc(db, 'savedProducts', `${userId}_${productId}`);
    const savedProductSnap = await getDoc(savedProductRef);

    return savedProductSnap.exists();
  } catch (error) {
    console.error('❌ Error checking saved product:', error);
    return false;
  }
};

// Get all saved products for a user
export const getSavedProducts = async (userId) => {
  try {
    if (!userId) {
      return [];
    }

    const savedProductsQuery = query(
      collection(db, 'savedProducts'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(savedProductsQuery);
    const savedProductIds = querySnapshot.docs.map(doc => doc.data().productId);

    // If no saved products, return empty array
    if (savedProductIds.length === 0) {
      return [];
    }

    // Fetch the actual product details for each saved product
    const products = [];
    for (const productId of savedProductIds) {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          products.push({
            id: productSnap.id,
            ...productSnap.data(),
            savedId: `${userId}_${productId}` // Include the saved product reference ID
          });
        }
      } catch (error) {
        console.error(`❌ Error fetching product ${productId}:`, error);
      }
    }

    console.log(`✅ Loaded ${products.length} saved products`);
    return products;
  } catch (error) {
    console.error('❌ Error getting saved products:', error);
    return [];
  }
};

// Get saved products count for a user
export const getSavedProductsCount = async (userId) => {
  try {
    if (!userId) {
      return 0;
    }

    const savedProductsQuery = query(
      collection(db, 'savedProducts'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(savedProductsQuery);
    return querySnapshot.size;
  } catch (error) {
    console.error('❌ Error getting saved products count:', error);
    return 0;
  }
};