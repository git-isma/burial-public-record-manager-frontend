import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Public axios instance (no auth required)
const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_ENDPOINTS = {
  RECORDS: {
    LIST: '/records',
    GET: (id) => `/records/${id}`,
    CREATE: '/records',
    UPDATE: (id) => `/records/${id}`,
    DELETE: (id) => `/records/${id}`,
    BULK_DELETE: '/records',
  },
  PUBLIC: {
    SUBMIT_RECORD: '/public/submit-record',
    GET_PUBLIC_RECORDS: '/public/records',
    PRESIGNED_URL: '/public/presigned-url',
    LOCATIONS: '/locations',
  },
  UPLOAD: {
    PRESIGNED_URL: '/upload/presigned-url',
  },
};

const apiService = {
  // Authenticated API methods
  getRecords: (params) => axiosInstance.get(API_ENDPOINTS.RECORDS.LIST, { params }),
  getRecord: (id) => axiosInstance.get(API_ENDPOINTS.RECORDS.GET(id)),
  createRecord: (data) => axiosInstance.post(API_ENDPOINTS.RECORDS.CREATE, data),
  updateRecord: (id, data) => axiosInstance.put(API_ENDPOINTS.RECORDS.UPDATE(id), data),
  deleteRecord: (id) => axiosInstance.delete(API_ENDPOINTS.RECORDS.DELETE(id)),
  bulkDeleteRecords: (recordIds) => axiosInstance.delete(API_ENDPOINTS.RECORDS.BULK_DELETE, { data: { recordIds } }),
  getPresignedUrl: (fileName, fileType, folder) =>
    axiosInstance.post(API_ENDPOINTS.UPLOAD.PRESIGNED_URL, { fileName, fileType, folder }),

  // Public API methods (no auth required)
  submitRecordPublic: (data) => publicAxiosInstance.post(API_ENDPOINTS.PUBLIC.SUBMIT_RECORD, data),
  getPublicRecords: (filters) => {
    const params = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.status) params.status = filters.status;
    if (filters?.deceasedName) params.deceasedName = filters.deceasedName;
    if (filters?.applicantEmail) params.applicantEmail = filters.applicantEmail;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    return publicAxiosInstance.get(API_ENDPOINTS.PUBLIC.GET_PUBLIC_RECORDS, { params });
  },
  getPresignedUrlPublic: (fileName, fileType, folder) =>
    publicAxiosInstance.post(API_ENDPOINTS.PUBLIC.PRESIGNED_URL, { fileName, fileType, folder }),
  getLocations: () => publicAxiosInstance.get(API_ENDPOINTS.PUBLIC.LOCATIONS),
};

export default apiService;
