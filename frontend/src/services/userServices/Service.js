// const API_BASE_URL = 'http://localhost:8080/api/shop';

import api from "../api";

// export const restaurantService = {
//     getAllShops: async (page = 0, size = 10) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 credentials: 'include',
//                 mode: 'cors'
//             });

//             if (!response.ok) {
//                 const errorData = await response.text();
//                 throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Chi tiết lỗi:', error);
//             throw error;
//         }
//     },

//   searchShops: async (name, page = 0, size = 10) => {
//     const response = await fetch(`${API_BASE_URL}/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);
//     return response.json();
//   },

//   getFeaturedShops: async (page = 0, size = 10) => {
//     const response = await fetch(`${API_BASE_URL}/featured?page=${page}&size=${size}`);
//     return response.json();
//   },

//   getShopsByCuisine: async (cuisineType, page = 0, size = 10) => {
//     const response = await fetch(`${API_BASE_URL}/cuisine/${cuisineType}?page=${page}&size=${size}`);
//     return response.json();
//   },

//   getShopsByCity: async (city, page = 0, size = 10) => {
//     const response = await fetch(`${API_BASE_URL}/city/${encodeURIComponent(city)}?page=${page}&size=${size}`);
//     return response.json();
//   }
// };

export const getAllShops = async (page, size) => {
  try {
    const response = await api.get(`/api/shop?page=${page}&size=${size}`);
    if (response.data) {
      const data = response.data;
      return { data: data.data, count: data.count };
    } else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getShopsByCuisine = async (cuisine, page, size) => {
  try {
    const response = await api.get(
      `api/shop/cuisine/${cuisine}?page=${page}&size=${size}`
    );
    if (response.data) {
      const data = response.data;
      console.log(response)
      return { data: data.data, count: data.count };
    } else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getShopById=async(id,token)=>{
  try {
    const response=await api.get(`/api/shop/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if(response.data)
      return response.data
    else return {}
  } catch (error) {
    console.log(error);
    return {};
  }
}

export const getShopDetail=async(id,token)=>{
  try {
    const response=await api.get(`/api/restaurant-detail/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if(response.data)
      return response.data
    else return {}
  } catch (error) {
    console.log(error);
    return {};
  }
}

export const getCart=async(id,token)=>{
  try {
    const response=await api.get(`/api/cart/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if(response.data)
      return response.data
    else return {}
  } catch (error) {
    console.log(error);
    return {};
  }
}

