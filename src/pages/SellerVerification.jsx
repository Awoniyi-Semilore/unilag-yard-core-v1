import React, { useState } from 'react';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../component/CSS/verification.css';

const SellerVerification = ({ onSubmitted }) => {
  const [matricNumber, setMatricNumber] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const db = getFirestore();
  const auth = getAuth();

  // Your imgbb API key
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a JPG or PNG image file');
        setDocumentFile(null);
        return;
      }
      
      if (file.size > maxSize) {
        setUploadError('File size should be less than 5MB');
        setDocumentFile(null);
        return;
      }
      
      setDocumentFile(file);
      setUploadError('');
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // ✅ Correct - file is a File object
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Upload failed');
      }
      
      return result.data;
    } catch (error) {
      console.error('imgBB upload error:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleVerification = async () => {
    if (!matricNumber || !documentFile) {
      alert('Please fill all fields');
      return;
    }

    // Validate matric number format
    const matricRegex = /^\d{9}$/;
    if (!matricRegex.test(matricNumber)) {
      alert('Please enter a valid 9-digit matriculation number');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please log in to submit verification');
      }

      console.log('Starting imgbb upload...');

      // Upload to imgbb
      const imgbbResult = await uploadToImgBB(documentFile);
      console.log('imgbb upload successful:', imgbbResult);

      const documentUrl = imgbbResult.url;
      const deleteUrl = imgbbResult.delete_url;

      // Save to Firestore
      await setDoc(doc(db, 'sellerVerifications', user.uid), {
        matricNumber: matricNumber,
        documentUrl: documentUrl,
        deleteUrl: deleteUrl,
        imageId: imgbbResult.id,
        status: 'pending',
        submittedAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        fileName: documentFile.name,
        fileSize: documentFile.size,
        uploadedVia: 'imgbb'
      });

      // Update user document
      await setDoc(doc(db, 'users', user.uid), {
        verificationStatus: 'pending',
        matricNumber: matricNumber,
        lastVerificationSubmit: new Date()
      }, { merge: true });

      console.log('Verification process completed successfully');
      alert('✅ Verification submitted successfully! We will review it within 24 hours.');
      onSubmitted();

    } catch (error) {
      console.error('Full verification error:', error);
      
      let errorMessage = 'Verification failed. ';
      
      if (error.message.includes('Upload failed')) {
        errorMessage += 'Image upload failed. Please try again.';
      } else if (error.message.includes('log in')) {
        errorMessage += 'Please log in and try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setUploadError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="verification-modal">
      <div className="verification-content">
        <h2>Verify Your UNILAG Status</h2>
        <p>Required to start selling on Unilag Yard</p>

        <div className="verification-form">
          <div className="input-group">
            <label>Matriculation Number *</label>
            <input
              type="text"
              placeholder="e.g., 180401001"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              maxLength="9"
            />
            <small>Must be 9 digits only</small>
          </div>

          <div className="input-group">
            <label>Upload Student ID or Document *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
            <small>JPG or PNG only, maximum 5MB</small>
          </div>

          {uploadError && (
            <div className="error-message">
              ⚠️ {uploadError}
            </div>
          )}

          {documentFile && (
            <div className="file-preview">
              <p>✅ Selected: {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          )}

          <div className="verification-note">
            <p><strong>Note:</strong> Your document should clearly show your name and matric number. We'll verify it matches your account.</p>
            <p><strong>Accepted documents:</strong> UNILAG ID card, Course registration form, Exam docket</p>
          </div>

          <div className="button-group">
            <button 
              onClick={handleVerification}
              disabled={isUploading || !matricNumber || !documentFile || uploadError}
              className="verify-btn"
            >
              {isUploading ? '📤 Uploading...' : '✅ Submit for Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;