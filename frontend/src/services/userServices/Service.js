import api from "../api";

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
      console.log(response);
      return { data: data.data, count: data.count };
    } else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getShopById = async (id, token) => {
  try {
    const response = await api.get(`/api/shop/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getShopDetail = async (id, token) => {
  try {
    const response = await api.get(`/api/restaurant-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getCart = async (token) => {
  try {
    const response = await api.get(`/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const addCart = async (token, item) => {
  try {
    const response = await api.post(`/api/cart/add`, item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const updateCart = async (id, token, item, index) => {
  try {
    const response = await api.put(`/api/cart/${id}/item/${index}`, item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const deleteCart = async (id, token, index) => {
  try {
    const response = await api.delete(`/api/cart/${id}/item/${index}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getUserProfile = async (id, token) => {
  try {
    const response = await api.get(`/api/users/profile/id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const updatedUser = async (id, user, token) => {
  try {
    const response = await api.put(`/api/users/profile/id/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getHistotyData = async (token, page, size) => {
  try {
    const response = await api.get(
      `/api/orders/userId?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getHistotyDetail = async (id, token) => {
  try {
    const response = await api.get(`/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getReview = async (id) => {
  try {
    const response = await api.get(`/api/reviews/restaurant/${id}`);
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const addReview = async (orderId, token, review) => {
  try {
    const response = await api.post(`/api/reviews/order/${orderId}`, review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) console.log("thành công");
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getVoucher = async (id, token) => {
  try {
    const response = await api.get(`/api/user/vouchers/restaurant/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const UseVoucher = async (code, token) => {
  try {
    const res = await api.post(`/api/user/vouchers/${code}/use`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data) return res.data;
    else return {};
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (token, oldPass, newPass, newPass1) => {
  console.log(token);
  const pass = {
    oldPassword: oldPass,
    newPassword: newPass,
    confirmNewPassword: newPass1,
  };
  try {
    const response = await api.post(`/api/users/password/update`, pass, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getAddress = async (id, token) => {
  try {
    const response = await api.get(`/api/users/profile/id/${id}/address`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const addAddress = async (id, token, address) => {
  try {
    const response = await api.post(
      `/api/users/profile/id/${id}/address`,
      address,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const deleteAddress = async (id, token, index) => {
  try {
    const response = await api.delete(
      `/api/users/profile/id/${id}/address/${index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const updateAddress = async (id, token, address, index) => {
  try {
    const response = await api.put(
      `/api/users/profile/id/${id}/address/${index}`,
      address,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const createOrder = async (token, order) => {
  try {
    const response = await api.post(`/api/cart/checkout`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getCartForCheck = async (id, token) => {
  try {
    const response = await api.get(`/api/cart/restaurant/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
  }
};
