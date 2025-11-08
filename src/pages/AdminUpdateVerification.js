import { doc, updateDoc, getFirestore } from 'firebase/firestore';

export const updateVerificationStatus = async (userId, status, reason = '') => {
  const db = getFirestore();
  
  try {
    // Update verification document
    await updateDoc(doc(db, 'sellerVerifications', userId), {
      status: status,
      reviewedAt: new Date(),
      reviewReason: reason
    });

    // Update user document
    await updateDoc(doc(db, 'users', userId), {
      verificationStatus: status
    });

    // Here you can add email sending logic
    // sendVerificationEmail(userId, status, reason);

    return true;
  } catch (error) {
    console.error('Error updating verification:', error);
    return false;
  }
};

// Usage in admin panel:
// await updateVerificationStatus('user123', 'approved');
// await updateVerificationStatus('user123', 'rejected', 'Document image is blurry');