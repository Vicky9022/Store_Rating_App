import api from './api';

export const storeService = {
  getAllStores: async () => {
    const { data } = await api.get('/stores');
    return data;
  },

  createStore: async (storeData) => {
    const { data } = await api.post('/stores', storeData);
    return data;
  },

  getStore: async (storeId) => {
    const { data } = await api.get(`/stores/${storeId}`);
    return data;
  },

  updateStore: async (storeId, storeData) => {
    const { data } = await api.put(`/stores/${storeId}`, storeData);
    return data;
  },

  deleteStore: async (storeId) => {
    const { data } = await api.delete(`/stores/${storeId}`);
    return data;
  }
};

export default storeService;
