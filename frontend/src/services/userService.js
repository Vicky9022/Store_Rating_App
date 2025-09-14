import api from './api';

export const userService = {
  getAllUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  createUser: async (userData) => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/users/stats');
    return data;
  },

  updateUser: async (userId, userData) => {
    const { data } = await api.put(`/users/${userId}`, userData);
    return data;
  },

  deleteUser: async (userId) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  }
};
export default userService;