import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './index';

// Upload image to Firebase Storage
export const uploadImage = async (file, folder = 'products') => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${folder}/${timestamp}_${randomString}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.'
    };
  }
};

// Delete image from storage
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: 'Failed to delete image.'
    };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'products') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);
    
    return {
      success: true,
      images: successfulUploads.map(result => result.url),
      failedCount: failedUploads.length
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return {
      success: false,
      error: 'Failed to upload images.',
      images: [],
      failedCount: files.length
    };
  }
};