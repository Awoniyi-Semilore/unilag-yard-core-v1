// imgBB API integration for image uploads
const IMGBB_API_KEY = 'ada23a070ba2c4aa9fdfd4d88a429b26'; // You'll need to get this from imgBB.com

export const uploadToImgBB = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url,
        thumbUrl: data.data.thumb?.url || data.data.url
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Failed to upload image'
      };
    }
  } catch (error) {
    console.error('Error uploading to imgBB:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
};

export const uploadMultipleToImgBB = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadToImgBB(file));
    const results = await Promise.all(uploadPromises);

    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    return {
      success: true,
      images: successfulUploads.map(result => ({
        url: result.url,
        thumbUrl: result.thumbUrl
      })),
      failedCount: failedUploads.length
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return {
      success: false,
      error: 'Failed to upload images',
      images: [],
      failedCount: files.length
    };
  }
};