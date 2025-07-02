import api from "../api";
import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    if (response.data.success) {
      const userData = {
        userId: response.data.userId,
        role: response.data.role,
        token: response.data.token,
        email: email,
        expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(
        import.meta.env.VITE_LOCAL_STORAGE_KEY,
        JSON.stringify(userData)
      );

      return {
        userId: response.data.userId,
        role: response.data.role,
        token: response.data.token,
      };
    }

    return {
      message: response.data?.message || "Đăng nhập thất bại",
    };
  } catch (error) {
    return {
      message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập",
    };
  }
};

export const adminLogin = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    const response = await axios.post("http://localhost:8080/api/admin-auth/login", formData, {
      withCredentials: true
    });
    
    if (response.data.success) {
      const userData = {
        userId: response.data.userId,
        role: response.data.role,
        token: response.data.token,
        email: email,
        expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(
        import.meta.env.VITE_LOCAL_STORAGE_KEY,
        JSON.stringify(userData)
      );

      return {
        userId: response.data.userId,
        role: response.data.role,
        token: response.data.token,
        success: true
      };
    }

    return {
      message: response.data?.message || "Đăng nhập admin thất bại",
      success: false
    };
  } catch (error) {
    return {
      message: error.response?.data || "Đã xảy ra lỗi khi đăng nhập admin",
      success: false
    };
  }
};

export const logout = () => {
  localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
  if (api.defaults && api.defaults.headers.common["Authorization"]) {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getUserResId = async (id, token) => {
  try {
    const res =await api.get(`/api/users/profile/id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(res.data.restaurantInfo)
        return res.data.restaurantInfo.id
    else
        return ""
  } catch (error) {
    console.log(error)
  }
};

export const IsLogin = () => {
  try {
    const userData = JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY)
    );
    if (!userData || !userData.token) return false;

    if (userData.expiresAt && userData.expiresAt < new Date().getTime()) {
      logout();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};

export const getUserData = () => {
  try {
    const userData = JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY)
    );
    if (userData) return userData;
    return {};
  } catch (error) {
    console.log("Error getting user data:", error);
    return {};
  }
};

export const getUserRole = () => {
  try {
    const userData = JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY)
    );
    if (userData) return userData.role;
    return "";
  } catch (error) {
    console.log("Error getting user data:", error);
    return "";
  }
};
