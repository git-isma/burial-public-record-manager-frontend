import apiService from './api';

export const uploadToS3 = async (file, folder = 'public-records') => {
    try {
        console.log(`📤 Uploading ${file.name} to S3 folder: ${folder}`);

        // Use public presigned URL endpoint (no auth required)
        const response = await apiService.getPresignedUrlPublic(file.name, file.type, folder);
        console.log('🔍 Full API Response:', response);
        console.log('🔍 Response Data:', response.data);

        // Extract from nested data structure: response.data.data contains the presigned URL info
        const { presignedUrl, fileUrl } = response.data.data;
        console.log('🔍 Extracted presignedUrl:', presignedUrl);
        console.log('🔍 Extracted fileUrl:', fileUrl);

        if (!presignedUrl) {
            console.error('❌ presignedUrl is missing from response. Available keys in response.data.data:', Object.keys(response.data.data || {}));
            throw new Error('presignedUrl not found in API response');
        }

        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });

        if (!uploadResponse.ok) {
            throw new Error(`S3 upload failed with status: ${uploadResponse.status}`);
        }

        console.log(`✅ File uploaded successfully: ${fileUrl}`);
        return fileUrl;
    } catch (error) {
        console.error('❌ Error uploading to S3:', error);
        throw new Error(error.response?.data?.msg || error.message || 'Failed to upload file');
    }
};

export const uploadMultipleToS3 = async (files, folder = 'public-records') => {
    const uploadPromises = files.map(file => uploadToS3(file, folder));
    return Promise.all(uploadPromises);
};

export default uploadToS3;
