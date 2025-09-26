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

// Get products from Firebase - SINGLE FUNCTION DEFINITION
export const getProducts = async (filters = {}) => {
  try {
    console.log('📦 Fetching products from Firebase with filters:', filters);
    
    let q = collection(db, 'products');
    
    // Apply filters
    if (filters.featured) {
      q = query(q, where('featured', '==', true));
    }
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.subcategory) {
      q = query(q, where('subcategory', '==', filters.subcategory));
    }
    
    // Only get active products
    q = query(q, where('isActive', '==', true));
    // Remove orderBy temporarily to avoid index issues: , orderBy('createdAt', 'desc')
    
    const snapshot = await getDocs(q);
    const products = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: doc.id, 
        ...data,
        // Convert Firestore timestamp to date
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    // 🔥 NEW: If no products found with exact match, try case-insensitive fallback
    if (products.length === 0 && filters.subcategory) {
      console.log('🔍 No exact matches found, trying case-insensitive search...');
      const allProducts = await getProducts({ category: filters.category });
      const filtered = allProducts.filter(product => 
        product.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase())
      );
      return filtered;
    }
    
    console.log(`✅ Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error getting products:', error);
    return []; // Return empty array instead of crashing
  }
};

// Add sample data to Firebase (run this once)
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
    
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }
    
    console.log('✅ Sample products added successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
    return false;
  }
};