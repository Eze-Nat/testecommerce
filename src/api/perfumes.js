import axios from 'axios';

export const fetchPerfumes = async ({ page = 1, search = '', limit = 12 }) => {
  try {
    const response = await axios.get('/api/perfumes', {
      params: {
        page,
        search,
        limit
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cargar perfumes');
  }
};