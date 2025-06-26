import api from "../api";

export const getDashboardData = async (id, token) => {
  try {
    const response = await api.get(`/api/restaurants/${id}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return {};
  } catch (error) {
    console.log(error)
    return {};
  }
};

export const getOrderData=async(id,token)=>{
    try {
    const response = await api.get(`/api/orders/restaurantId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error)
    return {};
  }
}

export const getVoucher=async(id,token)=>{
  try {
    const response = await api.get(`/api/restaurants/${id}/vouchers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error)
    return {};
  }
}

export const addVoucher=async(id,token,voucher)=>{
  try {
    const response = await api.post(`/api/restaurants/${id}/vouchers`,voucher, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error)
    return {};
  }
}
