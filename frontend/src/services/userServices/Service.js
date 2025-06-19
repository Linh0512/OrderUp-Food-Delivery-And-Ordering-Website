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

export const getCart = async (id, token) => {
  try {
    const response = await api.get(`/api/cart/${id}`, {
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

export const getHistotyData = async (id, token) => {
  try {
    const response = await api.get(`/api/orders/userId/${id}`, {
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

export const getHistotyDetail=async(id,token)=>{
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
}

export const getReview=async(id)=>{
  try {
    const response = await api.get(`/api/reviews/restaurant/${id}`);
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error);
    return {};
  }
}

export const getVoucher=async(id,token)=>{
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
}
