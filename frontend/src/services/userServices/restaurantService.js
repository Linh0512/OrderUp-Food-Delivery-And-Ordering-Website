const API_BASE_URL = 'http://localhost:8080/api/shop';

export const restaurantService = {
    getAllShops: async (page = 0, size = 10) => {
        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            throw error;
        }
    },

  searchShops: async (name, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);
    return response.json();
  },

  getFeaturedShops: async (page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/featured?page=${page}&size=${size}`);
    return response.json();
  },

  getShopsByCuisine: async (cuisineType, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/cuisine/${cuisineType}?page=${page}&size=${size}`);
    return response.json();
  },

  getShopsByCity: async (city, page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/city/${encodeURIComponent(city)}?page=${page}&size=${size}`);
    return response.json();
  }
};