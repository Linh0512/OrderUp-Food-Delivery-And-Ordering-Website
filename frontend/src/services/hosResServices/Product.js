import api from "../api";

export const AddDish = async (id, dish) => {
  try {
    const response = await api.post(`/api/dishes/add/${id}`, dish);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const uploadImage = async (selectedFile, token) => {
  if (!selectedFile) {
    console.log("Vui lòng chọn file");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("image", selectedFile);
    const response = await api.post("/api/cloudinary/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
