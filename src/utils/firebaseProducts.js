// src/utils/firebaseProducts.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../pages/firebase';

// Get products from Firebase
export const getProducts = async (filters = {}) => {
  try {
    console.log('📦 Fetching products from Firebase with filters:', filters);
    
    let q = collection(db, 'products');
    
    // Apply filters
    const conditions = [where('isActive', '==', true)];
    
    if (filters.featured) {
      conditions.push(where('featured', '==', true));
    }
    
    if (filters.category) {
      conditions.push(where('category', '==', filters.category));
    }
    
    if (filters.subcategory) {
      conditions.push(where('subcategory', '==', filters.subcategory));
    }
    
    // FIXED: Create query with all conditions
    q = query(q, ...conditions);
    
    const snapshot = await getDocs(q);
    const products = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    // FIXED: Improved fallback search
    if (products.length === 0 && filters.subcategory) {
      console.log('🔍 No exact matches found, trying case-insensitive search...');
      const allProducts = await getProducts({ category: filters.category });
      const filtered = allProducts.filter(product => 
        product.subcategory?.toLowerCase().includes(filters.subcategory.toLowerCase())
      );
      return filtered;
    }
    
    console.log(`✅ Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error getting products:', error);
    // FIXED: Better error handling
    if (error.code === 'failed-precondition') {
      console.warn('Firestore index needs to be created. Please check Firebase console.');
    }
    return [];
  }
};

// Add sample data to Firebase
export const addSampleProducts = async () => {
  const sampleProducts = [
    {
      title: "Macbook Pro 2020 M1 Chip",
      price: 350000,
      description: "8GB RAM, 256GB SSD, perfect condition for coding and design.",
      category: "Electronics & Gadgets",
      subcategory: "Laptops & Computers",
      location: "Moremi Hall",
      condition: "Like New",
      featured: true,
      sellerId: "demo-seller-1",
      views: 124,
      isVerified: true,
      isActive: true,
      createdAt: serverTimestamp()
    },
    {
      title: "Chemistry Textbook - 200 Level",
      price: 5000,
      description: "Essential chemistry textbook, no highlights or writings.",
      category: "Textbooks & Academic",
      subcategory: "Core Course Textbooks", 
      location: "Faculty of Science",
      condition: "Excellent",
      featured: true,
      sellerId: "demo-seller-2",
      views: 89,
      isVerified: true,
      isActive: true,
      createdAt: serverTimestamp()
    },
    {
      title: "Portable Room Heater",
      price: 8000,
      description: "Perfect for cold nights in the hostel. Energy efficient.",
      category: "Hostel & Room Essentials",
      subcategory: "Cooking Appliances",
      location: "Mariere Hall", 
      condition: "Good",
      featured: false,
      sellerId: "demo-seller-3",
      views: 67,
      isVerified: false,
      isActive: true,
      createdAt: serverTimestamp()
    }
  ];

  try {
    console.log('🌱 Adding sample products to Firebase...');
    
    const results = [];
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), product);
      results.push(docRef.id);
    }
    
    console.log('✅ Sample products added successfully!', results);
    return true;
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
    return false;
  }
};

// FIXED: Added missing function to get product by ID
export const getProductById = async (productId) => {
  try {
    const products = await getProducts();
    return products.find(product => product.id === productId) || null;
  } catch (error) {
    console.error('❌ Error getting product by ID:', error);
    return null;
  }
};