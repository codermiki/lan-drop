import axios from 'axios';

// Get current hostname (LAN IP) dynamically, not hardcoded localhost
// The port is the express server port '3000'
const getBaseUrl = () => {
  return `http://${window.location.hostname}:3000`;
};

export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onUploadProgress) {
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};
