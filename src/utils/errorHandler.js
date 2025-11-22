// Central error handling utility
export const handleFirebaseError = (error, userFriendlyMessage = null) => {
  console.error('Firebase Error:', error);
  
  const errorMap = {
    'permission-denied': 'You do not have permission to perform this action',
    'unauthenticated': 'Please sign in to continue',
    'not-found': 'The requested item was not found',
    'already-exists': 'This item already exists',
    'network-request-failed': 'Network error. Please check your connection',
  };

  const message = userFriendlyMessage || errorMap[error.code] || error.message || 'An unexpected error occurred';
  
  return {
    success: false,
    message,
    originalError: error,
    code: error.code
  };
};

export const withErrorHandling = (fn, errorMessage) => {
  return async (...args) => {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (error) {
      return handleFirebaseError(error, errorMessage);
    }
  };
};