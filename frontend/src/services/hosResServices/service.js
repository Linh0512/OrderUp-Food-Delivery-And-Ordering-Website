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
    console.log(error);
    return {};
  }
};

export const getOrderData = async (id, token) => {
  try {
    const response = await api.get(`/api/orders/restaurantId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getVoucher = async (id, token) => {
  try {
    const response = await api.get(`/api/restaurants/${id}/vouchers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const addVoucher = async (id, token, voucher) => {
  try {
    const response = await api.post(
      `/api/restaurants/${id}/vouchers`,
      voucher,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const deleteVoucher = async (id, token, voucherId) => {
  try {
    await api.delete(`/api/restaurants/${id}/vouchers/${voucherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const updateVoucher = async (id, token, voucher,voucherId) => {
  try {
    const response = await api.put(
      `/api/restaurants/${id}/vouchers/${voucherId}`,
      voucher,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getResData=async(id,token)=>{
  try {
    const response = await api.get(
      `/api/restaurant-detail/${id}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
    return {};
  }
}

export const updateResData=async(id,token,data)=>{
  try {
    const response = await api.put(
      `/api/restaurant-detail/${id}/profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) return response.data;
    else return [];
  } catch (error) {
    console.log(error);
    return {};
  }
}
