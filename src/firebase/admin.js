import { doc, updateDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './index';

// List of authorized admin emails
export const ADMIN_EMAILS = [
  'semiloreawoniyi@gmail.com',
  'semiloreawoniyi18@gmail.com',
  'admin@unilagyard.com',
  'support@unilagyard.com'
];

// Check if user is admin
export const isAdmin = (user) => {
  return user && ADMIN_EMAILS.includes(user.email);
};

// Update verification status
export const updateVerificationStatus = async (userId, status, reason = '') => {
  try {
    const updateData = {
      status,
      reviewedAt: serverTimestamp(),
      reviewReason: reason
    };

    // Update verification document
    await updateDoc(doc(db, 'sellerVerifications', userId), updateData);

    // Update user document
    await updateDoc(doc(db, 'users', userId), {
      verificationStatus: status
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating verification:', error);
    return {
      success: false,
      error: 'Failed to update verification status.'
    };
  }
};

// Get all verification requests
export const getAllVerifications = async (status = 'pending') => {
  try {
    const verificationsQuery = query(
      collection(db, 'sellerVerifications'),
      where('status', '==', status)
    );
    
    const querySnapshot = await getDocs(verificationsQuery);
    const verifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, verifications };
  } catch (error) {
    console.error('Error getting verifications:', error);
    return {
      success: false,
      error: 'Failed to load verification requests.',
      verifications: []
    };
  }
};

// Get all reports
export const getAllReports = async () => {
  try {
    const reportsQuery = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(reportsQuery);
    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, reports };
  } catch (error) {
    console.error('Error getting reports:', error);
    return {
      success: false,
      error: 'Failed to load reports.',
      reports: []
    };
  }
};

// Update report status
export const updateReportStatus = async (reportId, status) => {
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating report:', error);
    return {
      success: false,
      error: 'Failed to update report status.'
    };
  }
};